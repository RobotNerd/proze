import { Line } from "./line";
import { Metadata } from "./metadata";
import { Paragraph } from "./paragraph";

export class Chapter {

    private currentParagraph: Paragraph | null = null;
    private paragraphs: Paragraph[] = [];

    constructor(
        public name: string = '',
        public chapterNumber: number = -1
    ) {}

    addLine(line: Line) {
        if (!this.currentParagraph) {
            this.addParagraph();
        }
        this.currentParagraph?.add(line);
    }

    private addParagraph() {
        this.currentParagraph = new Paragraph();
        this.paragraphs.push(this.currentParagraph);
    }

    private getChapterTitle(): string | null {
        let chapterTitle: string | null = null;
        if (Metadata.getInstance().hasChapterNames && this.name === '') {
            // TODO add warning about mix of chapter names and no names
            chapterTitle = `Chapter ${this.chapterNumber}`
        }
        else {
            chapterTitle = this.name;
        }
        return chapterTitle;
    }

    endParagraph() {
        this.currentParagraph = null;
    }

    getOutput(): string {
        let content: string[] = [];
        const chapterTitle = this.getChapterTitle();
        if (chapterTitle) {
            content.push(chapterTitle);
        }
        for (let paragraph of this.paragraphs) {
            content.push(paragraph.getOutput());
        }
        return content.join('\n\n') + '\n';
    }
}
