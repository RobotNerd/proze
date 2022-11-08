import { Line } from "./line";

/** Remove comments and bracketed blocks. */
export class Strip {

    private inBlockComment: boolean = false;
    private inBracketBlock: boolean = false;

    private escapeChar = '\\';
    private patterns = {
        blockComment: '###',
        lineComment: '##',
        escapedComment: '\\#',
        escapedCommentReplacer: '#',
    }

    private findNextCommentToken(text: string, pattern: string): number {
        let index: number;
        let found: boolean;
        let position = 0;
        do {
            index = text.indexOf(pattern, position);
            found = true;
            if (index > 0) {
                if (this.isEscaped(text, index) || !this.isPrefixedByWhitespace(text, index)) {
                    found = false;
                    position = index + pattern.length;
                }
            }
        } while (!found);
        return index;
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

    lineComment(line: Line): Line | null {
        let updatedLine: Line | null = null;
        let substrings: string[] = [];
        let text = line.text;
        let index: number;
        do {
            index = this.findNextCommentToken(text, this.patterns.lineComment);
            if (index >= 0) {
                let parsedText = text.substring(0, index).trim(); 
                if (parsedText !== '') {
                    substrings.push(text.substring(0, index).trim());
                }
                index = -1;
            }
            else {
                substrings.push(text);
            }
        } while (index != -1);
        if (substrings.length > 0) {
            updatedLine = new Line(substrings.join(' ').trim(), line.lineNumber);
        }
        return updatedLine;
    }
    
    blockComment(line: Line): Line | null {
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
                text = text.substring(index + this.patterns.blockComment.length).trim();
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

    escapeCharacter(line: Line) {
        line.text = line.text.replaceAll(this.patterns.escapedComment, this.patterns.escapedCommentReplacer);
    }

    reset() {
        this.inBlockComment = false;
        this.inBracketBlock = false;
    }
}
