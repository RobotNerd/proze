import { Author_tagContext, Title_tagContext } from '../../generated/ProzeParser';
import { MetadataContext } from '../../generated/ProzeParser';
import { ListenerOutput } from './interface';
import { Metadata } from '../metadata';



export class TextListener implements ListenerOutput {

    private output: string;
    private metadata: Metadata;

    constructor(metadata: Metadata) {
        this.output = '';
        this.metadata = metadata;
    }

    getOutput(): string {
        if (this.metadata.title) {
            this.output += this.metadata.title + '\n';
        }
        if (this.metadata.author) {
            this.output += `by ${this.metadata.author}\n`;
        }
        return this.output;
    }

    enterTitle_tag(ctx: Title_tagContext): void {
        this.metadata.title = this.parseMetadata(ctx.metadata());
    }

    enterAuthor_tag (ctx: Author_tagContext): void {
        this.metadata.author = this.parseMetadata(ctx.metadata());
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