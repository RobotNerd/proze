import { Markup, StrippedToken } from "../util/markup";
import { Line } from "../parse/line";


export class Comments {

    private inBlockComment: boolean = false;

    // TODO move to Line class
    // Preserve leading spaces so that can be used later for setting block quote level.
    private leadingSpaces(text: string): string {
        let i = 0;
        for (; i < text.length; i++) {
            if (text[i] !== ' ') {
                break;
            }
        }
        return text.substring(0, i);
    }

    private nextToken(text: string): [StrippedToken, number] {
        const blockCommentIndex = Markup.findNextToken(text, StrippedToken.BlockComment);
        const lineCommentIndex = Markup.findNextToken(text, StrippedToken.LineComment);

        let index: number = blockCommentIndex;
        let token: StrippedToken = StrippedToken.BlockComment;
        if (lineCommentIndex != -1 && (lineCommentIndex < index || index == -1)) {
            index = lineCommentIndex;
            token = StrippedToken.LineComment;
        }
        return [token, index];
    }

    private parse(line: Line | null): Line | null {
        if (line === null) {
            return null;
        }

        let index: number;
        let leadingSpaces: string = this.leadingSpaces(line.text);
        let substrings: string[] = [];
        let text = line.text;
        let token: StrippedToken;

        do {
            [token, index] = this.nextToken(text);
            if (index < 0) {
                if (!this.inBlockComment) {
                    substrings.push(text);
                }
            }
            else {
                let parsedText: string = '';
                switch(token) {
                    case StrippedToken.BlockComment:
                        [parsedText, text] = this.removeBlockComment(text, index);
                        break;
                    case StrippedToken.LineComment:
                        [parsedText, text] = this.removeLineComment(text, index);
                        break;
                }
                if (parsedText != '') {
                    substrings.push(parsedText);
                }
            }
        } while (index != -1);

        let updatedLine: Line | null = null;
        if (substrings.length > 0) {
            updatedLine = Line.copy(line);
            updatedLine.text = substrings.join(' ').trim();
            updatedLine.text = leadingSpaces + updatedLine?.text;

            if (updatedLine.text.trim() === '' && line.text.trim() !== '') {
              // The entire line contained commented out text (with possible additional whitespace).
              // Return null so this line doesn't get counted as an empty line.
              return null;
            }
        }

        return updatedLine;
    }

    removeAll(textLines: string[], filePath: string): Line[] {
      let lines: Line[] = [];
      for(let i=0; i < textLines.length; i++) {
          let line = this.parse(
              new Line({
                  filePath: filePath,
                  lineNumber: i,
                  text: textLines[i],
              })
          );
          if (line) {
              lines.push(line);
          }
      }
      return lines;
    }
    
    private removeBlockComment(text: string, index: number): [string, string] {
        let left: string = '';
        let right: string;
          if (!this.inBlockComment) {
              left = text.substring(0, index).trim();
          }
          this.inBlockComment = !this.inBlockComment;
        right = text.substring(index + StrippedToken.BlockComment.length).trim();
        return [left, right];
    }

    private removeLineComment(text: string, index: number): [string, string] {
        if (this.inBlockComment) {
            return ['', text.substring(index + StrippedToken.LineComment.length).trim()];
        }
        return [text.substring(0, index).trim(), ''];
    }

    reset() {
        this.inBlockComment = false;
    }
}
