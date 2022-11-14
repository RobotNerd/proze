import { Author } from '../components/author';
import { Chapter } from '../components/chapter';
import { Component } from '../components/component';
import { Section } from '../components/section';
import { Text } from '../components/text';
import { Title } from '../components/title';
import { Token } from '../components/token';

export class TextFormatter {

    private content: string[] = [];
    private currentTextBlock: string[] = [];

    constructor(
        private author: Author | null,
        private title: Title | null,
        private components: Component[]
    ) {}

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

    getOutput(): string {
        for (let i=0; i < this.components.length; i++) {
            let component = this.components[i];
            switch(component.token) {
                case Token.chapter:
                    this.startChapter(component as Chapter);
                    break;
                case Token.end_chapter:
                    this.endChapter();
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

    private getOutputHeader(): string {
        let header = '';
        if (this.title) {
            header += this.title.name + '\n';
        }
        if (this.author) {
            header += `by ${this.author.name}\n`;
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
        this.content.push(chapter.getOutput() + '\n\n');
    }
}
