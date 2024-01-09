import { Line, LineType } from '../parse/line';

export const EmDashProze = '--';

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
