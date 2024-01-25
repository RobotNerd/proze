import { Line } from "../parse/line";

export enum StrippedToken {
    BlockComment = '###',
    LineComment = '##',
    OpenBracket = '[',
    CloseBracket = ']',
}

export class Markup {

    static escapeChar = '\\';

    static findNextToken(text: string, pattern: string, requireWhitespaceBefore = true): number {
        let index: number;
        let found: boolean;
        let position = 0;
        do {
            index = text.indexOf(pattern, position);
            found = true;
            if (index > 0) {
                if (this.isEscaped(text, index) ||
                    (requireWhitespaceBefore && !this.isPrefixedByWhitespace(text, index))
                ) {
                    found = false;
                    position = index + pattern.length;
                }
            }
        } while (!found);
        return index;
    }

    private static isEscaped(text: string, index: number): boolean {
        if (index > 0) {
            return text[index - 1] === Markup.escapeChar;
        }
        return false;
    }

    private static isPrefixedByWhitespace(text: string, index: number): boolean {
        if (index > 0) {
            return text[index - 1].match(/\s/) !== null;
        }
        return false;
    }

    static removeEsacpe(line: Line, char: string) {
        line.text = line.text.replaceAll(`${this.escapeChar}${char}`, char);
    }
}
