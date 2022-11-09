import { Line } from "./line";
import { Metadata } from "./metadata";
import { Strip } from "./strip";

export enum LineType {
    emptyLine,
    metadata,
    paragraph,
}

export class LineState {

    inParagraph: boolean = false;
    lineType: LineType;
    
    private strip: Strip;

    constructor() {
        this.lineType = LineType.emptyLine;
        this.strip = new Strip();
    }

    private isEmptyLine(line: Line): boolean {
        return line.text.trim() == '';
    }

    update(line: Line): Line | null {
        let updatedLine = this.strip.blockComment(line);
        updatedLine = this.strip.lineComment(updatedLine);
        updatedLine = this.strip.bracketBlock(updatedLine);
        if (updatedLine !== null) {
            if (!this.inParagraph && Metadata.getInstance().isMetadata(updatedLine)) {
                this.lineType = LineType.metadata;
            }
            else if (this.isEmptyLine(updatedLine)) {
                this.inParagraph = false;
                this.lineType = LineType.emptyLine;
            }
            else {
                this.inParagraph = true;
                this.lineType = LineType.paragraph;
            }
        }
        if (updatedLine) {
            this.strip.escapeCharacter(updatedLine);
        }
        return updatedLine;
    }

    reset() {
        this.inParagraph = false;
        this.strip.reset();
    }
}
