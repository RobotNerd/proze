import { Author_tagContext, Raw_sentenceContext, Title_tagContext } from '../../generated/ProzeParser';
import { MetadataContext } from '../../generated/ProzeParser';
import { ListenerOutput } from './interface';
import { Metadata } from '../metadata';
import { Sentence } from '../components/sentence';



export class TextListener implements ListenerOutput {

    private output: string;
    private metadata: Metadata;
    private sentences: Sentence[] = [];

    constructor(metadata: Metadata) {
        this.output = '';
        this.metadata = metadata;
    }

    getOutput(): string {
        this.output += this.getOutputHeader();
        for (let sentence of this.sentences) {
            this.output += sentence.getOutput();
        }
        this.output += '\n';
        return this.output;
    }

    private getOutputHeader(): string {
        let header = '';
        if (this.metadata.title) {
            header += this.metadata.title + '\n';
        }
        if (this.metadata.author) {
            header += `by ${this.metadata.author}\n`;
        }
        if (header != '') {
            header += '\n';
        }
        return header;
    }

    enterTitle_tag(ctx: Title_tagContext): void {
        this.metadata.title = this.parseMetadata(ctx.metadata());
    }

    enterAuthor_tag (ctx: Author_tagContext): void {
        this.metadata.author = this.parseMetadata(ctx.metadata());
    }

    enterRaw_sentence(ctx: Raw_sentenceContext) {
        this.sentences.push(new Sentence(ctx.text));
    }

    private parseMetadata(ctx: MetadataContext): string {
        let result: string[] = [];
        for (let word of ctx.WORD()) {
            if (word.payload.text != undefined) {
                result.push(word.payload.text);
            }
        }
        return result.join(' ');
    }

}