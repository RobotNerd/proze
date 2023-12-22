export class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;

    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string): void {
        let current = this.root;

        for (const char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char)!;
        }

        current.isEndOfWord = true;
    }

    searchInText(text: string): string[] {
        let matches: string[] = [];

        // TODO rewrite this to be O(N)
        //  - create a dict of all words in progress
        //  - for each char, iterate through all words in progress and/or start new word
        
        for (let i = 0; i < text.length; i++) {
            let current = this.root;
            for (let j = i; j < text.length; j++) {
                const char = text[j];
                if (!current.children.has(char)) {
                    break;
                }

                current = current.children.get(char)!;

                // TODO don't flag as a match if you can keep going
                // - be careful on whitespace
                //   - it's possible to have whitespace be the next character
                //   - but it's also possible for whitespace to end the word
                if (current.isEndOfWord) {
                    matches.push(text.substring(i, j + 1));
                }
            }
        }

        return matches;
    }
}
