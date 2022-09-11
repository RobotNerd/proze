import {Title_tagContext} from '../../generated/ProzeParser';
import {ListenerOutput} from './interface';


export class TextListener implements ListenerOutput {

    private output: string;

    constructor() {
        this.output = '';
    }

    getOutput(): string {
        return this.output;
    }

    enterTitle_tag(ctx: Title_tagContext): void {
        let result: string[] = [];
        for (let word of ctx.markup_value().WORD()) {
            if (word.payload.text != undefined) {
                result.push(word.payload.text);
            }
        }
        this.output += result.join(' ') + '\n';
    }

}