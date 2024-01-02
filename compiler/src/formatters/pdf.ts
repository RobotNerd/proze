import { Chapter } from '../components/chapter';
import { Component } from '../components/component';
import { ConfigInterface } from '../util/config';
import { EmphasisType } from '../components/line';
import { ProjectMetadata } from '../components/metadata';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Token } from '../components/token';

import type { Formatter } from './formatter';
import type { Content, ContextPageSize, Margins, TDocumentDefinitions } from 'pdfmake/interfaces';

import PdfPrinter = require("pdfmake");
import * as fs from 'fs';
import { EmDash } from '../components/em-dash';

const LeadingWhitespace = "      ";
const IndentationTabStop: number = 6;

export class PdfFormatter implements Formatter {

    private currentTextBlock: Content[] = [];
    private docDefinition: TDocumentDefinitions;
    private printer: PdfPrinter;

    constructor(
        private projectMetadata: ProjectMetadata,
        private components: Component[],
        private config: ConfigInterface | null
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
                    margin: this.sectionMargin(),
                },
                sectionSymbol: {
                    alignment: 'center',
                    bold: true,
                    fontSize: 12,
                    margin: this.sectionMargin(),
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

    private addEmDash(emdash: EmDash) {
        this.currentTextBlock.push({
            text: emdash.toUnicode(),
        });
    }

    private addLeadingWhitesapace() {
        if (this.config?.compile?.indent) {
            this.currentTextBlock.unshift({
                text: LeadingWhitespace,
                style: { preserveLeadingSpaces: true },
            });
        }
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
            margin: this.textMargin(text),
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
            this.addLeadingWhitesapace();
            (this.docDefinition.content as Content[]).push({
                text: this.currentTextBlock
            });
            this.currentTextBlock = [];
        }
        if (!this.config?.compile?.indent) {
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
                case Token.emdash:
                    this.addEmDash((component as EmDash));
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

    private sectionMargin(): Margins {
        if (this.config?.compile?.indent) {
            return [0, 10, 0, 10];
        }
        return 0;
    }

    private textMargin(text: Text): Margins {
        if (text.indentation > 0) {
            return [text.indentation * IndentationTabStop, 10, 0, 10];
        }
        return 0;
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
