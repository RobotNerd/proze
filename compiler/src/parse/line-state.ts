import { EmDashParser } from '../parse/em-dash-parser';
import { Emphasis } from "./emphasis";
import { Line, LineType } from "./line";
import { Metadata } from "./metadata";
import { Strip } from "../util/strip";

export class LineState {

    blockquoteLevel: number = 0;
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

    private isMetadata(strippedLine: Line): boolean {
        return !this.inParagraph && Metadata.getInstance().isMetadata(strippedLine);
    }

    private parseBlockquote(line: Line) {
       if (!this.inParagraph) {
            let count = 0;
            for (const char of line.text) {
                if (char === ' ') {
                    count++;
                } else {
                    break;
                }
            }
            this.blockquoteLevel = Math.floor(count/2);

            // Remove leading whitespace now that block quote state has been processed.
            line.text = line.text.trim();
        }
        line.blockquoteLevel = this.blockquoteLevel;
    }

    private onEmptyLine(line: Line): Line[] {
        this.blockquoteLevel = 0;
        this.inParagraph = false;
        this.emphasis.reset();
        let newLine = Line.copy(line);
        newLine.text = '';
        newLine.lineType = LineType.emptyLine;
        return [newLine];
    }

    private onMetadata(strippedLine: Line): Line[] {
        strippedLine.lineType = LineType.metadata;
        this.strip.escapeCharacter(strippedLine);
        this.emphasis.removeEscapeCharacter(strippedLine);
        return [strippedLine];
    }

    private onText(strippedLine: Line): Line[] {
        this.parseBlockquote(strippedLine);
        this.inParagraph = true;
        let updatedLines = this.applyEmphasis(strippedLine);
        updatedLines = EmDashParser.parse(updatedLines);
        for (let updatedLine of updatedLines) {
            if (updatedLine.lineType === LineType.unknown) {
                updatedLine.lineType = LineType.paragraph;
            }
            this.strip.escapeCharacter(updatedLine);
            this.emphasis.removeEscapeCharacter(updatedLine);
        }
        return updatedLines;
    }

    update(line: Line): Line[] {
        let updatedLines: Line[];
        let strippedLine = this.strip.commentsAndBrackets(line);
        this.checkWhitespaceOnlyLine(line, strippedLine);

        if (this.isWhitespaceOnly) {
            updatedLines = this.onEmptyLine(line);
        }
        else if (strippedLine === null || strippedLine.text.trim() === '') {
            updatedLines = [];
        }
        else if (this.isMetadata(strippedLine)) {
            updatedLines = this.onMetadata(strippedLine);
        }
        else {
            updatedLines = this.onText(strippedLine);

            // Add single space to join text separated only by '\n' into a single paragraph.
            let newLine = Line.copy(line);
            newLine.text = ' ';
            newLine.lineType = LineType.paragraph;
            newLine.blockquoteLevel = this.blockquoteLevel;
            updatedLines.push(newLine);
        }
        return updatedLines;
    }

    reset() {
        this.inParagraph = false;
        this.strip.reset();
    }
}
