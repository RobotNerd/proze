export enum LineType {
    emptyLine,
    metadata,
    paragraph,
    unknown
}

export class Line {

    constructor(
        public text: string,
        public lineNumber: number,
        public lineType: LineType = LineType.unknown
    ) {}
}
