import { ParseError } from "../util/parse-error";
import { Line } from "./line";

enum Tag {
    Author = 'Author',
    Title = 'Title',
}

export class Metadata {

    author: string|null;
    title: string|null;

    private patterns = {
        tag: /^(Title|Author):/,
        content: /^.*?:\s+(.+)\s*$/,
    }

    constructor() {
        this.title = null;
        this.author = null;
    }

    isMetadata(line: Line): boolean {
        return this.startsWithTag(line) !== null;
    }

    parse(line: Line) {
        const tag = this.startsWithTag(line);
        if (tag) {
            const match = line.text.match(this.patterns.content);
            if (!match) {
                throw new ParseError(
                    `Invalid ${tag} metadata`,
                    line.lineNumber
                );
            }
            else {
                switch(tag) {
                    case Tag.Author:
                        this.author = match[1];
                        break;
                    case Tag.Title:
                        this.title = match[1];
                        break;
                    default:
                        throw new ParseError(
                            `Unrecognized metadata tag ${tag}`,
                            line.lineNumber
                        );
                }
            }
        }
    }

    private startsWithTag(line: Line): Tag | null {
        let tag: Tag | null = null;
        const match = line.text.match(this.patterns.tag);
        if (match) {
            tag = match[1] as Tag;  // TODO add exception handling
        }
        return tag;
    }
}