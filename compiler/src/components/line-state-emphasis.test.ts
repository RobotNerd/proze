import { stringify } from "querystring";
import { CompilerMessages } from "../util/compiler-messages";
import { EmphasisType, Line } from "./line";
import { testMultiLine, testSingleLine } from './line-state-test-helper';

describe('LineState', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

    test('parses bold block that takes up the entire line', () => { entireLine('__abcd__', [EmphasisType.bold]); });
    test('parses italic block that takes up the entire line', () => { entireLine('*abcd*', [EmphasisType.italic]); });
    function entireLine(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [new Line('abcd', 0)];
        results[0].emphasis =emphasis;
        testSingleLine(given, results);
    }

    test('parses bold block that takes up the entire line with leading whitespace', () => {
        entireLineLeadingWhitespace('    __abcd__', [EmphasisType.bold])
    });
    test('parses italic block that takes up the entire line with leading whitespace', () => {
        entireLineLeadingWhitespace('    *abcd*', [EmphasisType.italic])
    });
    function entireLineLeadingWhitespace(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [new Line('abcd', 0)];
        results[0].emphasis = emphasis;
        testSingleLine(given, results);
    }

    test('does not require whitespace before bold token', () => {
        noLeadingWhitespaceRequired('a__b__cd', [EmphasisType.bold]);
    });
    test('does not require whitespace before italic token', () => {
        noLeadingWhitespaceRequired('a*b*cd', [EmphasisType.italic]);
    });
    function noLeadingWhitespaceRequired(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
            new Line('cd', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = emphasis;
        results[2].emphasis = [];
        testSingleLine(given, results);
    }

    test('parses bold block at the beginning of a line', () => { beginningOfLine('__a__ b', [EmphasisType.bold]); });
    test('parses italic block at the beginning of a line', () => { beginningOfLine('*a* b', [EmphasisType.italic]); });
    function beginningOfLine(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
        ];
        results[0].emphasis = emphasis;
        results[1].emphasis = [];
        testSingleLine(given, results);
    }

    test('parses bold block in the middle of a line', () => { middleOfLine('a __b__ c', [EmphasisType.bold]); });
    test('parses italic block in the middle of a line', () => { middleOfLine('a *b* c', [EmphasisType.italic]); });
    function middleOfLine(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
            new Line('c', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = emphasis;
        results[2].emphasis = [];
        testSingleLine(given, results);
    }

    test('parses bold block at the end of a line', () => { endOfLine('a __b__', [EmphasisType.bold]); });
    test('parses italic block at the end of a line', () => { endOfLine('a *b*', [EmphasisType.italic]); });
    function endOfLine(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
        ];
        results[0].emphasis = [];
        results[1].emphasis = emphasis;
        testSingleLine(given, results);
    }

    test('parses bold block that covers multiple lines', () => {
        multipleLines(['a __b', 'c', 'd__ e'], [EmphasisType.bold]);
    });
    test('parses italic block that covers multiple lines', () => {
        multipleLines(['a *b', 'c', 'd* e'], [EmphasisType.italic]);
    });
    function multipleLines(given: string[], emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d', 2),
            new Line('e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = emphasis;
        results[2].emphasis = emphasis;
        results[3].emphasis = emphasis;
        results[4].emphasis = [];
        testMultiLine(given, results);
    }

    test('extends bold emphasis to EOF if closing token not found', () => {
        noClosingToken(
            ['a __b', 'c', 'd e'], [EmphasisType.bold]
        );
    });
    test('extends italic emphasis to EOF if closing token not found', () => {
        noClosingToken(
            ['a *b', 'c', 'd e'], [EmphasisType.italic]
        );
    });
    function noClosingToken(given: string[], emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = emphasis;
        results[2].emphasis = emphasis;
        results[3].emphasis = emphasis;
        testMultiLine(given, results);
    }

    test('extends bold emphasis to EOF if closing token is commented out by line comment', () => {
        closingTokenHidden(['a __b', 'c ## __', 'd e'], [EmphasisType.bold]);
    });
    test('extends italic emphasis to EOF if closing token is commented out by line comment', () => {
        closingTokenHidden(['a *b', 'c ## *', 'd e'], [EmphasisType.italic]);
    });
    test('extends bold emphasis to EOF if closing token is commented out by block comment', () => {
        closingTokenHidden(['a __b', 'c ### __', '### d e'], [EmphasisType.bold]);
    });
    test('extends italic emphasis to EOF if closing token is commented out by block comment', () => {
        closingTokenHidden(['a *b', 'c ### *', '### d e'], [EmphasisType.italic]);
    });
    test('extends bold emphasis to EOF if closing token is in bracket block', () => {
        closingTokenHidden(['a __b', 'c [__]', 'd e'], [EmphasisType.bold]);
    });
    test('extends italic emphasis to EOF if closing token is in bracket block', () => {
        closingTokenHidden(['a *b', 'c [*]', 'd e'], [EmphasisType.italic]);
    });
    function closingTokenHidden(given: string[], emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = emphasis;
        results[2].emphasis = emphasis;
        results[3].emphasis = emphasis;
        testMultiLine(given, results);
    }

    test('does not apply bold if start/end tokens are commented out on a single line', () => {
        markupCommentedOutSingleLine('a ### __ ### b ### __ ###');
    });
    test('does not apply italic if start/end tokens are commented out on a single line', () => {
        markupCommentedOutSingleLine('a ### * ### b ### * ###');
    });
    function markupCommentedOutSingleLine(given: string) {
        const results: Line[] = [new Line('a b', 0)];
        results[0].emphasis = [];
        testSingleLine(given, results);
    }

    test('escaping bold markup token does not start an emphasis block', () => {
        escapeStartingToken('a \\__ b', 'a __ b');
    });
    test('escaping italic markup token does not start an emphasis block', () => {
        escapeStartingToken('a \\* b', 'a * b');
    });
    test('escaping bold markup token does not start an emphasis block if no leading whitespace', () => {
        escapeStartingToken('a\\__b', 'a__b');
    });
    test('escaping italic markup token does not start an emphasis block if no leading whitespace', () => {
        escapeStartingToken('a\\*b', 'a*b');
    });
    function escapeStartingToken(given: string, expected: string) {
        const results: Line[] = [new Line(expected, 0)];
        results[0].emphasis = [];
        testSingleLine(given, results);
    }

    test('extends bold emphasis to EOF if closing token is escaped', () => {
        escapeClosingToken(['a __b', 'c \\__', 'd e'], '__', [EmphasisType.bold]);
    });
    test('extends italic emphasis to EOF if closing token is escaped', () => {
        escapeClosingToken(['a *b', 'c \\*', 'd e'], '*', [EmphasisType.italic]);
    });
    function escapeClosingToken(given: string[], token: string, emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line(`c ${token}`, 1),
            new Line('d e', 2),
        ];
        results[0].emphasis = [];
        results[1].emphasis = emphasis;
        results[2].emphasis = emphasis;
        results[3].emphasis = emphasis;
        testMultiLine(given, results);
    }
});