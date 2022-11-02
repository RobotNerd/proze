import { Metadata, MetadataInterface } from './components/metadata';
import { readFileSync } from 'fs';
import { Format, ProzeArgs } from './util/cli-arguments';
import { TextFormatter } from './formatters/text';
import { LineState, LineType } from './components/line-state';
import { Line } from './components/line';
import { ParseError } from './util/parse-error';
import { CompileError } from './util/compile-error';
import { Author } from './components/author';
import { Title } from './components/title';
import { Chapter } from './components/chapter';
import { Token } from './components/token';
import { Component, EmptyComponent } from './components/component';
import { Text } from './components/text';

export class Compiler {

    private args: ProzeArgs;
    private author: Author | null = null;
    private lineState: LineState;
    private parseErrors: ParseError[] = [];
    private title: Title | null = null;
    private components: Component[] = [];

    constructor(args: any) {
        this.args = args;
        this.lineState = new LineState();
    }

    compile() {
        this.parseLines();
        let formatter;
        switch(this.args.format) {
            case Format.text:
                formatter = new TextFormatter(this.author, this.title, this.components);
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
        const lines = this.loadFile(this.args.path);
        for(let i=0; i < lines.length; i++) {
            let line = new Line(lines[i], i);
            this.lineState.update(line);
            try {
                switch(this.lineState.lineType) {
                    case LineType.metadata:
                        const metadata = Metadata.getInstance().parse(line);
                        this.assignMetadata(metadata);
                        break;
                    case LineType.paragraph:
                        this.components.push(new Text(line.text));
                        break;
                    case LineType.emptyLine:
                        this.parseEmptyLine();
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

    private parseEmptyLine() {
        let lastElement: Component | null = null;
        if (this.components.length > 0) {
            lastElement = this.components[this.components.length - 1];
        }
        if (
            lastElement !== null &&
            lastElement.token != Token.end_paragraph &&
            lastElement.token != Token.chapter
        ) {
            this.components.push(new EmptyComponent(Token.end_paragraph));
        }
    }

    private assignMetadata(metadata: MetadataInterface) {
        switch(true) {
            case metadata instanceof Author:
                this.author = metadata as Author;
                break;
            case metadata instanceof Chapter:
                if (!this.isFirstComponent()) {
                    this.components.push(new EmptyComponent(Token.end_chapter));
                }
                this.components.push(metadata as Chapter);
                break;
            case metadata instanceof Title:
                this.title = metadata as Title;
                break;
            default:
                throw new Error(`Invalid metadata type ${metadata.constructor.name}`);
        }
    }

    private isFirstComponent() {
        return this.components.length == 0;
    }

    private loadFile(path: string): string[] {
        let content = readFileSync(path, 'utf-8');
        return content.split(/\r?\n/);
    }

    private handleParseError(err: ParseError) {
        this.parseErrors.push(err);
    }
}
