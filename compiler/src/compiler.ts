import { Metadata } from './components/metadata';
import { readFileSync } from 'fs';
import { Format, ProzeArgs } from './util/cli-arguments';
import { Paragraph } from './components/paragraph';
import { TextFormatter } from './formatters/text';
import { LineState, LineType } from './components/line-state';


export class Compiler {

    private args: ProzeArgs;
    private metadata: Metadata;
    private paragraphs: Paragraph[] = [];
    private lineState: LineState;

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
        return formatter.getOutput();
    }

    private parseLines() {
        let paragraph: Paragraph = new Paragraph();
        const lines = this.loadFile(this.args.path);
        for (let line of lines) {
            this.lineState.update(line);
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
    }

    private loadFile(path: string): string[] {
        let content = readFileSync(path, 'utf-8');
        return content.split(/\r?\n/);
    }
}
