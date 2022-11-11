import { CompilerMessages } from "../util/compiler-messages";
import { EmphasisType, Line } from "./line";
import { testMultiLine, testSingleLine } from './line-state-test-helper';

// TODO this are duplicates of the bold test except for the markup token; try to generalize

describe('LineState', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

    test('parses a italic block that takes up the entire line', () => {
        const results: Line[] = [new Line('abcd', 0)];
        results[0].emphasis = [EmphasisType.italic];
        testSingleLine(
            '*abcd*',
            results
        );
    });

    test('parses a italic block that takes up the entire line with leading whitespace', () => {
        const results: Line[] = [new Line('abcd', 0)];
        results[0].emphasis = [EmphasisType.italic];
        testSingleLine(
            '   *abcd*',
            results
        );
    });

    test('does not require whitespace before a italic token', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
            new Line('cd', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        results[2].emphasis = [];
        testSingleLine(
            'a*b*cd',
            results
        );
    });

    test('parses a italic block at the beginning of a line', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
        ];
        results[0].emphasis = [EmphasisType.italic];
        results[1].emphasis = [];
        testSingleLine(
            '*a* b',
            results
        );
    });

    test('parses a italic block in the middle of a line', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
            new Line('c', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        results[2].emphasis = [];
        testSingleLine(
            'a *b* c',
            results
        );
    });

    test('parses a italic block at the end of a line', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        testSingleLine(
            'a *b*',
            results
        );
    });

    test('parses a italic block that covers multiple lines', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d', 2),
            new Line('e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        results[2].emphasis = [EmphasisType.italic];
        results[3].emphasis = [EmphasisType.italic];
        results[4].emphasis = [];
        testMultiLine(
            [
                'a *b',
                'c',
                'd* e'
            ],
            results
        );
    });

    test('extends italic emphasis to EOF if closing italic token not found', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        results[2].emphasis = [EmphasisType.italic];
        results[3].emphasis = [EmphasisType.italic];
        testMultiLine(
            [
                'a *b',
                'c',
                'd e'
            ],
            results
        );
    });

    test('extends italic emphasis to EOF if closing italic token is commented out by line comment', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        results[2].emphasis = [EmphasisType.italic];
        results[3].emphasis = [EmphasisType.italic];
        testMultiLine(
            [
                'a *b',
                'c ## *',
                'd e'
            ],
            results
        );
    });

    test('extends italic emphasis to EOF if closing italic token is commented out by block comment', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        results[2].emphasis = [EmphasisType.italic];
        results[3].emphasis = [EmphasisType.italic];
        testMultiLine(
            [
                'a *b',
                'c ### *',
                '### d e'
            ],
            results
        );
    });

    test('extends italic emphasis to EOF if closing italic token is in bracket block', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        results[2].emphasis = [EmphasisType.italic];
        results[3].emphasis = [EmphasisType.italic];
        testMultiLine(
            [
                'a *b',
                'c [*]',
                'd e'
            ],
            results
        );
    });

    test('does not apply italic if start/end italic tokens are commented out on a single line', () => {
        const results: Line[] = [
            new Line('a b', 0),
        ];
        results[0].emphasis = [];
        testSingleLine(
            'a ### * ### b ### * ###',
            results
        );
    });

    test('escaping a italic markup token does not start a italic emphasis block', () => {
        const results: Line[] = [
            new Line('a * b', 0),
        ];
        results[0].emphasis = [];
        testSingleLine(
            'a \\* b',
            results
        );
    });

    test('escaped italic markup works when there is no preceeding whitespace', () => {
        const results: Line[] = [
            new Line('a*b', 0),
        ];
        results[0].emphasis = [];
        testSingleLine(
            'a\\*b',
            results
        );
    });

    test('extends italic emphasis to EOF if closing italic token is escaoed', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c *', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.italic];
        results[2].emphasis = [EmphasisType.italic];
        results[3].emphasis = [EmphasisType.italic];
        testMultiLine(
            [
                'a *b',
                'c \\*',
                'd e'
            ],
            results
        );
    });
});