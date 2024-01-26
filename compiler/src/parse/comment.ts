import { StrippedToken } from "../util/markup";

export class Comment {
  inBlockComment: boolean = false;

  removeBlockComment(
    text: string,
    index: number,
    inBracketBlock: boolean
  ): [string, string] {
    let left: string = "";
    let right: string;
    if (!inBracketBlock) {
      if (!this.inBlockComment) {
        left = text.substring(0, index).trim();
      }
      this.inBlockComment = !this.inBlockComment;
    }
    right = text.substring(index + StrippedToken.BlockComment.length).trim();
    return [left, right];
  }

  removeLineComment(
    text: string,
    index: number,
    inBracketBlock: boolean
  ): [string, string] {
    if (this.inBlockComment || inBracketBlock) {
      return [
        "",
        text.substring(index + StrippedToken.LineComment.length).trim(),
      ];
    }
    return [text.substring(0, index).trim(), ""];
  }

  reset() {
    this.inBlockComment = false;
  }
}
