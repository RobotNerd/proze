import { Line, LineType } from '../parse/line';

export const EmDashProze = '--';

export class EmDashParser {

  static parse(lines: Line[]): Line[] {
    let updatedLines: Line[] = [];
    for (let line of lines) {
      let splitText = line.text.split(EmDashProze);
      for (let i=0; i < splitText.length; i++) {
        updatedLines.push(
          Line.copy(line, { text: splitText[i] })
        );
        if (i < splitText.length - 1) {
          updatedLines.push(
            Line.copy(line, {
              lineType: LineType.emdash,
              text: EmDashProze,
            })
          );
        }
      }
    }
    return updatedLines;
  }
}
