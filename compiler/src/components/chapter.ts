import { Line } from "./line";
import { Paragraph } from "./paragraph";

export class Chapter {

    private paragraphs: Paragraph[] = [];
    private currentParagraph: Paragraph | null = null;

    constructor(
        public name: string
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

    endParagraph() {
        this.currentParagraph = null;
    }

    getOutput(): string {
        let content: string[] = [];
        if (this.name !== '') {
            content.push(this.name);
        }
        for (let paragraph of this.paragraphs) {
            content.push(paragraph.getOutput());
        }
        return content.join('\n\n') + '\n';
    }
}
