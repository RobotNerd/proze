// import { ListenerOutput } from './interface';
import { Metadata } from '../components/metadata';
import { Paragraph } from '../components/paragraph';



export class TextFormatter {

    private metadata: Metadata;
    private paragraphs: Paragraph[];

    constructor(metadata: Metadata, paragraphs: Paragraph[]) {
        this.metadata = metadata;
        this.paragraphs = paragraphs;
    }

    getOutput(): string {
        let output = this.getOutputHeader();
        // const parsedParagraphs = [];
        // for (let paragraph of this.paragraphs) {
        //     parsedParagraphs.push(paragraph.sentences.join(' '));
        // }
        // output += parsedParagraphs.join('\n\n') + '\n';
        for (let paragraph of this.paragraphs) {
            output += paragraph.content + '\n\n';
        }
        return output;
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
            header += '\n\n';
        }
        return header;
    }

    // enterTitle_tag(ctx: Title_tagContext): void {
    //     this.metadata.title = this.parseMetadata(ctx.metadata());
    // }

    // enterAuthor_tag (ctx: Author_tagContext): void {
    //     this.metadata.author = this.parseMetadata(ctx.metadata());
    // }

    // enterRaw_sentence(ctx: Raw_sentenceContext) {
    //     this.currentParagraph?.sentences.push(ctx.text);
    // }

    // enterParagraph(ctx: ParagraphContext) {
    //     this.currentParagraph = new Paragraph();
    //     this.paragraphs.push(this.currentParagraph);
    // }

    // exitParagraph(ctx: ParagraphContext) {
    //     this.currentParagraph = null;
    // }

    // private parseMetadata(ctx: MetadataContext): string {
    //     let result: string[] = [];
    //     for (let word of ctx.WORD()) {
    //         if (word.payload.text != undefined) {
    //             result.push(word.payload.text);
    //         }
    //     }
    //     return result.join(' ');
    // }

}