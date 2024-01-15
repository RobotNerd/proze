import { Chapter } from '../components/chapter';
import { CompilerDirective, DirectiveType } from "../util/compiler-directive";
import { Component } from '../components/component';
import { Config, ConfigHeaderFooterSlots, HeaderFooterValue } from '../util/config';
import { EmphasisType } from '../parse/line';
import { Formatting } from '../util/config';
import { Metadata } from '../parse/metadata';
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
    private indentOverride: CompilerDirective | null = null;
    private isFirstParagraphOfChapter: boolean = true;
    private isFirstParagraphOfSection: boolean = false;
    private printer: PdfPrinter;

    constructor(private components: Component[]) {
        let config = Config.get();
        this.docDefinition = {
            pageSize: 'A5',
            content: [],
            header: (currentPage: number, _pageCount: number, _pageSize: ContextPageSize): Content => {
                if (currentPage % 2 === 0) {
                    if (config.compile?.header?.even) {
                        return this.formatHeaderOrFooter(config.compile?.header?.even, currentPage)
                    }
                }
                if (config.compile?.header?.odd) {
                    return this.formatHeaderOrFooter(config.compile?.header?.odd, currentPage);
                }
                return { text: '' };
            },
            footer: (currentPage: number, _pageCount: number, _pageSize: ContextPageSize): Content => {
                if (currentPage % 2 === 0) {
                    if (config.compile?.footer?.even) {
                        return this.formatHeaderOrFooter(config.compile?.footer?.even, currentPage)
                    }
                }
                if (config.compile?.footer?.odd) {
                    return this.formatHeaderOrFooter(config.compile?.footer?.odd, currentPage);
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
                sectionWhitespace: {
                    margin: this.sectionWhitespaceMargin(),
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
        let config = Config.get();
        let shouldIndent: boolean = false;
        if (this.indentOverride !== null) {
            if (this.indentOverride.directiveType === DirectiveType.indent) {
                shouldIndent = true;
            }
            else if (this.indentOverride.directiveType === DirectiveType.unindent) {
                shouldIndent = false;
            }
            else {
                console.warn(
                    'WARNING: Invalid type for indentation compiler directive: ',
                    this.indentOverride.directiveType
                );
            }
            this.indentOverride = null;
        }
        else if (config.compile?.formatting === Formatting.standard) {
            if (this.isFirstParagraphOfChapter) {
                shouldIndent = config.compile?.indentFirst?.chapter!;
            }
            else if (this.isFirstParagraphOfSection) {
                shouldIndent = config.compile?.indentFirst?.section!;
            }
            else {
                shouldIndent = true;
            }
        }

        this.isFirstParagraphOfChapter = false;
        this.isFirstParagraphOfSection = false;

        if (shouldIndent) {
            this.currentTextBlock.unshift({
                text: LeadingWhitespace,
                style: { preserveLeadingSpaces: true },
            });
        }
    }

    private addSection(section: Section) {
        let config = Config.get();
        this.isFirstParagraphOfChapter = false;
        this.isFirstParagraphOfSection = true;
        let style: string = 'sectionName';
        let text: string = section.getOutput();
        if (!section.isNamed()) {
            style = 'sectionSymbol';
            if (config.compile?.section?.whitespaceOnly) {
                text = '';
                style = 'sectionWhitespace';
            }
        }
        (this.docDefinition.content as Content[]).push({
            text: text,
            style: style,
        });
    }

    private addText(text: Text) {
        let style = {
            bold: false,
            italics: false,
        };
        if (text.line.emphasis.indexOf(EmphasisType.bold) >= 0) {
            style.bold = true;
        }
        if (text.line.emphasis.indexOf(EmphasisType.italic) >= 0) {
            style.italics = true;
        }
        this.blockquoteLevel = text.line.blockquoteLevel;
        this.currentTextBlock.push({
            text: text.line.text,
            style: style,
        });
    }

    private overrideIndentation(text: Text) {
        if (this.currentTextBlock.length === 0 && text.line.indentDirective) {
            // Only apply indentation when it is set on the first line of the paragraph.
            this.indentOverride = text.line.indentDirective;
        }
    }

    private addTitle() {
        let meta = Metadata.getInstance().projectMetadta;
        if (meta.title) {
            (this.docDefinition.content as Content[]).push({
                text: meta.title.name,
                style: 'title',
            });
        }

        if (meta.author) {
            (this.docDefinition.content as Content[]).push({
                text: `by ${meta.author.name}\n`,
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
        let config = Config.get();
        if (this.currentTextBlock.length > 0) {
            this.addLeadingWhitesapace();
            (this.docDefinition.content as Content[]).push({
                text: this.currentTextBlock,
                margin: this.textMargin()
            });
            this.currentTextBlock = [];
        }
        if (config.compile?.formatting === Formatting.block) {
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
        let meta = Metadata.getInstance().projectMetadta;
        switch(headerFooterValue) {
            case HeaderFooterValue.author:
                value = meta.author ? meta.author.name : '';
                break;
            case HeaderFooterValue.chapter:
                // NOTE: As of January 2024, the pdfmake does not appear to have a way to add
                //   custom text to the header/footer based on the page number.
                //   Potential workaround: https://github.com/bpampuch/pdfmake/issues/1270#issuecomment-514387900
                console.warn(
                    `WARNING: Chapter titles in header/footer are not currently supported for PDF files.`
                );
                break;
            case HeaderFooterValue.page:
                value = `${currentPage}`;
                break;
            case HeaderFooterValue.title:
                value = meta.title ? meta.title.name : '';
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
                    this.overrideIndentation(component as Text);
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
        let config = Config.get();
        if (config.compile?.formatting === Formatting.standard) {
            // Add vertical space above/below section break.
            return [0, 10, 0, 10];
        }
        return 0;
    }

    private sectionWhitespaceMargin(): Margins {
        return [0, 25, 0, 25];
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
