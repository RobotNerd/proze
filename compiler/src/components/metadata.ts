import { Author } from "./author";
import { Chapter } from "./chapter";
import { Line } from "./line";
import { ParseError } from "../util/parse-error";
import { Section } from "./section";
import { Title } from "./title";

enum Tag {
    Author = 'Author',
    Chapter = 'Chapter',
    Section = 'Section',
    SectionSymbol = '---',
    Title = 'Title',
}

export interface MetadataInterface {
    name: string;
}

export class Metadata {

    private static instance: Metadata;
    private chapterNumber: number = 0;

    // Set to true if any chapter tag is parsed that has a name.
    // Example of a named chapter: "Chapter: My Chapter"
    // Example of a non-named chapter: "Chapter:"
    public hasChapterNames: boolean = false;

    private static patterns = {
        tag: /^(Title|Author|Chapter|Section):/,
        sectionSymbol: /^\s*---\s*\n/,
        content: /^.*?:\s+(.+)\s*$/,
    }

    private constructor() {}

    static getInstance(): Metadata {
        if (!Metadata.instance) {
            Metadata.instance = new Metadata();
        }
        return Metadata.instance;
    }

    private getNextChapterNumber(): number {
        this.chapterNumber++;
        return this.chapterNumber;
    }

    isMetadata(line: Line): boolean {
        return Metadata.startsWithTag(line) !== null;
    }

    parse(line: Line): MetadataInterface {
        const tag = Metadata.startsWithTag(line);
        let component: MetadataInterface = { name: '' };
        switch(tag) {
            case Tag.Author:
                component = this.parseAuthor(line);
                break;
            case Tag.Chapter:
                component = this.parseChapter(line);
                break;
            case Tag.Section:
            case Tag.SectionSymbol:
                component = this.parseSection(line);
                break;
            case Tag.Title:
                component = this.parseTitle(line);
                break;
            default:
                throw new ParseError(
                    `Unrecognized metadata tag ${tag}`,
                    line.lineNumber
                );
        }
        return component;
    }

    private parseAuthor(line: Line): MetadataInterface {
        let component: MetadataInterface = { name: '' };
        const match = line.text.match(Metadata.patterns.content);
        if (!match) {
            throw new ParseError(
                `Invalid Author tag: no author name provided`,
                line.lineNumber
            );
        }
        component = new Author(match[1]);
        return component;
    }

    private parseChapter(line: Line): MetadataInterface {
        let name = '';
        let component: MetadataInterface = { name: name };
        const match = line.text.match(Metadata.patterns.content);
        if (match) {
            name = match[1];
            Metadata.getInstance().hasChapterNames = true;
        }
        component = new Chapter(name, this.getNextChapterNumber());
        return component;
    }

    private parseSection(line: Line): MetadataInterface {
        let name = '';
        let component: MetadataInterface = { name: name };
        const match = line.text.match(Metadata.patterns.content);
        if (match) {
            name = match[1];
        }
        component = new Section(name);
        return component;
    }

    private parseTitle(line: Line): MetadataInterface {
        let component: MetadataInterface = { name: '' };
        const match = line.text.match(Metadata.patterns.content);
        if (!match) {
            throw new ParseError(
                `Invalid Title tag: no title provided`,
                line.lineNumber
            );
        }
        component = new Title(match[1]);
        return component;
    }

    /**
     * Reset to initial starting state.
     * Use for testing or if batch compiling multiple projects.
     */
    reset() {
        this.chapterNumber = 0;
        this.hasChapterNames = false;
    }

    private static startsWithTag(line: Line): Tag | null {
        let tag: Tag | null = null;
        let match = line.text.match(Metadata.patterns.tag);
        if (match) {
            tag = match[1] as Tag;  // TODO add exception handling
        }
        else {
            match = line.text.match(Metadata.patterns.sectionSymbol);
            if (match) {
                tag = Tag.SectionSymbol;
            }
        }
        return tag;
    }
}
