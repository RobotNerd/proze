import { CompilerMessages } from "../util/compiler-messages";
import { Markup } from "../util/markup";
import { ParseError } from "../util/parse-error";
import { Line } from "../parse/line";

enum StrippedToken {
    BlockComment = '###',
    LineComment = '##',
    OpenBracket = '[',
    CloseBracket = ']',
}

export class Strip {

    private inBlockComment: boolean = false;
    private inBracketBlock: boolean = false;

    commentsAndBrackets(line: Line | null): Line | null {
        if (line === null) {
            return null;
        }

        let index: number;
        let leadingSpaces: string = this.leadingSpaces(line.text);
        let substrings: string[] = [];
        let text = line.text;
        let token: StrippedToken;
        let updatedLine: Line | null = null;

        do {
            [token, index] = this.nextToken(text);
            if (index < 0) {
                if (!this.inBlockComment && !this.inBracketBlock) {
                    substrings.push(text);
                }
            }
            else {
                let parsedText: string = '';
                switch(token) {
                    case StrippedToken.BlockComment:
                        [parsedText, text] = this.removeBlockComment(text, index);
                        break;
                    case StrippedToken.LineComment:
                        [parsedText, text] = this.removeLineComment(text, index);
                        break;
                    case StrippedToken.OpenBracket:
                        [parsedText, text] = this.startBracketBlock(text, index);
                        break;
                    case StrippedToken.CloseBracket:
                        [parsedText, text] = this.removeBracketBlock(text, index, line.lineNumber);
                        break;
                }
                if (parsedText != '') {
                    substrings.push(parsedText);
                }
            }
        } while (index != -1);

        if (substrings.length > 0) {
            updatedLine = Line.copy(line);
            updatedLine.text = substrings.join(' ').trim();
            updatedLine.text = leadingSpaces + updatedLine?.text;
        }
        return updatedLine;
    }

    // Preserve leading spaces so that can be used later for setting block quote level.
    private leadingSpaces(text: string): string {
        let i = 0;
        for (; i < text.length; i++) {
            if (text[i] !== ' ') {
                break;
            }
        }
        return text.substring(0, i);
    }

    escapeCharacter(line: Line) {
        Markup.removeEsacpe(line, StrippedToken.BlockComment[0]);
        Markup.removeEsacpe(line, StrippedToken.OpenBracket);
        Markup.removeEsacpe(line, StrippedToken.CloseBracket);
    }

    private nextToken(text: string): [StrippedToken, number] {
        const requireWhitespaceBefore = false;
        const blockCommentIndex = Markup.findNextToken(text, StrippedToken.BlockComment);
        const lineCommentIndex = Markup.findNextToken(text, StrippedToken.LineComment);
        const openBracketIndex = Markup.findNextToken(text, StrippedToken.OpenBracket, requireWhitespaceBefore);
        const closeBracketIndex = Markup.findNextToken(text, StrippedToken.CloseBracket, requireWhitespaceBefore);

        let index: number = blockCommentIndex;
        let token: StrippedToken = StrippedToken.BlockComment;
        if (lineCommentIndex != -1 && (lineCommentIndex < index || index == -1)) {
            index = lineCommentIndex;
            token = StrippedToken.LineComment;
        }
        if (openBracketIndex != -1 && (openBracketIndex < index || index == -1)) {
            index = openBracketIndex;
            token = StrippedToken.OpenBracket;
        }
        if (closeBracketIndex != -1 && (closeBracketIndex < index || index == -1)) {
            index = closeBracketIndex;
            token = StrippedToken.CloseBracket;
        }
        return [token, index];
    }
    
    private removeBlockComment(text: string, index: number): [string, string] {
        let left: string = '';
        let right: string;
        if (!this.inBracketBlock) {
            if (!this.inBlockComment) {
                left = text.substring(0, index).trim();
            }
            this.inBlockComment = !this.inBlockComment;
        }
        right = text.substring(index + StrippedToken.BlockComment.length).trim();
        return [left, right];
    }

    private removeBracketBlock(text: string, index: number, lineNumber: number): [string, string] {
        let left: string = '';
        let right: string;
        if (!this.inBlockComment) {
            if (this.inBracketBlock) {
                this.inBracketBlock = false;
            }
            else {
                left = text.substring(0, index).trim();
                let message = [
                    'Closing bracket "]" found without prior matching opening bracket.',
                    'If you want this to be in the output, esacpe it with a "\\" character.'
                ];
                CompilerMessages.getInstance().add(
                    new ParseError(message.join(' '), lineNumber)
                );
            }
        }
        right = text.substring(index + StrippedToken.CloseBracket.length).trim();
        return [left, right];
    }

    private removeLineComment(text: string, index: number): [string, string] {
        if (this.inBlockComment || this.inBracketBlock) {
            return ['', text.substring(index + StrippedToken.LineComment.length).trim()];
        }
        return [text.substring(0, index).trim(), ''];
    }

    reset() {
        this.inBlockComment = false;
        this.inBracketBlock = false;
    }

    private startBracketBlock(text: string, index: number): [string, string] {
        let left: string = '';
        let right: string;
        if (!this.inBlockComment && !this.inBracketBlock) {
            left = text.substring(0, index).trim();
            this.inBracketBlock = true;
        }
        right = text.substring(index + StrippedToken.OpenBracket.length).trim();
        return [left, right];
    }
}
