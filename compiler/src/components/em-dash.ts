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
        updatedLines.push(new Line(splitText[i], line.lineNumber, line.lineType));
        if (i < splitText.length - 1) {
          updatedLines.push(new Line(EmDashProze, line.lineNumber, LineType.emdash));
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
