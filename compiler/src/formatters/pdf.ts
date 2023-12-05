import { Chapter } from '../components/chapter';
import { Component } from '../components/component';
import { ProjectMetadata } from '../components/metadata';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Token } from '../components/token';

import type { Formatter } from './formatter';

import PdfPrinter = require("pdfmake");
import * as fs from 'fs';

export class PdfFormatter implements Formatter {

    private content: string[] = [];
    private currentTextBlock: string[] = [];
    private isFirstChapter: boolean = true;
    private printer: PdfPrinter;

    constructor(
        private projectMetadata: ProjectMetadata,
        private components: Component[]
    ) {
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
        this.content.push(section.getOutput());
    }

    private addText(text: Text) {
        this.currentTextBlock.push(text.text);
    }

    private endChapter() {
        this.content.push('\n');
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
            this.content.push(this.currentTextBlock.join(' '));
            this.currentTextBlock = [];
        }
        if (this.isLastComponent(i)) {
            this.content.push('\n');
        }
        else {
            this.content.push('\n\n');
        }
    }

    private generateDoc(): PDFKit.PDFDocument {
        let docDefinition = {
            content: [
                'First paragraph UUUUUUUUUUU',
                'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
            ]
        };

        let pdfDoc = this.printer.createPdfKitDocument(docDefinition);

        // for (let i = 0; i < this.components.length; i++) {
        //     let component = this.components[i];
        //     switch (component.token) {
        //         case Token.chapter:
        //             if (!this.isFirstChapter) {
        //                 this.endChapter();
        //             }
        //             this.startChapter(component as Chapter);
        //             break;
        //         case Token.end_paragraph:
        //             this.endParagraph(i);
        //             break;
        //         case Token.eof:
        //             this.endOfFile(i);
        //             break;
        //         case Token.section:
        //             this.addSection(component as Section);
        //             break;
        //         case Token.text:
        //             this.addText(component as Text);
        //             break;
        //     }
        // }
        // return this.getOutputHeader() + this.content.join('');

        return pdfDoc;
    }

    getContent(): string {
        return "WARNING: You need to provide the path to the file name (--file arg) for pdf documents.";
    }

    private getOutputHeader(): string {
        let header = '';
        if (this.projectMetadata.title) {
            header += this.projectMetadata.title.name + '\n';
        }
        if (this.projectMetadata.author) {
            header += `by ${this.projectMetadata.author.name}\n`;
        }
        if (header != '') {
            header += '\n\n';
        }
        return header;
    }

    private isLastComponent(i: number) {
        return (i == this.components.length - 1) ||
            (i == this.components.length - 2 && this.components[i + 1].token == Token.eof);
    }

    private startChapter(chapter: Chapter) {
        this.isFirstChapter = false;
        this.content.push(chapter.getOutput() + '\n\n');
    }

    writeToFile(path: string): void {
        let pdfDoc: PDFKit.PDFDocument = this.generateDoc();
        pdfDoc.pipe(fs.createWriteStream(path));
        pdfDoc.end();
    }
}
