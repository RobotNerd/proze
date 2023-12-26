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

  constructor(private terminators: string[]) {
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

  // Determine if the current character is the end of a word.
  // 
  // Example:
  // - Invalid word: John
  // - Text: Johnny was his name.
  // - When reaching the first 'n' of "Johnny", the trie will match against the word
  //   "John." This is incorrect, since "John" is a substring of the larger word "Johnny".
  // 
  private isEndOfWord(node: TrieNode, text: string, i: number): boolean {
    if (i < text.length) {
        const nextChar = text[i + 1];
        if (node.isEndOfWord && !this.terminators.includes(nextChar)) {
            return false;
        }
    }

    return node.isEndOfWord;
  }

  searchInText(text: string): string[] {
    let inProgressMatches: { node: TrieNode; startIndex: number }[] = [];
    let longestMatches: Map<number, string> = new Map();

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Update and check in-progress matches
      inProgressMatches = inProgressMatches.filter((match) => {
        if (match.node.children.has(char)) {
          match.node = match.node.children.get(char)!;

          if (this.isEndOfWord(match.node, text, i)) {
            // Set/overwrite value with longest match found so far from the starting index.
            longestMatches.set(match.startIndex, text.substring(match.startIndex, i + 1));
          }

          // Continue this match
          return true;
        }

        // Remove this match as it's no longer valid
        return false;
      });

      // Check if the current character starts a new word
      if (this.root.children.has(char)) {
        inProgressMatches.push({
          node: this.root.children.get(char)!,
          startIndex: i,
        });
      }
    }

    return Array.from(longestMatches.values());
  }
}
