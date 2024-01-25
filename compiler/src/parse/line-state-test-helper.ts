import { Line } from "./line";
import { LineState } from "./line-state";

export interface LineTestData {
    given: string,
    result: string,
    count: number
}

export function testSingleLine(given: string, results: Line[] | Line | string) {
    switch(true) {
        case results instanceof Array:
            testMultiLine([given], results as Line[]);
            break;
        case results instanceof Line:
            testMultiLine([given], [results as Line]);
            break;
        case typeof(results) == "string":
            testMultiLine(
                [given],
                [
                    new Line({
                        lineNumber: 0,
                        text: results as string,
                    })
                ]
            );
            break;
    }
}

export function testMultiLine(given: string[], results: Line[]) {
    const lineState = new LineState();
    let newLines: Line[] = [];
    for (let i=0; i < given.length; i++) {
        const line = new Line({
            lineNumber: i,
            text: given[i],
        });
        newLines = newLines.concat(lineState.update(line));
    }
    expect(newLines.length).toBe(results.length);
    for (let i=0; i < results.length; i++) {
        expect(newLines[i].text).toBe(results[i].text);
        expect(newLines[i].emphasis).toEqual(results[i].emphasis);
    }
}
