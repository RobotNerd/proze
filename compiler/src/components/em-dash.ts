import { Component } from "./component";
import { Line, LineType } from './line';
import { Token } from "./token";

const EmDashProze = '--';
const EmDashUnicode = '—';  // \u{2014}

export class EmDashParser {

  static parse(lines: Line[]): Line[] {
    let updatedLines: Line[] = [];
    for (let line of lines) {
      let splitText = line.text.split(EmDashProze);
      for (let i=0; i < splitText.length; i++) {
        let newLine = Line.copy(line);
        newLine.text = splitText[i];
        updatedLines.push(newLine);
        if (i < splitText.length - 1) {
          let emDashLine = Line.copy(line);
          emDashLine.text = EmDashProze;
          emDashLine.lineType = LineType.emdash;
          updatedLines.push(emDashLine);
        }
      }
    }
    return updatedLines;
  }
}

export class EmDash implements Component {
  public token: Token = Token.emdash;

  toString(): string {
    return EmDashProze;
  }

  toUnicode(): string {
    return EmDashUnicode;
  }
}
