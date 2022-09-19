export class Sentence {

    content: string = '';

    constructor(content: string) {
        this.content = content;
    }

    getOutput(): string {
        return this.content;
    }
}