import { Author } from './components/author';
import { Chapter } from './components/chapter';
import { CompileError } from './util/compile-error';
import { Component, EmptyComponent } from './components/component';
import { Format, ProzeArgs } from './util/cli-arguments';
import { Line, LineType } from './components/line';
import { LineState } from './components/line-state';
import { Metadata, MetadataInterface } from './components/metadata';
import { Section } from './components/section';
import { Text } from './components/text';
import { TextFormatter } from './formatters/text';
import { Title } from './components/title';
import { Token } from './components/token';
import { readFileSync } from 'fs';
import { CompilerMessages } from './util/compiler-messages';
import { ParseError } from './util/parse-error';

export class Compiler {

    private args: ProzeArgs;
    private author: Author | null = null;
    private lineState: LineState;
    private title: Title | null = null;
    private components: Component[] = [];

    constructor(args: any) {
        this.args = args;
        this.lineState = new LineState();
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
            case metadata instanceof Section:
                this.components.push(metadata as Section);
                break;
            case metadata instanceof Title:
                this.title = metadata as Title;
                break;
        }
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
        if (CompilerMessages.getInstance().hasErrors()) {
            throw new CompileError('Failed to compile due to parse errors.');
        }
        return formatter.getOutput();
    }

    private isFirstComponent() {
        return this.components.length == 0;
    }

    private loadFile(path: string): string[] {
        let content = readFileSync(path, 'utf-8');
        return content.split(/\r?\n/);
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

    private parseLines() {
        const lines = this.loadFile(this.args.path);
        for(let i=0; i < lines.length; i++) {
            const splitLines: Line[] = this.lineState.update(new Line(lines[i], i));
            if (splitLines.length == 0) {
                continue;
            }
            for (let line of splitLines) {
                switch(line.lineType) {
                    case LineType.metadata:
                        const metadata = Metadata.getInstance().parse(line);
                        this.assignMetadata(metadata);
                        break;
                    case LineType.paragraph:
                        // TODO add components for bold/italic if present
                        this.components.push(new Text(line.text));
                        break;
                    case LineType.emptyLine:
                        this.parseEmptyLine();
                        break;
                    case LineType.unknown:
                        CompilerMessages.getInstance().add(
                            new ParseError('Unparseable line', line.lineNumber)
                        );
                        break;
                }
            }
        }
        this.components.push(new EmptyComponent(Token.eof));
    }
}
