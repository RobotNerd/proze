import { Chapter } from '../components/chapter';
import { Component } from '../components/component';
import { ConfigHeaderFooterSlots, HeaderFooterValue } from '../util/config';
import { ConfigInterface } from '../util/config';
import { EmphasisType } from '../components/line';
import { Formatting } from '../util/config';
import { ProjectMetadata } from '../components/metadata';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Token } from '../components/token';

import type { Formatter } from './formatter';
import type { Content, ContextPageSize, Margins, TDocumentDefinitions } from 'pdfmake/interfaces';

import PdfPrinter = require("pdfmake");
import * as fs from 'fs';
import { EmDash } from '../components/em-dash';

const BlockquoteTabStop: number = 25;
const HeaderFooterMargin = {
    vertical: 8,
    horizontal: 40,
};
const LeadingWhitespace = "      ";


export class PdfFormatter implements Formatter {

    private blockquoteLevel: number = 0;
    private currentTextBlock: Content[] = [];
    private docDefinition: TDocumentDefinitions;
    private isFirstParagraphOfChapter: boolean = true;
    private isFirstParagraphOfSection: boolean = false;
    private printer: PdfPrinter;

    constructor(
        private projectMetadata: ProjectMetadata,
        private components: Component[],
        private config: ConfigInterface | null
    ) {
        this.docDefinition = {
            pageSize: 'A5',
            content: [],
            header: (currentPage: number, _pageCount: number, _pageSize: ContextPageSize): Content => {
                if (currentPage % 2 === 0) {
                    if (config?.compile?.header?.even) {
                        return this.formatHeaderOrFooter(config?.compile?.header?.even, currentPage)
                    }
                }
                if (config?.compile?.header?.odd) {
                    return this.formatHeaderOrFooter(config?.compile?.header?.odd, currentPage);
                }
                return { text: '' };
            },
            footer: (currentPage: number, _pageCount: number, _pageSize: ContextPageSize): Content => {
                if (currentPage % 2 === 0) {
                    if (config?.compile?.footer?.even) {
                        return this.formatHeaderOrFooter(config?.compile?.footer?.even, currentPage)
                    }
                }
                if (config?.compile?.footer?.odd) {
                    return this.formatHeaderOrFooter(config?.compile?.footer?.odd, currentPage);
                }
                return { text: '' };
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
                headerAndFooterCenter: {
                    alignment: 'center',
                    margin: [
                        0,
                        HeaderFooterMargin.vertical,
                        0,
                        HeaderFooterMargin.vertical],
                },
                headerAndFooterLeft: {
                    alignment: 'center',
                    margin: [
                        HeaderFooterMargin.horizontal,
                        HeaderFooterMargin.vertical,
                        0,
                        HeaderFooterMargin.vertical],
                },
                headerAndFooterRight: {
                    alignment: 'center',
                    margin: [
                        0,
                        HeaderFooterMargin.vertical,
                        HeaderFooterMargin.horizontal,
                        HeaderFooterMargin.vertical],
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

    private addChapter(chapter: Chapter) {
        this.isFirstParagraphOfChapter = true;
        this.isFirstParagraphOfSection = false;
        (this.docDefinition.content as Content[]).push({
            pageBreak: 'before',
            style: 'chapter',
            text: chapter.getOutput(),
            tocItem: true,
        });
    }

    private addEmDash(emdash: EmDash) {
        this.currentTextBlock.push({
            text: emdash.toUnicode(),
        });
    }

    private addLeadingWhitesapace() {
        let shouldIndent: boolean = false;
        if (this.config?.compile?.formatting === Formatting.standard) {
            if (this.isFirstParagraphOfChapter) {
                this.isFirstParagraphOfChapter = false;
                shouldIndent = this.config.compile?.indentFirst?.chapter!;
            }
            else if (this.isFirstParagraphOfSection) {
                this.isFirstParagraphOfSection = false;
                shouldIndent = this.config.compile?.indentFirst?.section!;
            }
            else {
                shouldIndent = true;
            }
        }

        if (shouldIndent) {
            this.currentTextBlock.unshift({
                text: LeadingWhitespace,
                style: { preserveLeadingSpaces: true },
            });
        }
    }

    private addSection(section: Section) {
        this.isFirstParagraphOfChapter = false;
        this.isFirstParagraphOfSection = true;
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
        this.blockquoteLevel = text.blockquoteLevel;
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
            this.addLeadingWhitesapace();
            (this.docDefinition.content as Content[]).push({
                text: this.currentTextBlock,
                margin: this.textMargin()
            });
            this.currentTextBlock = [];
        }
        if (this.config?.compile?.formatting === Formatting.block) {
            (this.docDefinition.content as Content[]).push('\n\n');
        }
        this.blockquoteLevel = 0;
    }

    private formatHeaderOrFooter(slots: ConfigHeaderFooterSlots, currentPage: number): Content {
        let center: string = '';
        let left: string = '';
        let right: string = '';

        if (slots.center) {
            center = this.getHeaderFooterValue(slots.center, currentPage);
        }
        if (slots.left) {
            left = this.getHeaderFooterValue(slots.left, currentPage);
        }
        if (slots.right) {
            right = this.getHeaderFooterValue(slots.right, currentPage);
        }

        return {
            columns: [
                { text: left, alignment: 'left', style: 'headerAndFooterLeft' },
                { text: center, alignment: 'center', style: 'headerAndFooterCenter' },
                { text: right, alignment: 'right', style: 'headerAndFooterRight' },
            ],
        }
    }

    private getHeaderFooterValue(headerFooterValue: HeaderFooterValue, currentPage: number): string {
        let value: string = '';
        switch(headerFooterValue) {
            case HeaderFooterValue.author:
                value = this.projectMetadata.author ? this.projectMetadata.author.name : '';
                break;
            case HeaderFooterValue.chapter:
                // TODO - need to keep track of current chapter title
                break;
            case HeaderFooterValue.page:
                value = `${currentPage}`;
                break;
            case HeaderFooterValue.title:
                value = this.projectMetadata.title ? this.projectMetadata.title.name : '';
                break;
            default:
                console.warn(
                    `WARNING: Ignoring invalid header/footer value from config: ${headerFooterValue}`
                );
        }
        return value;
    }

    private generateDoc(): PDFKit.PDFDocument {
        this.addTitle();
        this.addTOC();

        for (let i = 0; i < this.components.length; i++) {
            let component = this.components[i];
            switch (component.token) {
                case Token.chapter:
                    this.addChapter(component as Chapter);
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
        if (this.config?.compile?.formatting === Formatting.standard) {
            // Add vertical space above/below section break.
            return [0, 10, 0, 10];
        }
        return 0;
    }

    private textMargin(): Margins {
        if (this.blockquoteLevel > 0) {
            let horizontal = this.blockquoteLevel * BlockquoteTabStop;
            return [horizontal, 10, horizontal, 10];
        }
        return 0;
    }

    writeToFile(path: string): void {
        let pdfDoc: PDFKit.PDFDocument = this.generateDoc();
        pdfDoc.pipe(fs.createWriteStream(path));
        pdfDoc.end();
    }
}
