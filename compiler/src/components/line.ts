export enum LineType {
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
        public text: string,
        public lineNumber: number,
        public lineType: LineType = LineType.unknown
    ) {}
}
