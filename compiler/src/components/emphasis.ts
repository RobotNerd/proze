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

        let updatedLines: Line[] = [];
        let text = line.text;
        let index: number;
        const requireWhitespaceBefore = false;
        do {
            index = Markup.findNextToken(text, this.patterns.bold, requireWhitespaceBefore);
            if (index >= 0) {
                let newLine = new Line(text.substring(0, index).trim(), line.lineNumber);
                if (this.inBoldBlock) {
                    newLine.emphasis.push(EmphasisType.bold);
                }
                updatedLines.push(newLine);
                this.inBoldBlock = !this.inBoldBlock;
                text = text.substring(index + this.patterns.bold.length).trim();
            }
            else if (!this.inBoldBlock) {
                updatedLines.push(
                    new Line(text, line.lineNumber, LineType.unknown)
                );
            }
        } while (index != -1);
        return updatedLines;
    }
}
