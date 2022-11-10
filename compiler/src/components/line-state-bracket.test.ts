import { CompilerMessages } from "../util/compiler-messages";
import { Line } from "./line";
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
        testMultiLine([
            {
                given: 'abc [XXX',
                result: 'abc',
                count: 1,
            },
            {
                given: 'ZZZ',
                result: '',
                count: 0,
            },
            {
                given: 'XXX ] def',
                result: 'def',
                count: 1
            }
        ]);
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
        testMultiLine([
            {
                given: 'abc ### XXX [',
                result: 'abc',
                count: 1,
            },
            {
                given: 'ZZZ',
                result: '',
                count: 0,
            },
            {
                given: ']XXX ### def',
                result: 'def',
                count: 1
            }
        ]);
    });

    test('ignores line and block comments contained within a bracket block', () => {
        testMultiLine([
            {
                given: 'abc [XXX',
                result: 'abc',
                count: 1,
            },
            {
                given: 'ZZZ ### ZZZ',
                result: '',
                count: 0,
            },
            {
                given: '### YYY',
                result: '',
                count: 0,
            },
            {
                given: '] def',
                result: 'def',
                count: 1
            }
        ]);
    });

    test('ignores beginning bracket block hidden by a line comment', () => {
        testMultiLine([
            {
                given: 'abc ## XXX [',
                result: 'abc',
                count: 1,
            },
            {
                given: 'def',
                result: 'def',
                count: 1
            }
        ]);
    });

    test('ignores beginning bracket block hidden by a block comment', () => {
        testMultiLine([
            {
                given: 'abc ### XXX [ ### def',
                result: 'abc def',
                count: 1,
            },
            {
                given: 'ghi',
                result: 'ghi',
                count: 1
            }
        ]);
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