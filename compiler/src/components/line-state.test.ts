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
        let line: Line;
        let newLine: Line | null;

        line = new Line('abc ### XXX', 0);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('abc');

        line = new Line ('NOT INCLUDED', 1);
        newLine = lineState.update(line);
        expect(newLine).toBeNull();

        line = new Line('XXX ### def', 2);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('def');
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

    // Escaped comments

    test('ignores an escaped block comment', () => {
        let text = 'this sentence ### will contain this';
        const line = new Line('this sentence \\### will contain this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('ignores an escaped block inside another block comment', () => {
        let text = 'this sentence will contain this';
        const line = new Line('this sentence ### will not contain this text but \\### ### will contain this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('ignores an escaped line comment', () => {
        let text = 'this sentence ## will contain this';
        const line = new Line('this sentence \\## will contain this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('ignores an escaped line comment hidden by another line comment', () => {
        let text = 'this sentence';
        const line = new Line('this sentence ## will not contain this \\## or this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('ignores an escaped block hidden by a line comment', () => {
        let text = 'this sentence';
        const line = new Line('this sentence ## will not ### contain ### this text or \\### this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    // Bracket blocks

    test('strips text in a bracket block from the middle of a line', () => {
        const text = 'keep this text';
        const line = new Line('keep this [but not this] text', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('strips text in a bracket block taking up the entire line', () => {
        const line = new Line('[keep nothing]', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('');
    });

    test('strips text in a bracket block from the middle of a line', () => {
        const text = 'keep this text';
        const line = new Line('[not this text] keep this text', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('strips text in a bracket block over multiple lines', () => {
        const lineState = new LineState();
        let line: Line;
        let newLine: Line | null;

        line = new Line('abc [XXX', 0);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('abc');

        line = new Line ('NOT INCLUDED', 1);
        newLine = lineState.update(line);
        expect(newLine).toBeNull();

        line = new Line('XXX ] def', 2);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('def');
    });

    test('ignores a bracket block hidden by a line comment', () => {
        const text = 'keep this text';
        const line = new Line('keep this text ## and everything [else on this line] is ignored', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('ignores a bracket block hidden by a block comment on a single line', () => {
        const text = 'keep this text and this';
        const line = new Line('keep this text ### and [this text] is ignored ### and this', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe(text);
    });

    test('ignores a bracket block hidden by a block comment over multiple lines', () => {
        const lineState = new LineState();
        let line: Line;
        let newLine: Line | null;

        line = new Line('abc ### XXX [', 0);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('abc');

        line = new Line ('NOT INCLUDED', 1);
        newLine = lineState.update(line);
        expect(newLine).toBeNull();

        line = new Line(']XXX ### def', 2);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('def');
    });

    test('ignores line and block comments contained within a bracket block', () => {
        const lineState = new LineState();
        let line: Line;
        let newLine: Line | null;

        line = new Line('abc [XXX', 0);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('abc');

        line = new Line ('NOT INCLUDED ## and neither is this', 1);
        newLine = lineState.update(line);
        expect(newLine).toBeNull();

        line = new Line ('### starting a block comment has no effect', 2);
        newLine = lineState.update(line);
        expect(newLine).toBeNull();

        line = new Line('] def', 3);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('def');
    });

    test('ignores beginning bracket block hidden by a line comment', () => {
        const lineState = new LineState();
        let line: Line;
        let newLine: Line | null;

        line = new Line('abc ## start a bracket block [', 0);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('abc');

        line = new Line('def', 1);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('def');
    });

    test('ignores beginning bracket block hidden by a block comment', () => {
        const lineState = new LineState();
        let line: Line;
        let newLine: Line | null;

        line = new Line('abc ### start a bracket block [ ### def', 0);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('abc def');

        line = new Line('ghi', 1);
        newLine = lineState.update(line);
        expect(newLine).not.toBeNull();
        expect(newLine?.text).toBe('ghi');
    });

    // TODO no closing bracket block - close at EOF
    // TODO ending bracket block hidden by comment - close at EOF
    // TODO error on unescaped closing bracket without opening bracket
});