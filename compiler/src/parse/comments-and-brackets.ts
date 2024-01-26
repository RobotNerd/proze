import { Brackets } from './brackets';
import { Comments } from './comments';
import { Line } from './line';


export class CommentsAndBrackets {
  static removeAll(textLines: string[], filePath: string): Line[] {
    let comments = new Comments();
    let brackets = new Brackets();

    let linesWithoutComments = comments.removeAll(textLines, filePath);
    let linesWithoutBrackets = brackets.removeAll(linesWithoutComments);

    return linesWithoutBrackets;
  }
}
