import { CompilerMessages } from "../util/compiler-messages";
import { Markup } from "../util/markup";
import { ParseError } from "../util/parse-error";
import { Line } from "./line";

/** Remove comments and bracketed blocks. */
export class Strip {

    private inBlockComment: boolean = false;
    private inBracketBlock: boolean = false;

    private patterns = {
        blockComment: '###',
        lineComment: '##',
        openBracket: '[',
        closeBracket: ']',
    }
    
    blockComment(line: Line | null): Line | null {
        if (line === null || this.inBracketBlock) {
            return line;
        }

        let updatedLine: Line | null = null;
        let substrings: string[] = [];
        let text = line.text;
        let index: number;
        do {
            index = Markup.findNextToken(text, this.patterns.blockComment);
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

    bracketBlock(line: Line | null): Line | null {
        if (line === null || this.inBlockComment) {
            return line;
        }

        let updatedLine: Line | null = null;
        let substrings: string[] = [];
        let text = line.text;
        let index: number;
        const requireWhitespaceBefore = false;
        do {
            index = -1;
            let token = this.inBracketBlock ? this.patterns.closeBracket : this.patterns.openBracket;
            index = Markup.findNextToken(text, token, requireWhitespaceBefore);
            if (index >= 0) {
                if (!this.inBracketBlock) {
                    substrings.push(text.substring(0, index).trim());
                }
                this.inBracketBlock = !this.inBracketBlock;
                text = text.substring(index + token.length).trim();
            }
            else if (!this.inBracketBlock) {
                substrings.push(text);
            }
        } while (index != -1);
        if (substrings.length > 0) {
            updatedLine = new Line(substrings.join(' ').trim(), line.lineNumber);
        }
        this.checkHangingCloseBacket(updatedLine);
        return updatedLine;
    }

    private checkHangingCloseBacket(line: Line | null) {
        if (line !== null && line.text.indexOf(this.patterns.closeBracket) >= 0) {
            let message = [
                'Closing bracket "]" found without prior matching opening bracket.',
                'If you want this to be in the output, esacpe it with a "\\" character.'
            ];
            CompilerMessages.getInstance().add(
                new ParseError(message.join(' '), line.lineNumber)
            );
        }
    }

    escapeCharacter(line: Line) {
        Markup.removeEsacpe(line, this.patterns.blockComment[0]);
        Markup.removeEsacpe(line, this.patterns.openBracket);
        Markup.removeEsacpe(line, this.patterns.closeBracket);
    }

    lineComment(line: Line | null): Line | null {
        if (line === null) {
            return null;
        }

        let updatedLine: Line | null = null;
        let substrings: string[] = [];
        let text = line.text;
        let index: number;
        do {
            index = Markup.findNextToken(text, this.patterns.lineComment);
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

    reset() {
        this.inBlockComment = false;
        this.inBracketBlock = false;
    }
}
