import { Line } from "./line";
import { LineState } from "./line-state";

describe('LineState', () => {

    test('strips line comments from the end of a line', () => {
        const text = `keep this text`;
        const line = new Line(`${text} ## remove this text`, 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('returns null if entire line is commented out', () => {
        const line = new Line('## remove this text', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).toBeNull();
    });

    test('returns null if entire line is leading whitespace followed by a comment', () => {
        const line = new Line('     ## remove this text', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).toBeNull();
    });
});