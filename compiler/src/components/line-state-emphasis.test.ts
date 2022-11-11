import { CompilerMessages } from "../util/compiler-messages";
import { EmphasisType, Line } from "./line";
import { testMultiLine, testSingleLine } from './line-state-test-helper';

describe('LineState', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

    test('parses a bold block that takes up the entire line', () => {
        const results: Line[] = [new Line('abcd', 0)];
        results[0].emphasis = [EmphasisType.bold];
        testSingleLine(
            '*abcd*',
            results
        );
    });

    test('parses a bold block that takes up the entire line with leading whitespace', () => {
        const results: Line[] = [new Line('abcd', 0)];
        results[0].emphasis = [EmphasisType.bold];
        testSingleLine(
            '   *abcd*',
            results
        );
    });

    test('does not require whitespace before a bold token', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
            new Line('cd', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        results[2].emphasis = [];
        testSingleLine(
            'a*b*cd',
            results
        );
    });

    test('parses a bold block at the beginning of a line', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
        ];
        results[0].emphasis = [EmphasisType.bold];
        results[1].emphasis = [];
        testSingleLine(
            '*a* b',
            results
        );
    });

    test('parses a bold block in the middle of a line', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
            new Line('c', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        results[2].emphasis = [];
        testSingleLine(
            'a *b* c',
            results
        );
    });

    test('parses a bold block at the end of a line', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        testSingleLine(
            'a *b*',
            results
        );
    });

    test('parses a bold block that covers multiple lines', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d', 2),
            new Line('e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        results[2].emphasis = [EmphasisType.bold];
        results[3].emphasis = [EmphasisType.bold];
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

    test('extends bold emphasis to EOF if closing bold token not found', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        results[2].emphasis = [EmphasisType.bold];
        results[3].emphasis = [EmphasisType.bold];
        testMultiLine(
            [
                'a *b',
                'c',
                'd e'
            ],
            results
        );
    });

    test('extends bold emphasis to EOF if closing bold token is commented out by line comment', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        results[2].emphasis = [EmphasisType.bold];
        results[3].emphasis = [EmphasisType.bold];
        testMultiLine(
            [
                'a *b',
                'c ## *',
                'd e'
            ],
            results
        );
    });

    test('extends bold emphasis to EOF if closing bold token is commented out by block comment', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        results[2].emphasis = [EmphasisType.bold];
        results[3].emphasis = [EmphasisType.bold];
        testMultiLine(
            [
                'a *b',
                'c ### *',
                '### d e'
            ],
            results
        );
    });

    test('extends bold emphasis to EOF if closing bold token is in bracket block', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        results[2].emphasis = [EmphasisType.bold];
        results[3].emphasis = [EmphasisType.bold];
        testMultiLine(
            [
                'a *b',
                'c [*]',
                'd e'
            ],
            results
        );
    });

    test('does not apply bold if start/end bold tokens are commented out on a single line', () => {
        const results: Line[] = [
            new Line('a b', 0),
        ];
        results[0].emphasis = [];
        testSingleLine(
            'a ### * ### b ### * ###',
            results
        );
    });

    test('escaping a bold markup token does not start a bold emphasis block', () => {
        const results: Line[] = [
            new Line('a * b', 0),
        ];
        results[0].emphasis = [];
        testSingleLine(
            'a \\* b',
            results
        );
    });

    test('escaped bold markup works when there is no preceeding whitespace', () => {
        const results: Line[] = [
            new Line('a*b', 0),
        ];
        results[0].emphasis = [];
        testSingleLine(
            'a\\*b',
            results
        );
    });

    test('extends bold emphasis to EOF if closing bold token is escaoed', () => {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c *', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = [EmphasisType.bold];
        results[2].emphasis = [EmphasisType.bold];
        results[3].emphasis = [EmphasisType.bold];
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