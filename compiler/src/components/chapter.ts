import { Line } from "./line";
import { Paragraph } from "./paragraph";

export class Chapter {

    paragraphs: Paragraph[] = [];

    constructor(public name: string) {
        this.paragraphs.push(new Paragraph());
    }

    add(line: Line) {
        this.currentParagraph().add(line);
    }

    private currentParagraph(): Paragraph {
        return this.paragraphs[this.paragraphs.length - 1];
    }
}