import { Bracket } from "./bracket";
import { Comment } from "./comment";
import { Line } from "../parse/line";
import { Markup, StrippedToken } from "../util/markup";


export class CommentsAndBrackets {

    private bracket = new Bracket();
    private comment = new Comment();

    private parse(line: Line | null): Line[] {
        if (line === null) {
            return [];
        }

        let index: number;
        let leadingSpaces: string = this.parseLeadingSpaces(line.text);
        let substrings: string[] = [];
        let text = line.text;
        let token: StrippedToken;

        do {
            [token, index] = this.nextToken(text);
            this.bracket.parseCompilerDirectives(text, token, index);
            if (index < 0) {
                if (!this.comment.inBlockComment && !this.bracket.inBracketBlock) {
                    substrings.push(text);
                }
            }
            else {
                let parsedText: string = '';
                switch(token) {
                    case StrippedToken.BlockComment:
                        [parsedText, text] = this.comment.removeBlockComment(text, index, this.bracket.inBracketBlock);
                        break;
                    case StrippedToken.LineComment:
                        [parsedText, text] = this.comment.removeLineComment(text, index, this.bracket.inBracketBlock);
                        break;
                    case StrippedToken.OpenBracket:
                        [parsedText, text] = this.bracket.startBracketBlock(text, index, this.comment.inBlockComment);
                        break;
                    case StrippedToken.CloseBracket:
                        [parsedText, text] = this.bracket.removeBracketBlock(text, index, line, this.comment.inBlockComment);
                        this.bracket.checkBracketAtLineStart(substrings, parsedText);
                        this.bracket.applyLineDirectives(line);
                        break;
                }
                if (parsedText != '') {
                    substrings.push(parsedText);
                }
            }
        } while (index != -1);

        return this.mergeParsedSubstrings(substrings, line, leadingSpaces);
    }

    private mergeParsedSubstrings(substrings: string[], line: Line, leadingSpaces: string): Line[] {
      let updatedLines: Line[] = [];
        if (substrings.length > 0) {
            let updatedLine = Line.copy(line);
            updatedLine.text = substrings.join(' ').trim();
            updatedLine.text = leadingSpaces + updatedLine?.text;
            updatedLines.push(updatedLine);
            if (updatedLine.text.trim() === '' && line.text.trim() !== '') {
              // The entire line contained commented/bracketed text with possible additional whitespace.
              // Return null so this line doesn't get counted as an empty line.
              return [];
            }
        }
        return updatedLines;
    }

    private nextToken(text: string): [StrippedToken, number] {
        const requireWhitespaceBefore = false;
        const blockCommentIndex = Markup.findNextToken(text, StrippedToken.BlockComment);
        const lineCommentIndex = Markup.findNextToken(text, StrippedToken.LineComment);
        const openBracketIndex = Markup.findNextToken(text, StrippedToken.OpenBracket, requireWhitespaceBefore);
        const closeBracketIndex = Markup.findNextToken(text, StrippedToken.CloseBracket, requireWhitespaceBefore);

        let index: number = blockCommentIndex;
        let token: StrippedToken = StrippedToken.BlockComment;
        if (lineCommentIndex != -1 && (lineCommentIndex < index || index == -1)) {
            index = lineCommentIndex;
            token = StrippedToken.LineComment;
        }
        if (openBracketIndex != -1 && (openBracketIndex < index || index == -1)) {
            index = openBracketIndex;
            token = StrippedToken.OpenBracket;
        }
        if (closeBracketIndex != -1 && (closeBracketIndex < index || index == -1)) {
            index = closeBracketIndex;
            token = StrippedToken.CloseBracket;
        }
        return [token, index];
    }

    // Preserve leading spaces so that can be used later for setting block quote level.
    private parseLeadingSpaces(text: string): string {
        let i = 0;
        for (; i < text.length; i++) {
            if (text[i] !== ' ') {
                break;
            }
        }
        return text.substring(0, i);
    }

    removeAll(textLines: string[], filePath: string): Line[] {
      let lines: Line[] = [];
      for(let i=0; i < textLines.length; i++) {
          let parsedLines = this.parse(
              new Line({
                  filePath: filePath,
                  lineNumber: i,
                  text: textLines[i],
              })
          );
          if (parsedLines.length > 0) {
              lines = [...lines, ...parsedLines];
          }
      }
      return lines;
    }

    reset() {
        this.comment.reset();
        this.bracket.reset();
    }
}

