import { Line } from "./line";
import { Markup, StrippedToken } from "../util/markup";


export class EscapeCharacter {

  static removeAll(line: Line) {
    Markup.removeEsacpe(line, StrippedToken.BlockComment[0]);
    Markup.removeEsacpe(line, StrippedToken.OpenBracket);
    Markup.removeEsacpe(line, StrippedToken.CloseBracket);
  }
}
