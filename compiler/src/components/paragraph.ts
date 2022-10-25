export class Paragraph {
    private content: string | null = null;
    lines: string[] = [];

    add(line: string) {
        this.lines.push(line);
    }

    getOutput(): string {
        return this.lines.join(' ');
    }
}
