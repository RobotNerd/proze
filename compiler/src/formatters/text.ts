import { Metadata } from '../components/metadata';
import { Paragraph } from '../components/paragraph';



export class TextFormatter {

    private metadata: Metadata;
    private paragraphs: Paragraph[];

    constructor(metadata: Metadata, paragraphs: Paragraph[]) {
        this.metadata = metadata;
        this.paragraphs = paragraphs;
    }

    getOutput(): string {
        let content: string[] = [];
        for (let paragraph of this.paragraphs) {
            content.push(paragraph.getOutput());
        }
        return this.getOutputHeader() + content.join('\n\n') + '\n';
    }

    private getOutputHeader(): string {
        let header = '';
        if (this.metadata.title) {
            header += this.metadata.title + '\n';
        }
        if (this.metadata.author) {
            header += `by ${this.metadata.author}\n`;
        }
        if (header != '') {
            header += '\n\n';
        }
        return header;
    }
}