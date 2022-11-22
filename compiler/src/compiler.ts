import { Author } from './components/author';
import { Chapter } from './components/chapter';
import { CompileError } from './util/compile-error';
import { Component, EmptyComponent } from './components/component';
import { ConfigInterface, ConfigParser } from './util/config';
import { ProzeFile } from './util/proze-file';
import { Format, ProzeArgs } from './util/cli-arguments';
import { Line, LineType } from './components/line';
import { LineState } from './components/line-state';
import { Metadata, MetadataInterface } from './components/metadata';
import { Section } from './components/section';
import { Text } from './components/text';
import { TextFormatter } from './formatters/text';
import { Title } from './components/title';
import { Token } from './components/token';
import { CompilerMessages } from './util/compiler-messages';
import { ParseError } from './util/parse-error';

export class Compiler {

    private args: ProzeArgs;
    private author: Author | null = null;
    private lineState: LineState;
    private title: Title | null = null;
    private components: Component[] = [];
    private config: ConfigInterface | null = null;

    constructor(args: any) {
        this.args = args;
        this.lineState = new LineState();
        this.config = ConfigParser.load(this.args.path);
    }
    
    private applyLineType(line: Line) {
        switch(line.lineType) {
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
            case LineType.unknown:
                CompilerMessages.getInstance().add(
                    new ParseError('Unparseable line', line.lineNumber)
                );
                break;
        }
    }

    private assignMetadata(metadata: MetadataInterface) {
        switch(true) {
            case metadata instanceof Author:
                this.author = metadata as Author;
                break;
            case metadata instanceof Chapter:
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

    private parseLines() {
        const prozeFilePaths = ProzeFile.paths(this.args, this.config);
        for (let path of prozeFilePaths) {
            const textLines = ProzeFile.load(path);
            for(let i=0; i < textLines.length; i++) {
                const updatedLines: Line[] = this.lineState.update(new Line(textLines[i], i));
                for (let line of updatedLines) {
                    this.applyLineType(line);
                }
            }
            this.components.push(new EmptyComponent(Token.eof));
        }
    }
}
