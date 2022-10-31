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


export class Compiler {

    private args: ProzeArgs;
    private author: Author | null = null;
    private chapters: Chapter[] = [];
    private lineState: LineState;
    private parseErrors: ParseError[] = [];
    private title: Title | null = null;

    constructor(args: any) {
        this.args = args;
        this.lineState = new LineState();
    }

    compile() {
        this.parseLines();
        let formatter;
        switch(this.args.format) {
            case Format.text:
                formatter = new TextFormatter(this.author, this.chapters, this.title);
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
                        let chapter = this.currentChapter();
                        if (!chapter) {
                            chapter = Metadata.getInstance().createEmptyChapter();
                            this.chapters.push(chapter);
                        }
                        chapter.addLine(line);
                        break;
                    case LineType.emptyLine:
                        this.currentChapter()?.endParagraph();
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

    private addChapter(chapter: Chapter) {
        this.chapters.push(chapter);
    }

    private assignMetadata(metadata: MetadataInterface) {
        switch(true) {
            case metadata instanceof Author:
                this.author = metadata as Author;
                break;
            case metadata instanceof Chapter:
                this.addChapter(metadata as Chapter);
                break;
            case metadata instanceof Title:
                this.title = metadata as Title;
                break;
            default:
                throw new Error(`Invalid metadata type ${metadata.constructor.name}`);
        }
    }

    private currentChapter(): Chapter | null {
        if (this.chapters.length == 0) {
            return null;
        }
        let index: number = this.chapters.length - 1;
        return this.chapters[index];
    }

    private loadFile(path: string): string[] {
        let content = readFileSync(path, 'utf-8');
        return content.split(/\r?\n/);
    }

    private handleParseError(err: ParseError) {
        this.parseErrors.push(err);
    }
}
