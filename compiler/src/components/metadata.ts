enum Tag {
    Author = 'Author',
    Title = 'Title',
}

export class Metadata {

    author: string|null;
    title: string|null;

    private patterns = {
        tag: /^(Title|Author):\s+/,
        content: /^.*?:\s+(.+)\s*$/,
    }

    constructor() {
        this.title = null;
        this.author = null;
    }

    // private resetPatterns() {
    //     this.patterns.tag.lastIndex = 0;
    //     this.patterns.content.lastIndex = 0;
    // }

    parse(line: string): boolean {
        let isMetadata = false;
        // this.resetPatterns();
        const tag = this.startsWithTag(line);
        if (tag) {
            const match = line.match(this.patterns.content);  //this.patterns.content.exec(line);
            if (match) {
                switch(tag) {
                    case Tag.Author:
                        this.author = match[1];
                        break;
                    case Tag.Title:
                        this.title = match[1];
                        break;
                }
            }
            isMetadata = true;
        }
        return isMetadata;
    }

    private startsWithTag(line: string): Tag | null {
        let tag: Tag | null = null;
        // const match = this.patterns.tag.exec(line);
        const match = line.match(this.patterns.tag);
        if (match) {
            tag = match[1] as Tag;  // TODO add exception handling
        }
        return tag;
    }
}