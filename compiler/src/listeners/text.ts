import { Title_tagContext } from '../../generated/ProzeParser';
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
            this.output = this.metadata.title + '\n';
        }
        return this.output;
    }

    enterTitle_tag(ctx: Title_tagContext): void {
        let result: string[] = [];
        for (let word of ctx.metadata().WORD()) {
            if (word.payload.text != undefined) {
                result.push(word.payload.text);
            }
        }
        this.metadata.title = result.join(' ');
    }

}