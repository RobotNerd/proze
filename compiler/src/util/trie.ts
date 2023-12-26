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
    let inProgressMatches: { node: TrieNode; startIndex: number }[] = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Update and check in-progress matches
      inProgressMatches = inProgressMatches.filter((match) => {
        if (match.node.children.has(char)) {
          match.node = match.node.children.get(char)!;

          if (match.node.isEndOfWord) {
            matches.push(text.substring(match.startIndex, i + 1));
          }

          return true; // Continue this match
        }

        return false; // Remove this match as it's no longer valid
      });

      // Check if the current character starts a new word
      if (this.root.children.has(char)) {
        inProgressMatches.push({
          node: this.root.children.get(char)!,
          startIndex: i,
        });
      }
    }

    return matches;
  }
}
