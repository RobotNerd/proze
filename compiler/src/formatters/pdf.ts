import { Chapter } from '../components/chapter';
import { Component } from '../components/component';
import { EmphasisType } from '../components/line';
import { ProjectMetadata } from '../components/metadata';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Token } from '../components/token';

import type { Formatter } from './formatter';
import type { Content, ContextPageSize, TDocumentDefinitions } from 'pdfmake/interfaces';

import PdfPrinter = require("pdfmake");
import * as fs from 'fs';

const LEADING_WHITESPACE = "      ";

export class PdfFormatter implements Formatter {

    private currentTextBlock: Content[] = [];
    private docDefinition: TDocumentDefinitions;
    private printer: PdfPrinter;

    constructor(
        private projectMetadata: ProjectMetadata,
        private components: Component[]
    ) {
        this.docDefinition = {
            pageSize: 'A5',
            content: [],
            footer: this.formatFooter,
            header: (currentPage: number, _pageCount: number, _pageSize: ContextPageSize) => {
                const title = this.projectMetadata.title ? this.projectMetadata.title.name : '';
                return this.formatHeader(currentPage, title);
            },
            styles: {
                author: {
                    alignment: 'center',
                    fontSize: 18,
                },
                chapter: {
                    bold: true,
                    fontSize: 18,
                    margin: [0, 0, 0, 18],
                },
                footer: {
                    alignment: 'center',
                },
                header: {
                    alignment: 'center',
                    margin: [0, 8, 0, 0],
                },
                sectionName: {
                    bold: true,
                    fontSize: 12,
                },
                sectionSymbol: {
                    alignment: 'center',
                    bold: true,
                    fontSize: 12,
                },
                title: {
                    alignment: 'center',
                    bold: true,
                    fontSize: 30,
                    margin: [0, 200, 0, 0],
                },
            }
        };

        // TODO default fonts and load font paths from config
        this.printer = new PdfPrinter({
            Roboto: {
                normal: '/tmp/fonts/Roboto-Regular.ttf',
                bold: '/tmp/fonts/Roboto-Medium.ttf',
                italics: '/tmp/fonts/Roboto-Italic.ttf',
                bolditalics: '/tmp/fonts/Roboto-MediumItalic.ttf'
            }
        });
    }

    private addSection(section: Section) {
        (this.docDefinition.content as Content[]).push({
            text: section.getOutput(),
            style: section.isNamed() ? 'sectionName' : 'sectionSymbol',
        });
    }

    private addText(text: Text) {
        let style = {
            bold: false,
            italics: false,
        };
        if (text.emphasis.indexOf(EmphasisType.bold) >= 0) {
            style.bold = true;
        }
        if (text.emphasis.indexOf(EmphasisType.italic) >= 0) {
            style.italics = true;
        }
        this.currentTextBlock.push({
            text: text.text,
            style: style,
        });
    }

    private addTitle() {
        if (this.projectMetadata.title) {
            (this.docDefinition.content as Content[]).push({
                text: this.projectMetadata.title.name,
                style: 'title',
            });
        }

        if (this.projectMetadata.author) {
            (this.docDefinition.content as Content[]).push({
                text: `by ${this.projectMetadata.author.name}\n`,
                style: 'author',
        });
        }

        (this.docDefinition.content as Content[]).push({
            text: '',
            pageBreak: 'after',
        });
    }

    private addTOC() {
        (this.docDefinition.content as Content[]).push({
            toc: {
                title: {
                    text: 'Table of Contents',
                    style: 'chapter',
                },
            }
        });
    }

    private endOfFile(i: number) {
        if (this.currentTextBlock.length > 0) {
            // A hanging paragraph can occur when a block comment is started in
            // the middle of a paragraph but there's no closing block comment
            // token before EOF.
            this.endParagraph(i);
        }
    }

    private endParagraph(i: number) {
        if (this.currentTextBlock.length > 0) {
            // Add the leading tab at the beginning of the paragraph.
            this.currentTextBlock.unshift({
                text: LEADING_WHITESPACE,
                style: { preserveLeadingSpaces: true },
            });
            (this.docDefinition.content as Content[]).push({
                text: this.currentTextBlock
            });
            this.currentTextBlock = [];
        }
        if (this.isLastComponent(i)) {
            (this.docDefinition.content as Content[]).push('\n');
        }
        else {
            (this.docDefinition.content as Content[]).push('\n\n');
        }
    }

    private formatFooter(currentPage: number, pageCount: number) {
        if (currentPage === 1) {
            return '';
        }
        return {
            text: currentPage.toString() + ' of ' + pageCount,
            style: 'footer',
        };
    };

    private formatHeader(currentPage: number, title: string): Content {
        if (currentPage === 1) {
            return '';
        }
        return {
            text: title,
            style: 'header',
        };
    }

    private generateDoc(): PDFKit.PDFDocument {
        this.addTitle();
        this.addTOC();

        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            switch (component.token) {
                case Token.chapter:
                    this.startChapter(component as Chapter);
                    break;
                case Token.end_paragraph:
                    this.endParagraph(i);
                    break;
                case Token.eof:
                    this.endOfFile(i);
                    break;
                case Token.section:
                    this.addSection(component as Section);
                    break;
                case Token.text:
                    this.addText(component as Text);
                    break;
            }
        }

        return this.printer.createPdfKitDocument(this.docDefinition);
    }

    getContent(): string {
        return "WARNING: You need to provide the path to the file name (--file arg) for pdf documents.";
    }

    private isLastComponent(i: number) {
        return (i == this.components.length - 1) ||
            (i == this.components.length - 2 && this.components[i + 1].token == Token.eof);
    }

    private startChapter(chapter: Chapter) {
        (this.docDefinition.content as Content[]).push({
            pageBreak: 'before',
            style: 'chapter',
            text: chapter.getOutput(),
            tocItem: true,
        });
    }

    writeToFile(path: string): void {
        let pdfDoc: PDFKit.PDFDocument = this.generateDoc();
        pdfDoc.pipe(fs.createWriteStream(path));
        pdfDoc.end();
    }
}
