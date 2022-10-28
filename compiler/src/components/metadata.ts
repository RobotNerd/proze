import { ParseError } from "../util/parse-error";
import { Author } from "./author";
import { Chapter } from "./chapter";
import { Line } from "./line";
import { Title } from "./title";

enum Tag {
    Author = 'Author',
    Chapter = 'Chapter',
    Title = 'Title',
}

export interface MetadataInterface {
    name: string;
}

export class Metadata {

    private static instance: Metadata;

    private static patterns = {
        tag: /^(Title|Author|Chapter):/,
        content: /^.*?:\s+(.+)\s*$/,
    }

    private constructor() {}

    static getInstance(): Metadata {
        if (!Metadata.instance) {
            Metadata.instance = new Metadata();
        }
        return Metadata.instance;
    }

    isMetadata(line: Line): boolean {
        return Metadata.startsWithTag(line) !== null;
    }

    parse(line: Line): MetadataInterface {
        const tag = Metadata.startsWithTag(line);
        let component: MetadataInterface = { name: '' };
        if (tag) {
            const match = line.text.match(Metadata.patterns.content);
            if (!match) {
                throw new ParseError(
                    `Invalid ${tag} metadata`,
                    line.lineNumber
                );
            }
            else {
                switch(tag) {
                    case Tag.Author:
                        component = new Author(match[1]);
                        break;
                    case Tag.Chapter:
                        component = new Chapter(match[1]);
                        break;
                    case Tag.Title:
                        component = new Title(match[1]);
                        break;
                    default:
                        throw new ParseError(
                            `Unrecognized metadata tag ${tag}`,
                            line.lineNumber
                        );
                }
            }
        }
        return component;
    }

    private static startsWithTag(line: Line): Tag | null {
        let tag: Tag | null = null;
        const match = line.text.match(Metadata.patterns.tag);
        if (match) {
            tag = match[1] as Tag;  // TODO add exception handling
        }
        return tag;
    }
}