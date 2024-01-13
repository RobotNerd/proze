import { CompilerDirective } from "../util/compiler-directive";

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
    indentDirective: CompilerDirective | null = null;

    constructor(
        public text: string = '',
        public lineNumber: number = -1,
        public lineType: LineType = LineType.unknown,
        public blockquoteLevel: number = 0,
        public filePath: string = '',
    ) {}

    static copy(line: Line): Line {
        let newLine: Line = new Line();
        newLine.text = line.text;
        newLine.lineNumber = line.lineNumber;
        newLine.lineType = line.lineType;
        newLine.blockquoteLevel = line.blockquoteLevel;
        newLine.emphasis = [...line.emphasis];
        newLine.filePath = line.filePath;
        if (line.indentDirective) {
            newLine.indentDirective = CompilerDirective.copy(line.indentDirective);
        }
        return newLine;
    }
}
