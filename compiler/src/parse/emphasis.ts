import { Line, EmphasisType } from "./line";
import { Markup } from "../util/markup";

interface BooleanReference {
    value: boolean;
}

export class Emphasis {
    private inBoldBlock: BooleanReference = { value: false };
    private inItalicBlock: BooleanReference = { value: false };

    private patterns = {
        bold: '__',
        italic: '*',
    }

    bold(line: Line | null): Line[] {
        return this.parseEmphasisMarkup(
            this.patterns.bold,
            EmphasisType.bold,
            this.inBoldBlock,
            line
        );
    }

    italic(line: Line | null): Line[] {
        return this.parseEmphasisMarkup(
            this.patterns.italic,
            EmphasisType.italic,
            this.inItalicBlock,
            line
        );
    }

    private parseEmphasisMarkup(
        pattern: string,
        emphasisType: EmphasisType,
        blockFlag: BooleanReference,
        line: Line | null
    ): Line[] {
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
            index = Markup.findNextToken(text, pattern, requireWhitespaceBefore);
            if (index >= 0) {
                let parsedText = text.substring(0, index);
                if (parsedText != '') {
                    let newLine = Line.copy(line);
                    newLine.text = parsedText;
                    if (blockFlag.value) {
                        newLine.emphasis.push(emphasisType);
                    }
                    updatedLines.push(newLine);
                }
                blockFlag.value = !blockFlag.value;
                text = text.substring(index + pattern.length);
            }
            else if (text !== '' || updatedLines.length === 0) {
                let newLine = Line.copy(line);
                newLine.text = text;
                if (blockFlag.value) {
                    newLine.emphasis.push(emphasisType);
                }
                updatedLines.push(newLine);
            }
        } while (index != -1);
        return updatedLines;
    }

    removeEscapeCharacter(line: Line) {
        Markup.removeEsacpe(line, this.patterns.bold[0]);
        Markup.removeEsacpe(line, this.patterns.italic);
    }

    reset() {
        this.inBoldBlock = { value: false };
        this.inItalicBlock = { value: false };
    }
}
