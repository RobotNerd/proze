import { Line, LineType } from "./line";
import { Metadata } from "./metadata";
import { Strip } from "./strip";

export class LineState {

    inParagraph: boolean = false;
    
    private strip: Strip;

    constructor() {
        this.strip = new Strip();
    }

    private isEmptyLine(line: Line): boolean {
        return line.text.trim() == '';
    }

    update(line: Line): Line[] {
        let updatedLine = this.strip.blockComment(line);
        updatedLine = this.strip.lineComment(updatedLine);
        updatedLine = this.strip.bracketBlock(updatedLine);
        if (updatedLine !== null) {
            if (!this.inParagraph && Metadata.getInstance().isMetadata(updatedLine)) {
                updatedLine.lineType = LineType.metadata;
            }
            else if (this.isEmptyLine(updatedLine)) {
                this.inParagraph = false;
                updatedLine.lineType = LineType.emptyLine;
            }
            else {
                this.inParagraph = true;
                updatedLine.lineType = LineType.paragraph;
            }
        }
        if (updatedLine) {
            this.strip.escapeCharacter(updatedLine);
        }
        if (updatedLine === null) {
            return [];
        }
        return [updatedLine];
    }

    reset() {
        this.inParagraph = false;
        this.strip.reset();
    }
}
