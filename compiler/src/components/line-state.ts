import { Emphasis } from "./emphasis";
import { Line, LineType } from "./line";
import { Metadata } from "./metadata";
import { Strip } from "./strip";

export class LineState {

    inParagraph: boolean = false;
    isWhitespaceOnly: boolean = false;
    
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

        const callbacks = [
            (line: Line) => this.emphasis.bold(line),
            (line: Line) => this.emphasis.italic(line),
        ];

        let updatedLines: Line[] = [line];
        for (let callback of callbacks) {
            let tmpLines: Line[] = [];
            for (let line of updatedLines) {
                tmpLines = tmpLines.concat(callback(line));
            }
            updatedLines = tmpLines;
            tmpLines = [];
        }
        return updatedLines;
    }

    private checkWhitespaceOnlyLine(line: Line | null, strippedLine: Line | null) {
        this.isWhitespaceOnly = false;
        if (line && strippedLine) {
            this.isWhitespaceOnly =
                line.text.length == strippedLine.text.length &&
                line.text.trim().length === 0;
        }
    }

    update(line: Line): Line[] {
        let strippedLine = this.strip.commentsAndBrackets(line);
        this.checkWhitespaceOnlyLine(line, strippedLine);
        if (this.isWhitespaceOnly) {
            this.inParagraph = false;
            return [new Line('', line.lineNumber, LineType.emptyLine)];
        }

        if (strippedLine === null || strippedLine.text.trim() === '') {
            return [];
        }

        if (!this.inParagraph && Metadata.getInstance().isMetadata(strippedLine)) {
            strippedLine.lineType = LineType.metadata;
            // TODO strip escape chars
            return [strippedLine];
        }

        this.inParagraph = true;
        let updatedLines = this.applyEmphasis(strippedLine);
        for (let updatedLine of updatedLines) {
            updatedLine.lineType = LineType.paragraph
            this.strip.escapeCharacter(updatedLine);
            this.emphasis.removeEscapeCharacter(updatedLine);
        }
        return updatedLines;
    }

    reset() {
        this.inParagraph = false;
        this.strip.reset();
    }
}
