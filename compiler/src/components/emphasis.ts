import { Line, EmphasisType, LineType } from "./line";
import { Markup } from "../util/markup";

export class Emphasis {
    private inBoldBlock: boolean = false;

    private patterns = {
        bold: '*',
    }

    bold(line: Line | null): Line[] {
        if (line == null) {
            return [];
        }

        if (line.text === '') {
            return [line]
        }

        let updatedLines: Line[] = [];
        let text = line.text;
        let index: number;
        const requireWhitespaceBefore = false;
        do {
            index = Markup.findNextToken(text, this.patterns.bold, requireWhitespaceBefore);
            if (index >= 0) {
                let parsedText = text.substring(0, index).trim();
                if (parsedText != '') {
                    let newLine = new Line(parsedText, line.lineNumber);
                    if (this.inBoldBlock) {
                        newLine.emphasis.push(EmphasisType.bold);
                    }
                    updatedLines.push(newLine);
                }
                this.inBoldBlock = !this.inBoldBlock;
                text = text.substring(index + this.patterns.bold.length).trim();
            }
            else if (text !== '' || updatedLines.length === 0) {
                let newLine = new Line(text, line.lineNumber);
                if (this.inBoldBlock) {
                    newLine.emphasis.push(EmphasisType.bold);
                }
                updatedLines.push(newLine);
            }
        } while (index != -1);
        return updatedLines;
    }
}
