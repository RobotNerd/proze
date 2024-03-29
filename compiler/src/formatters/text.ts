import { Chapter } from '../components/chapter';
import { Component } from '../components/component';
import { Config } from '../util/config';
import { EmDash } from '../components/em-dash';
import { Metadata } from '../parse/metadata';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Token } from '../components/token';

import type { Formatter } from './formatter';
import * as fs from 'fs';

export class TextFormatter implements Formatter {

    private content: string[] = [];
    private currentTextBlock: string[] = [];
    private isFirstChapter: boolean = true;

    constructor(private components: Component[]) {}

    private addEmDash(emdash: EmDash) {
        this.currentTextBlock.push(emdash.toString());
    }

    private addSection(section: Section) {
        let config = Config.get();
        let text: string = section.getOutput();
        if (!section.isNamed() && config.compile?.section?.whitespaceOnly) {
            text = '\n';
        }
        text = `${text}\n\n`
        this.content.push(text);
    }

    private addText(text: Text) {
        this.currentTextBlock.push(text.line.text);
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
        let meta = Metadata.getInstance().projectMetadta;
        if (meta.title) {
            header += meta.title.name + '\n';
        }
        if (meta.author) {
            header += `by ${meta.author.name}\n`;
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
