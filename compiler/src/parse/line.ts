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

export interface LineFields {
    blockquoteLevel?: number;
    breakDirective?: CompilerDirective;
    emphasis?: EmphasisType[];
    filePath?: string;
    indentDirective?: CompilerDirective;
    lineNumber?: number;
    lineType?: LineType;
    text?: string;
}

export class Line {

    public blockquoteLevel: number = 0;
    public breakDirective: CompilerDirective | null = null;
    public emphasis: EmphasisType[] = [];
    public filePath: string = '';
    public indentDirective: CompilerDirective | null = null;
    public lineNumber: number = -1;
    public lineType: LineType = LineType.unknown;
    public text: string = '';

    constructor(fields: LineFields = {}) {
        Line.applyLineFields(this, fields);
    }

    private static applyLineFields(line: Line, fields: LineFields) {
        if (fields.blockquoteLevel !== undefined) {
            line.blockquoteLevel = fields.blockquoteLevel; 
        }
        if (fields.breakDirective !== undefined) {
            line.breakDirective =  fields.breakDirective;
        }
        if (fields.emphasis !== undefined) {
            line.emphasis = [...fields.emphasis];
        }
        if (fields.filePath !== undefined) {
            line.filePath = fields.filePath;
        }
        if (fields.indentDirective !== undefined) {
            line.indentDirective = fields.indentDirective;
        }
        if (fields.lineNumber !== undefined) {
            line.lineNumber = fields.lineNumber;
        }
        if (fields.lineType !== undefined) {
            line.lineType = fields.lineType;
        }
        if (fields.text !== undefined) {
            line.text = fields.text;
        }
    }

    static copy(line: Line, fields: LineFields = {}): Line {
        let newLine: Line = new Line();
        newLine.text = line.text;
        newLine.lineNumber = line.lineNumber;
        newLine.lineType = line.lineType;
        newLine.blockquoteLevel = line.blockquoteLevel;
        newLine.emphasis = [...line.emphasis];
        newLine.filePath = line.filePath;
        if (line.breakDirective) {
            newLine.breakDirective = CompilerDirective.copy(line.breakDirective);
        }
        if (line.indentDirective) {
            newLine.indentDirective = CompilerDirective.copy(line.indentDirective);
        }
        Line.applyLineFields(newLine, fields);
        return newLine;
    }
}
