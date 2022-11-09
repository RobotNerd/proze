import { CompilerMessages } from "../util/compiler-messages";
import { Line } from "./line";
import { LineState } from "./line-state";

function testSingleLine(given: string, result: string, count: number = 1) {
    const line = new Line(given, 0);
    const lineState = new LineState();
    const newLines = lineState.update(line);
    expect(newLines.length).toBe(count);
    if (count === 1) {
        expect(newLines[0].text).toBe(result);
    }
}

describe('LineState', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

    // Line comment

    test('strips line comments from the end of a line', () => {
        testSingleLine(
            'abc ## XXX',
            'abc'
        );
    });

    test('returns null if entire line is commented out', () => {
        testSingleLine('## XXX', '', 0);
    });

    test('returns null if entire line is leading whitespace followed by a comment', () => {
        testSingleLine('     ## XXX', '', 0);
    });

    // Comment block

    test('strips a comment block from middle of a line', () => {
        testSingleLine(
            'abc ### XXX ### def',
            'abc def'
        );
    });

    test('strips a comment block from the beginning of a line', () => {
        testSingleLine(
            '### XXX ### abc',
            'abc'
        );
    });

    test('requires whitespace before block comment if not at beginning of the line', () => {
        testSingleLine(
            'abc def### ghi',
            'abc def### ghi'
        );
    });

    test('strips a comment block from the end of a line', () => {
        testSingleLine(
            'abc   ### XXX ###  ',
            'abc'
        );
    });

    test('strips multiple comment blocks from a line', () => {
        testSingleLine(
            'a ### XXX ### b ### XXX ### c',
            'a b c'
        );
    });

    test('parsed block comments over multiple lines', () => {
        const lineState = new LineState();
        let line: Line;
        let newLines: Line[];

        line = new Line('abc ### XXX', 0);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abc');

        line = new Line ('NOT INCLUDED', 1);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(0);

        line = new Line('XXX ### def', 2);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('def');
    });

    // Line comment and block comment interaction

    test('line comment hides block comments', () => {
        testSingleLine(
            'abc ## XXX ### XXX',
            'abc'
        );
    });

    test('block comment hides line comment', () => {
        testSingleLine(
            'abc ### XXX ## XXX',
            'abc'
        );
    });

    // Escaped comments

    test('ignores an escaped block comment', () => {
        testSingleLine(
            'abc \\### def',
            'abc ### def'
        );
    });

    test('ignores an escaped block inside another block comment', () => {
        testSingleLine(
            'abc ### XXX \\### ### def',
            'abc def'
        );
    });

    test('ignores an escaped line comment', () => {
        testSingleLine(
            'abc \\## def',
            'abc ## def'
        );
    });

    test('ignores an escaped line comment hidden by another line comment', () => {
        testSingleLine(
            'abc ## XXX \\## XXX',
            'abc'
        );
    });

    test('ignores an escaped block hidden by a line comment', () => {
        testSingleLine(
            'abc ## XXX ### XXX ### XXX \\### XXX',
            'abc'
        );
    });

    // Bracket blocks

    test('strips text in a bracket block from the middle of a line', () => {
        testSingleLine(
            'abc [XXX] def',
            'abc def'
        );
    });

    test('strips text in a bracket block taking up the entire line', () => {
        testSingleLine('[XXX]', '');
    });

    test('strips text in a bracket block from the middle of a line', () => {
        testSingleLine('[XXX] abc', 'abc');
    });

    test('strips text in a bracket block over multiple lines', () => {
        const lineState = new LineState();
        let line: Line;
        let newLines: Line[];

        line = new Line('abc [XXX', 0);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abc');

        line = new Line ('NOT INCLUDED', 1);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(0);

        line = new Line('XXX ] def', 2);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('def');
    });

    test('ignores a bracket block hidden by a line comment', () => {
        testSingleLine(
            'abc ## XXX [XXX] XXX',
            'abc'
        );
    });

    test('ignores a bracket block hidden by a block comment on a single line', () => {
        testSingleLine(
            'abc ### XXX [XXX] XXX ### def',
            'abc def'
        );
    });

    test('ignores a bracket block hidden by a block comment over multiple lines', () => {
        const lineState = new LineState();
        let line: Line;
        let newLines: Line[];

        line = new Line('abc ### XXX [', 0);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abc');

        line = new Line ('NOT INCLUDED', 1);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(0);

        line = new Line(']XXX ### def', 2);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('def');
    });

    test('ignores line and block comments contained within a bracket block', () => {
        const lineState = new LineState();
        let line: Line;
        let newLines: Line[];

        line = new Line('abc [XXX', 0);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abc');

        line = new Line ('NOT INCLUDED ## and neither is this', 1);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(0);

        line = new Line ('### starting a block comment has no effect', 2);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(0);

        line = new Line('] def', 3);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('def');
    });

    test('ignores beginning bracket block hidden by a line comment', () => {
        const lineState = new LineState();
        let line: Line;
        let newLines: Line[];

        line = new Line('abc ## start a bracket block [', 0);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abc');

        line = new Line('def', 1);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('def');
    });

    test('ignores beginning bracket block hidden by a block comment', () => {
        const lineState = new LineState();
        let line: Line;
        let newLines: Line[];

        line = new Line('abc ### start a bracket block [ ### def', 0);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abc def');

        line = new Line('ghi', 1);
        newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('ghi');
    });

    test('ignores escaped brackets', () => {
        testSingleLine(
            'abc \\[ def \\] ghi',
            'abc [ def ] ghi'
        );
    });

    test('ignores escaped brackets within a bracket block', () => {
        testSingleLine(
            'abc [ XXX \\[ XXX \\] XXX ]',
            'abc'
        );
    });

    test('throws compile error on unescaped closing bracket without matching opening bracket', () => {
        const line = new Line('this will fail with ] an error', 0);
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
        expect(CompilerMessages.getInstance().errors.length).toBe(1);
    });
});