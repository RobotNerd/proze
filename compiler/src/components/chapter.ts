import { Component } from "./component";
import { Metadata } from "./metadata";
import { Token } from "./token";

export class Chapter implements Component {

    public token: Token = Token.chapter;

    constructor(
        public name: string = '',
        public chapterNumber: number = -1
    ) {}

    private chapterTitle(): string | null {
        let title: string | null = null;
        if (Metadata.getInstance().hasChapterNames && this.name === '') {
            // TODO add warning about mix of chapter names and no names
            title = `Chapter ${this.chapterNumber}`
        }
        else {
            title = this.name;
        }
        return title;
    }

    getOutput(): string {
        return this.chapterTitle() || '';
    }
}
