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

    // TODO bold block without closing token - extends to EOF
    // TODO bold block with closing token commented out - extends to EOF
    // TODO bold block with closing token in bracket block - extends to EOF
    // TODO bold start/end tokens commented out on single line - no bold applied
    // TODO bold block starting token commented out - bold not applied
    // TODO bold block starting token in bracket block - bold not applied
    // TODO bold start/end surrounding a line comment - bold applied
    // TODO bold start/end surrounding a block comment - bold applied
});