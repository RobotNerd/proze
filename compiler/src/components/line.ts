export enum LineType {
    emdash = 'emdash',
    emptyLine = 'emptyLine',
    metadata = 'metadata',
    paragraph = 'paragraph',
    unknown = 'unknown',
}

export enum EmphasisType {
    bold = 'bold',
    italic = 'italic',
}

export class Line {

    emphasis: EmphasisType[] = [];

    constructor(
        public text: string = '',
        public lineNumber: number = -1,
        public lineType: LineType = LineType.unknown,
        public indentation: number = 0,
    ) {}

    static copy(line: Line): Line {
        let newLine: Line = new Line();
        newLine.text = line.text;
        newLine.lineNumber = line.lineNumber;
        newLine.lineType = line.lineType;
        newLine.indentation = line.indentation;
        newLine.emphasis = [...line.emphasis];
        return newLine;
    }
}
