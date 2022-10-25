import { Metadata } from './components/metadata';
import { readFileSync } from 'fs';
import { Format, ProzeArgs } from './util/cli-arguments';
import { Paragraph } from './components/paragraph';
import { TextFormatter } from './formatters/text';
import { LineState, LineType } from './components/line-state';
import { Line } from './components/line';
import { ParseError } from './util/parse-error';
import { CompileError } from './util/compile-error';


export class Compiler {

    private args: ProzeArgs;
    private metadata: Metadata;
    private paragraphs: Paragraph[] = [];
    private lineState: LineState;
    private parseErrors: ParseError[] = [];

    constructor(args: any) {
        this.args = args;
        this.metadata = new Metadata();
        this.lineState = new LineState(this.metadata);
    }

    compile() {
        this.parseLines();
        let formatter;
        switch(this.args.format) {
            case Format.text:
                formatter = new TextFormatter(this.metadata, this.paragraphs);
                break;
            default:
                throw new Error(`unrecognized format: ${this.args.format}`);
        }
        if (this.parseErrors.length > 0) {
            throw new CompileError(
                'Failed to compile due to parse errors.',
                this.parseErrors
            );
        }
        return formatter.getOutput();
    }

    private parseLines() {
        let paragraph: Paragraph = new Paragraph();
        const lines = this.loadFile(this.args.path);
        for(let i=0; i < lines.length; i++) {
            let line = new Line(lines[i], i);
            this.lineState.update(line);
            try {
                switch(this.lineState.lineType) {
                    case LineType.metadata:
                        this.metadata.parse(line);
                        break;
                    case LineType.paragraph:
                        paragraph.add(line);
                        break;
                    case LineType.emptyLine:
                        if (paragraph.lines.length > 0) {
                            this.paragraphs.push(paragraph);
                            paragraph = new Paragraph();
                        }
                        break;
                }
            }
            catch (err) {
                if (err instanceof ParseError) {
                    this.handleParseError(err);
                }
                else {
                    throw err;
                }
            }
        }
    }

    private loadFile(path: string): string[] {
        let content = readFileSync(path, 'utf-8');
        return content.split(/\r?\n/);
    }

    private handleParseError(err: ParseError) {
        this.parseErrors.push(err);
    }
}
