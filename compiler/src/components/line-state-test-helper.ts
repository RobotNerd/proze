import { Line } from "./line";
import { LineState } from "./line-state";

export interface LineTestData {
    given: string,
    result: string,
    count: number
}

export function testSingleLine(given: string, result: string, count: number = 1) {
    const line = new Line(given, 0);
    const lineState = new LineState();
    const newLines = lineState.update(line);
    expect(newLines.length).toBe(count);
    if (count === 1) {
        expect(newLines[0].text).toBe(result);
    }
}

export function testMultiLine(lineData: LineTestData[]) {
    const lineState = new LineState();
    let line: Line;
    let newLines: Line[];

    for (let i=0; i < lineData.length; i++) {
        let data = lineData[i];
        line = new Line(data.given, i);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(data.count);
        if (data.count === 1) {
            expect(newLines[0].text).toBe(data.result);
        }
    }
}