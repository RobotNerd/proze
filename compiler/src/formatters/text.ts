import { Author } from '../components/author';
import { Paragraph } from '../components/paragraph';
import { Title } from '../components/title';



export class TextFormatter {

    constructor(
        private author: Author | null,
        private paragraphs: Paragraph[],
        private title: Title | null
    ) {}

    getOutput(): string {
        let content: string[] = [];
        for (let paragraph of this.paragraphs) {
            content.push(paragraph.getOutput());
        }
        return this.getOutputHeader() + content.join('\n\n') + '\n';
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
}