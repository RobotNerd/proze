import { Line } from "./line";
import { Metadata } from "./metadata";

export enum LineType {
    emptyLine,
    metadata,
    paragraph,
}

export class LineState {
    // inBlockComment: boolean = false;
    inParagraph: boolean = false;
    lineType: LineType;

    private patterns = {
        lineComment: /(.*?)##.*/,
    }

    constructor() {
        this.lineType = LineType.emptyLine;
    }

    private isEmptyLine(line: Line): boolean {
        return line.text.trim() == '';
    }

    private stripLineComment(line: Line): Line | null {
        let parsedLine: Line | null = line;
        const match = line.text.match(this.patterns.lineComment);
        if (match) {
            parsedLine = null;
            const text = match[1].trim();
            if (text !== '') {
                parsedLine = new Line(text, line.lineNumber);
            }
        }
        return parsedLine;
    }

    update(line: Line): Line | null {
        let updatedLine = this.stripLineComment(line);
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
        return updatedLine;
    }

    reset() {
        // this.inBlockComment = false;
        this.inParagraph = false;
    }
}
