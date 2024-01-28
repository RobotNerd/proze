import { EmDashParser } from '../parse/em-dash-parser';
import { Emphasis } from "./emphasis";
import { EscapeCharacter } from './escape-character';
import { Line, LineType } from "./line";
import { Metadata } from "./metadata";


export class LineState {

    blockquoteLevel: number = 0;
    inParagraph: boolean = false;
    isWhitespaceOnly: boolean = false;
    
    private emphasis: Emphasis;

    constructor() {
        this.emphasis = new Emphasis();
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

    private checkWhitespaceOnlyLine(line: Line | null) {
        this.isWhitespaceOnly = line ? line.text.trim() === '' : false;
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
        return [Line.copy(line, {
            lineType: LineType.emptyLine,
            text: '',
        })];
    }

    private onMetadata(strippedLine: Line): Line[] {
        strippedLine.lineType = LineType.metadata;
        EscapeCharacter.removeAll(strippedLine);
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
            EscapeCharacter.removeAll(updatedLine);
            this.emphasis.removeEscapeCharacter(updatedLine);
        }
        return updatedLines;
    }

    update(line: Line): Line[] {
        let updatedLines: Line[];
        this.checkWhitespaceOnlyLine(line);

        if (this.isWhitespaceOnly) {
            updatedLines = this.onEmptyLine(line);
        }
        else if (this.isMetadata(line)) {
            updatedLines = this.onMetadata(line);
        }
        else {
            updatedLines = this.onText(line);

            // Add single space to join text separated only by '\n' into a single paragraph.
            updatedLines.push(Line.copy(line, {
                blockquoteLevel: this.blockquoteLevel,
                lineType: LineType.paragraph,
                text: ' ',
            }));
        }
        return updatedLines;
    }

    reset() {
        this.inParagraph = false;
    }
}
