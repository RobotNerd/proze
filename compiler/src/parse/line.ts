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

    public blockquoteLevel: number;
    public breakDirective: CompilerDirective | null;
    public emphasis: EmphasisType[];
    public filePath: string;
    public indentDirective: CompilerDirective | null;
    public lineNumber: number;
    public lineType: LineType;
    public text: string;

    constructor(fields: LineFields = {}) {
        this.blockquoteLevel = fields.blockquoteLevel ? fields.blockquoteLevel : 0; 
        this.breakDirective = fields.breakDirective ? fields.breakDirective : null;
        this.emphasis = fields.emphasis ? [...fields.emphasis] : [];
        this.filePath = fields.filePath ? fields.filePath : '';
        this.indentDirective = fields.indentDirective ? fields.indentDirective : null;
        this.lineNumber = fields.lineNumber ? fields.lineNumber : -1;
        this.lineType = fields.lineType ? fields.lineType : LineType.unknown;
        this.text = fields.text ? fields.text : '';
    }

    static copy(line: Line): Line {
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
        return newLine;
    }
}
