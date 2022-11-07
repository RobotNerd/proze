import { Line } from "./line";
import { LineState } from "./line-state";

describe('LineState', () => {

    // Line comment

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

    // Comment block

    test('strips a comment block from middle of a line', () => {
        let text = 'this sentence will contain this';
        const line = new Line('this sentence ### will not contain this text but ### will contain this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('strips a comment block from the beginning of a line', () => {
        let text = 'this sentence will contain this';
        const line = new Line('### this text will not be included by ### this sentence will contain this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('requires whitespace before block comment if not at beginning of the line', () => {
        let text = 'this sentence will contain this and### this';
        const line = new Line(text, 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('strips a comment block from the end of a line', () => {
        let text = 'this sentence will contain this';
        const line = new Line('this sentence will contain this   ### but will not contain this text ###  ', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('strips multiple comment blocks from a line', () => {
        let text = 'a b c';
        const line = new Line('a ### XXX ### b ### XXX ### c', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('parsed block comments over multiple lines', () => {
        const lineState = new LineState();

        const line1 = new Line('abc ### XXX', 0);
        const newLine1 = lineState.update(line1);
        expect(newLine1).not.toBeNull();
        expect(newLine1?.text).toBe('abc');

        const line2 = new Line ('NOT INCLUDED', 1);
        const newLine2 = lineState.update(line2);
        expect(newLine2).toBeNull();

        const line3 = new Line('XXX ### def', 2);
        const newLine3 = lineState.update(line3);
        expect(newLine3).not.toBeNull();
        expect(newLine3?.text).toBe('def');
    });

    // Line comment and block comment interaction

    test('line comment hides block comments', () => {
        let text = 'only the beginning is included';
        const line = new Line('only the beginning is included ## but nothing else will ### including this ### or this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('block comment hides line comment', () => {
        let text = 'only the beginning is included';
        const line = new Line('only the beginning is included ### but nothing else ## like this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    // Escaped block comments

    // test('ignores an escaped block comment', () => {
    //     let text = 'this sentence ### will contain this';
    //     // const line = new Line('this sentence ### will not contain this text but ### \\### will contain this', 0);
    //     const line = new Line('this sentence \\### will contain this', 0);
    //     const lineState = new LineState();
    //     const newLine = lineState.update(line);
    //     expect(newLine).not.toBeNull();
    //     expect(newLine?.text).toBe(text);
    // });

    // test('ignores an escaped block inside another block comment', () => {
    //     let text = 'this sentence will contain this';
    //     const line = new Line('this sentence ### will not contain this text but \\### ### will contain this', 0);
    //     const lineState = new LineState();
    //     const newLine = lineState.update(line);
    //     expect(newLine).not.toBeNull();
    //     expect(newLine?.text).toBe(text);
    // });
});