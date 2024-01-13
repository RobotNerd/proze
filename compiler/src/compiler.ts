import type { Formatter } from './formatters/formatter';
import { Chapter } from './components/chapter';
import { CompileError } from './util/compile-error';
import { CompilerMessages } from './util/compiler-messages';
import { Component, EmptyComponent } from './components/component';
import { ConfigInterface, ConfigParser } from './util/config';
import { EmDash } from './components/em-dash';
import { Format, ProzeArgs } from './util/cli-arguments';
import { Line, LineType } from './parse/line';
import { LineState } from './parse/line-state';
import { Metadata } from './parse/metadata';
import { Names } from './util/names';
import { ParseError } from './util/parse-error';
import { PdfFormatter } from './formatters/pdf';
import { ProzeFile } from './util/proze-file';
import { Section } from './components/section';
import { Text } from './components/text';
import { TextFormatter } from './formatters/text';
import { Token } from './components/token';

export class Compiler {

    private args: ProzeArgs;
    private lineState: LineState;
    private components: Component[] = [];
    private config: ConfigInterface | null = null;
    private names: Names | null = null;;

    constructor(args: any) {
        this.args = args;
        this.lineState = new LineState();
        if (this.args.inputString === '') {
            this.config = ConfigParser.load(this.args.path);
            this.names = new Names(this.config);
        }
    }
    
    private applyLineType(line: Line) {
        switch(line.lineType) {
            case LineType.emdash:
                this.components.push(new EmDash());
                break;
            case LineType.metadata:
                const metadata = Metadata.getInstance().parse(line);
                if (metadata) {
                    this.addMetadataComponent(metadata);
                }
                break;
            case LineType.paragraph:
                this.components.push(new Text(line));
                break;
            case LineType.emptyLine:
                this.parseEmptyLine();
                break;
            case LineType.unknown:
                CompilerMessages.getInstance().add(
                    new ParseError('Unparseable line', line.lineNumber, line.filePath)
                );
                break;
        }
    }

    private addMetadataComponent(metadata: Chapter | Section) {
        switch(true) {
            case metadata instanceof Chapter:
                this.components.push(metadata as Chapter);
                break;
            case metadata instanceof Section:
                this.components.push(metadata as Section);
                break;
        }
    }

    compile() {
        if (this.args.inputString === '') {
            this.parseLines();
        }
        else {
            this.parseContent(this.args.inputString.split('\n'), '');
        }
        let formatter: Formatter;
        switch(this.args.format) {
            case Format.pdf:
                formatter = new PdfFormatter(
                    Metadata.getInstance().projectMetadta,
                    this.components,
                    this.config);
                break;
            case Format.text:
                formatter = new TextFormatter(Metadata.getInstance().projectMetadta, this.components);
                break;
            default:
                throw new Error(`unrecognized format: ${this.args.format}`);
        }
        if (CompilerMessages.getInstance().hasErrors()) {
            throw new CompileError('Failed to compile due to parse errors.');
        }

        if (this.args.file !== '') {
            formatter.writeToFile(this.getFilePath());
            return '';
        }
        return formatter.getContent();
    }

    private getFilePath(): string {
        let path: string = this.args.file;
        if (!path.endsWith(`.${this.args.format}`)) {
            path = `${this.args.file}.${this.args.format}`;
        }
        return path;
    }

    private lastActiveComponent(): Component | null {
        let lastComponent: Component | null = null;
        const ignoreComponents = [Token.eof];
        let i = this.components.length - 1;
        while (i >= 0 && lastComponent === null) {
            if (!ignoreComponents.includes(this.components[i].token)) {
                lastComponent = this.components[i];
            }
            i--;
        }
        return lastComponent;
    }

    private parseEmptyLine() {
        let lastComponent = this.lastActiveComponent();
        if (
            lastComponent !== null &&
            lastComponent.token != Token.end_paragraph &&
            lastComponent.token != Token.chapter
        ) {
            this.components.push(new EmptyComponent(Token.end_paragraph));
        }
    }

    private parseContent(textLines: string[], filePath: string) {
        for(let i=0; i < textLines.length; i++) {
            let rawLine = new Line(textLines[i], i);
            rawLine.filePath = filePath;
            const updatedLines: Line[] = this.lineState.update(rawLine);
            for (let line of updatedLines) {
                if (this.names) {
                    this.names.findInvalid(line);
                }
                this.applyLineType(line);
            }
        }
        this.components.push(new EmptyComponent(Token.eof));
    }

    private parseLines() {
        const prozeFilePaths = ProzeFile.paths(this.args, this.config);
        for (let path of prozeFilePaths) {
            const textLines = ProzeFile.load(path);
            this.parseContent(textLines, path);
        }
    }
}
