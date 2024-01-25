import { CompilerMessages } from "../util/compiler-messages";
import { Line } from "./line";
import { LineState } from "./line-state";
import { ProzeArgs } from '../util/cli-arguments';
import { TestUtils } from "../util/test-utils";

describe('LineState', () => {

    let mockArgs: ProzeArgs;

    beforeEach(() => {
        mockArgs = TestUtils.resetCompiler();
        mockArgs.path = '';
    });

    test('strips text in a bracket block from the middle of a line', () => {
        mockArgs.inputString = 'abc [XXX] def';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('strips text in a bracket block taking up the entire line', () => {
        mockArgs.inputString = '[XXX]';
        TestUtils.runTest(mockArgs, '');
    });

    test('strips text in a bracket block from the middle of a line', () => {
        mockArgs.inputString = '[XXX] abc';
        TestUtils.runTest(mockArgs, 'abc\n');
    });

    test('strips text in a bracket block over multiple lines', () => {
        mockArgs.inputString = 'abc [XXX\nZZZ\nXXX] def';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes bracketed line mid-paragraph', () => {
        mockArgs.inputString = 'abc\n[ZZZ]\ndef';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes bracketed line mid-paragraph with leading whitespace', () => {
        mockArgs.inputString = 'abc\n   [ZZZ]\ndef';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes bracketed line at beginning of paragraph', () => {
        mockArgs.inputString = '[ZZZ]\nabc\ndef';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes bracketed line at beginning of paragraph with leading whitespace', () => {
        mockArgs.inputString = '   [ZZZ]\nabc\ndef';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes bracketed line at end of paragraph', () => {
        mockArgs.inputString = 'abc\ndef\n[ZZZ]';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes bracketed line at end of paragraph with leading whitespace', () => {
        mockArgs.inputString = 'abc\ndef\n   [ZZZ]';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('ignores a bracket block hidden by a line comment', () => {
        mockArgs.inputString = 'abc ## XXX [XXX] XXX';
        TestUtils.runTest(mockArgs, 'abc\n');
    });

    test('ignores a bracket block hidden by a block comment on a single line', () => {
        mockArgs.inputString = 'abc ### XXX [XXX] XXX ### def';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('ignores a bracket block hidden by a block comment over multiple lines', () => {
        mockArgs.inputString = [
            'abc ### XXX [',
            'ZZZ',
            ']XXX ### def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('ignores line and block comments contained within a bracket block', () => {
        mockArgs.inputString = [
            'abc [XXX',
            'ZZZ ### ZZZ',
            '### YYY',
            '] def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('ignores beginning bracket block hidden by a line comment', () => {
        mockArgs.inputString = 'abc ## XXX [\ndef';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('ignores beginning bracket block hidden by a block comment', () => {
        mockArgs.inputString = 'abc ### XXX [ ### def\nghi';
        TestUtils.runTest(mockArgs, 'abc def ghi\n');
    });

    test('ignores escaped brackets', () => {
        mockArgs.inputString = 'abc \\[ def \\] ghi';
        TestUtils.runTest(mockArgs, 'abc [ def ] ghi\n');
    });

    test('ignores escaped brackets within a bracket block', () => {
        mockArgs.inputString = 'abc [ XXX \\[ XXX \\] XXX ]';
        TestUtils.runTest(mockArgs, 'abc\n');
    });

    test('throws compile error on unescaped closing bracket without matching opening bracket', () => {
        const line = new Line({text: 'this will fail with ] an error', lineNumber: 0});
        const lineState = new LineState();
        const newLine = lineState.update(line);
        expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
        expect(CompilerMessages.getInstance().errors.length).toBe(1);
    });
});
