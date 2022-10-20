import { Metadata } from './components/metadata';
import { readFileSync } from 'fs';
import { Format, ProzeArgs } from './util/cli-arguments';
import { Paragraph } from './components/paragraph';
import { TextFormatter } from './formatters/text';


export class Compiler {

    private args: ProzeArgs;
    private metadata: Metadata;
    private paragraphs: Paragraph[] = [];
    private inParagraph: boolean = false;

    constructor(args: any) {
        this.args = args;
        this.metadata = new Metadata();
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
        let paragraph: Paragraph;
        const lines = this.loadFile(this.args.path);
        for (let line of lines) {
            const isMetadata = this.metadata.parse(line);
            // if (!isMetadata) {
            //     if (this.isEmptyLine(line)) {
            //         paragraph = new Paragraph();
            //     }
            //     this.inParagraph = true;
            //     const paragraph = new Paragraph();
            //     paragraph.parse(line);
            //     if (paragraph.content != null) {
            //         this.paragraphs.push(paragraph);
            //     }
            // }
        }
    }

    private isEmptyLine(line: string): boolean {
        return false;
    }

    private loadFile(path: string): string[] {
        let content = readFileSync(path, 'utf-8');
        return content.split(/\r?\n/);
    }
}
