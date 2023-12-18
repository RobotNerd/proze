import { Chapter } from '../components/chapter';
import { Component } from '../components/component';
import { EmDash } from '../components/em-dash';
import { ProjectMetadata } from '../components/metadata';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Token } from '../components/token';

import type { Formatter } from './formatter';
import * as fs from 'fs';

export class TextFormatter implements Formatter {

    private content: string[] = [];
    private currentTextBlock: string[] = [];
    private isFirstChapter: boolean = true;

    constructor(
        private projectMetadata: ProjectMetadata,
        private components: Component[]
    ) {}

    private addEmDash(emdash: EmDash) {
        this.content.push(emdash.toString());
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
            this.content.push(this.currentTextBlock.join('').trim());
            this.currentTextBlock = [];
        }
        if (this.isLastComponent(i)) {
            this.content.push('\n');
        }
        else {
            this.content.push('\n\n');
        }
    }

    private generateContent(): string {
        for (let i=0; i < this.components.length; i++) {
            let component = this.components[i];
            switch(component.token) {
                case Token.chapter:
                    if (!this.isFirstChapter) {
                        this.endChapter();
                    }
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
        return this.getOutputHeader() + this.content.join('');
    }

    getContent(): string {
        return this.generateContent();
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
            (i == this.components.length - 2 && this.components[i+1].token == Token.eof);
    }

    private startChapter(chapter: Chapter) {
        this.isFirstChapter = false;
        this.content.push(chapter.getOutput() + '\n\n');
    }

    writeToFile(path: string): void {
        let content: string = this.generateContent();
        fs.writeFileSync(path, content);
    }
}
