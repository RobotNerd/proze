import { Line } from "./line";
import { Metadata } from "./metadata";

export enum LineType {
    emptyLine,
    metadata,
    paragraph,
}

export class LineState {
    private inBlockComment: boolean = false;

    inParagraph: boolean = false;
    lineType: LineType;

    private escapeChar = '\\';
    private patterns = {
        blockComment: '###',
        lineComment: /(.*)##.*/,
        // lineComment: '##',
    }

    constructor() {
        this.lineType = LineType.emptyLine;
    }

    private findNextCommentToken(text: string, pattern: string): number {
        let index: number;
        let found: boolean;
        let position = 0;
        do {
            index = text.indexOf(pattern, position);
            // index = text.indexOf(this.patterns.blockComment, position);
            found = true;
            if (index > 0) {
                if (this.isEscaped(text, index) || !this.isPrefixedByWhitespace(text, index)) {
                    found = false;
                    position = index + pattern.length;
                    // position = index + 3;
                }
            }
        } while (!found);
        return index;
    }

    private isEmptyLine(line: Line): boolean {
        return line.text.trim() == '';
    }

    private isEscaped(text: string, index: number): boolean {
        if (index > 0) {
            return text[index - 1] === this.escapeChar;
        }
        return false;
    }

    private isPrefixedByWhitespace(text: string, index: number): boolean {
        if (index > 0) {
            return text[index - 1].match(/\s/) !== null;
        }
        return false;
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
        // let updatedLine: Line | null = null;
        // let index = this.findNextCommentToken(text, this.patterns.lineComment);
    }
    
    private stripBlockComment(line: Line): Line | null {
        let updatedLine: Line | null = null;
        let substrings: string[] = [];
        let text = line.text;
        let index: number;
        do {
            index = this.findNextCommentToken(text, this.patterns.blockComment);
            if (index >= 0) {
                if (!this.inBlockComment) {
                    substrings.push(text.substring(0, index).trim());
                }
                this.inBlockComment = !this.inBlockComment;
                text = text.substring(index + 3).trim();
            }
            else if (!this.inBlockComment) {
                substrings.push(text);
            }
        } while (index != -1);
        if (substrings.length > 0) {
            updatedLine = new Line(substrings.join(' ').trim(), line.lineNumber);
        }
        return updatedLine;
    }

    update(line: Line): Line | null {
        let updatedLine = this.stripBlockComment(line);
        if (updatedLine !== null) {
            updatedLine = this.stripLineComment(updatedLine);
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
        return updatedLine;
    }

    reset() {
        this.inBlockComment = false;
        this.inParagraph = false;
    }
}
