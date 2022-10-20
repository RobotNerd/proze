export class Paragraph {
    pattern = /.*?\n\n+/;
    content: string | null = null;

    parse(line: string) {
        const match = line.match(this.pattern);
        if (match) {
            this.content = line;
        }
    }
}
