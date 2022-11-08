import { Ignore } from "./ignore";
import { Line } from "./line";
import { Metadata } from "./metadata";

export enum LineType {
    emptyLine,
    metadata,
    paragraph,
}

export class LineState {

    inParagraph: boolean = false;
    lineType: LineType;
    
    private ignore: Ignore;

    constructor() {
        this.lineType = LineType.emptyLine;
        this.ignore = new Ignore();
    }

    private isEmptyLine(line: Line): boolean {
        return line.text.trim() == '';
    }

    update(line: Line): Line | null {
        let updatedLine = this.ignore.blockComment(line);
        if (updatedLine !== null) {
            updatedLine = this.ignore.lineComment(updatedLine);
        }
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
            this.ignore.escapeCharacter(updatedLine);
        }
        return updatedLine;
    }

    reset() {
        this.inParagraph = false;
        this.ignore.reset();
    }
}
