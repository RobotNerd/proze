import { Author } from '../components/author';
import { Chapter } from '../components/chapter';
import { Title } from '../components/title';

export class TextFormatter {

    constructor(
        private author: Author | null,
        private chapters: Chapter[],
        private title: Title | null
    ) {}

    getOutput(): string {
        let content: string[] = [];
        for (let i=0; i < this.chapters.length; i++) {
            content.push(this.chapters[i].getOutput());
        }
        return this.getOutputHeader() + content.join('\n\n');
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