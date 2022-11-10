import { Emphasis } from "./emphasis";
import { Line, LineType } from "./line";
import { Metadata } from "./metadata";
import { Strip } from "./strip";

export class LineState {

    inParagraph: boolean = false;
    
    private emphasis: Emphasis;
    private strip: Strip;

    constructor() {
        this.emphasis = new Emphasis();
        this.strip = new Strip();
    }

    private applyEmphasis(line: Line | null): Line[] {
        if (line === null) {
            return [];
        }

        let updatedLines: Line[];
        updatedLines = this.emphasis.bold(line);
        return updatedLines;
    }

    private isEmptyLine(line: Line): boolean {
        return line.text.trim() == '';
    }

    update(line: Line): Line[] {
        let sanitizedLine = this.sanitize(line);
        let updatedLines = this.applyEmphasis(sanitizedLine);

        for (let updatedLine of updatedLines) {
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
            this.strip.escapeCharacter(updatedLine);
        }
        return updatedLines;
    }

    reset() {
        this.inParagraph = false;
        this.strip.reset();
    }

    private sanitize(line: Line | null): Line | null {
        let updatedLine = this.strip.blockComment(line);
        updatedLine = this.strip.lineComment(updatedLine);
        updatedLine = this.strip.bracketBlock(updatedLine);
        return updatedLine;
    }
}
