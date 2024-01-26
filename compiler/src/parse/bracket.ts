import { CompilerDirective, DirectiveType } from "../util/compiler-directive";
import { CompilerMessages } from "../util/compiler-messages";
import { Line } from "../parse/line";
import { ParseError } from "../util/parse-error";
import { StrippedToken } from "../util/markup";

export class Bracket {
  inBracketBlock: boolean = false;
  isBracketAtLineStart: boolean = true;
  lineDirectives: CompilerDirective[] = [];

  applyLineDirectives(line: Line) {
    if (this.lineDirectives.length > 0) {
      for (let lineDirective of this.lineDirectives) {
        switch (lineDirective.directiveType) {
          case DirectiveType.indent:
          case DirectiveType.unindent:
            if (this.isBracketAtLineStart) {
              line.indentDirective = lineDirective;
            }
            break;
        }
      }
      this.lineDirectives = [];
    }
  }

  checkBracketAtLineStart(substrings: string[], parsedText: string) {
    if (substrings.length > 0) {
      this.isBracketAtLineStart = false;
    } else if (parsedText !== "") {
      this.isBracketAtLineStart = false;
    }
  }

  parseCompilerDirectives(text: string, token: StrippedToken, index: number) {
    let textInsideBrackets = text;
    if (this.inBracketBlock) {
      if (index >= 0) {
        if (token === StrippedToken.OpenBracket) {
          textInsideBrackets = text.substring(index + 1, text.length);
        } else if (token === StrippedToken.CloseBracket) {
          textInsideBrackets = text.substring(0, index);
        }
      }
      textInsideBrackets = textInsideBrackets.trim();

      let directives = CompilerDirective.parse(textInsideBrackets);
      for (let directive of directives) {
        switch (directive?.directiveType) {
          case DirectiveType.indent:
          case DirectiveType.unindent:
            this.lineDirectives.push(directive);
            break;
        }
      }
    }
  }

  removeBracketBlock(
    text: string,
    index: number,
    line: Line,
    inBlockComment: boolean
  ): [string, string] {
    let left: string = "";
    let right: string;
    if (!inBlockComment) {
      if (this.inBracketBlock) {
        this.inBracketBlock = false;
      } else {
        left = text.substring(0, index).trim();
        let message = [
          'Closing bracket "]" found without prior matching opening bracket.',
          'If you want this to be in the output, esacpe it with a "\\" character.',
        ];
        CompilerMessages.getInstance().add(
          new ParseError(message.join(" "), line.lineNumber, line.filePath)
        );
      }
    }
    right = text.substring(index + StrippedToken.CloseBracket.length).trim();
    return [left, right];
  }

  reset() {
    this.inBracketBlock = false;
  }

  startBracketBlock(
    text: string,
    index: number,
    inBlockComment: boolean
  ): [string, string] {
    let left: string = "";
    let right: string;
    if (!inBlockComment && !this.inBracketBlock) {
      left = text.substring(0, index).trim();
      this.inBracketBlock = true;
    }
    right = text.substring(index + StrippedToken.OpenBracket.length).trim();
    return [left, right];
  }
}
