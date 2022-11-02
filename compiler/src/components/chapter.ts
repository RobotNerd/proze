import { Component } from "./component";
import { Metadata } from "./metadata";
import { Token } from "./token";

export class Chapter implements Component {

    public token: Token = Token.chapter;

    constructor(
        public name: string = '',
        public chapterNumber: number = -1
    ) {}

    private getChapterTitle(): string | null {
        let chapterTitle: string | null = null;
        if (Metadata.getInstance().hasChapterNames && this.name === '') {
            // TODO add warning about mix of chapter names and no names
            chapterTitle = `Chapter ${this.chapterNumber}`
        }
        else {
            chapterTitle = this.name;
        }
        return chapterTitle;
    }

    getOutput(): string {
        return this.getChapterTitle() || '';
    }
}
