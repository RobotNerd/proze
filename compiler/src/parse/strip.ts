import { CompilerDirective, DirectiveType } from "../util/compiler-directive";
import { CompilerMessages } from "../util/compiler-messages";
import { Markup, StrippedToken } from "../util/markup";
import { ParseError } from "../util/parse-error";
import { Line } from "../parse/line";


export class Strip {

    private inBlockComment: boolean = false;
    private inBracketBlock: boolean = false;
    private isBracketAtLineStart: boolean = true;
    private lineDirectives: CompilerDirective[] = [];

    private applyLineDirectives(line: Line) {
        if (this.lineDirectives.length > 0) {
            for (let lineDirective of this.lineDirectives) {
                switch (lineDirective.directiveType) {
                    case DirectiveType.indent:
                    case DirectiveType.unindent:
                        if (this.isBracketAtLineStart) {
                            line.indentDirective = lineDirective;
                        }
                        break;
                }
            }
            this.lineDirectives = [];
        }
    }

    private checkBracketAtLineStart(substrings: string[], parsedText: string) {
        if (substrings.length > 0) {
            this.isBracketAtLineStart = false;
        }
        else if (parsedText !== '') {
            this.isBracketAtLineStart = false;
        }
    }

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
            this.parseCompilerDirectives(text, token, index);
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
                        [parsedText, text] = this.removeBracketBlock(text, index, line);
                        this.checkBracketAtLineStart(substrings, parsedText);
                        this.applyLineDirectives(line);
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

    private parseCompilerDirectives(text: string, token: StrippedToken, index: number) {
        let textInsideBrackets = text;
        if (this.inBracketBlock) {
            if (index >= 0) {
                if (token === StrippedToken.OpenBracket) {
                    textInsideBrackets = text.substring(index + 1, text.length);
                }
                else if (token === StrippedToken.CloseBracket) {
                    textInsideBrackets = text.substring(0, index);
                }
            }
            textInsideBrackets = textInsideBrackets.trim();

            let directives = CompilerDirective.parse(textInsideBrackets);
            for (let directive of directives) {
                switch (directive?.directiveType) {
                    case DirectiveType.indent:
                    case DirectiveType.unindent:
                        this.lineDirectives.push(directive);
                        break;
                }
            }
        }
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

    private removeBracketBlock(text: string, index: number, line: Line): [string, string] {
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
                    new ParseError(message.join(' '), line.lineNumber, line.filePath)
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
