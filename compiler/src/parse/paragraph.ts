import { Line } from "./line";

export class Paragraph {
    private content: string | null = null;
    lines: string[] = [];

    add(line: Line) {
        this.lines.push(line.text);
    }

    getOutput(): string {
        return this.lines.join(' ');
    }
}
