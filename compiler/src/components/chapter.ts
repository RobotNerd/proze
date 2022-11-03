import { CompilerMessages } from "../util/compiler-messages";
import { ParseWarning } from "../util/parse-error";
import { Component } from "./component";
import { Line } from "./line";
import { Metadata } from "./metadata";
import { Token } from "./token";

export class Chapter implements Component {

    public token: Token = Token.chapter;

    constructor(
        private line: Line,
        public name: string = '',
        public chapterNumber: number = -1,
    ) {}

    private chapterTitle(): string | null {
        let title: string | null = null;
        if (Metadata.getInstance().hasChapterNames && this.name === '') {
            CompilerMessages.getInstance().add(
                new ParseWarning(
                    'Some chapters have names and others do not.',
                    this.line.lineNumber
                )
            );
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
