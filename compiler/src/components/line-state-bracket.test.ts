import { CompilerMessages } from "../util/compiler-messages";
import { Line, LineType } from "./line";
import { LineState } from "./line-state";
import { testSingleLine, testMultiLine } from './line-state-test-helper';

describe('LineState', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

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
        testMultiLine(
            [
                'abc [XXX',
                'ZZZ',
                'XXX ] def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 2),
            ]
        );
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
        testMultiLine(
            [
                'abc ### XXX [',
                'ZZZ',
                ']XXX ### def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 2),
            ]
        );
    });

    test('ignores line and block comments contained within a bracket block', () => {
        testMultiLine(
            [
                'abc [XXX',
                'ZZZ ### ZZZ',
                '### YYY',
                '] def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 3),
            ]
        );
    });

    test('ignores beginning bracket block hidden by a line comment', () => {
        testMultiLine(
            [
                'abc ## XXX [',
                'def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 1),
            ]
        );
    });

    test('ignores beginning bracket block hidden by a block comment', () => {
        testMultiLine(
            [
                'abc ### XXX [ ### def',
                'ghi',
            ],
            [
                new Line('abc def', 0),
                new Line('ghi', 1),
            ]
        );
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
