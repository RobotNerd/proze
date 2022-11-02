import { Line } from "./line";
import { Metadata } from "./metadata";

export enum LineType {
    emptyLine,
    metadata,
    paragraph,
}

export class LineState {
    inParagraph: boolean = false;
    lineType: LineType;

    constructor() {
        this.lineType = LineType.emptyLine;
    }

    update(line: Line) {
        if (!this.inParagraph && Metadata.getInstance().isMetadata(line)) {
            this.lineType = LineType.metadata;
        }
        else if (this.isEmptyLine(line)) {
            this.inParagraph = false;
            this.lineType = LineType.emptyLine;
        }
        else {
            this.inParagraph = true;
            this.lineType = LineType.paragraph;
        }
    }

    private isEmptyLine(line: Line): boolean {
        return line.text.trim() == '';
    }
}
