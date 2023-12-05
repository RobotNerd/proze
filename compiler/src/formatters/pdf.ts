import { Chapter } from '../components/chapter';
import { Component } from '../components/component';
import { ProjectMetadata } from '../components/metadata';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Token } from '../components/token';

import type { Formatter } from './formatter';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';

import PdfPrinter = require("pdfmake");
import * as fs from 'fs';

export class PdfFormatter implements Formatter {

    private currentTextBlock: string[] = [];
    private docDefinition: TDocumentDefinitions;
    private printer: PdfPrinter;

    constructor(
        private projectMetadata: ProjectMetadata,
        private components: Component[]
    ) {
        this.docDefinition = {
            content: [],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                subheader: {
                    fontSize: 15,
                    bold: true
                }
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
            style: 'subheader',
        });
    }

    private addText(text: Text) {
        this.currentTextBlock.push(text.text);
    }

    private addTitle() {
        if (this.projectMetadata.title) {
            (this.docDefinition.content as Content[]).push({
                text: this.projectMetadata.title.name,
                style: 'header',
            });
        }

        if (this.projectMetadata.author) {
            (this.docDefinition.content as Content[]).push(
                `by ${this.projectMetadata.author.name}\n`
            );
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
                    style: 'header',
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
            (this.docDefinition.content as Content[]).push(this.currentTextBlock.join(' '));
            this.currentTextBlock = [];
        }
        if (this.isLastComponent(i)) {
            (this.docDefinition.content as Content[]).push('\n');
        }
        else {
            (this.docDefinition.content as Content[]).push('\n\n');
        }
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
            style: 'header',
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
