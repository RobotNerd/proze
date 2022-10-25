import { Metadata } from "./metadata";

export enum LineType {
    emptyLine,
    metadata,
    paragraph,
}

export class LineState {
    inParagraph: boolean = false;
    metadata: Metadata;
    lineType: LineType;

    constructor(metadata: Metadata) {
        this.metadata = metadata;
        this.lineType = LineType.emptyLine;
    }

    update(line: string) {
        if (!this.inParagraph && this.metadata.isMetadata(line)) {
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

    private isEmptyLine(line: string): boolean {
        return line.trim() == '';
    }
}
