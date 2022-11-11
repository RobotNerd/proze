import { stringify } from "querystring";
import { CompilerMessages } from "../util/compiler-messages";
import { EmphasisType, Line } from "./line";
import { testMultiLine, testSingleLine } from './line-state-test-helper';

describe('LineState', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

    test('parses block that takes up the entire line', () => {
        entireLine('__abcd__', [EmphasisType.bold]);
        entireLine('*abcd*', [EmphasisType.italic]);
    });
    function entireLine(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [new Line('abcd', 0)];
        results[0].emphasis =emphasis;
        testSingleLine(given, results);
    }

    test('parses block that takes up the entire line with leading whitespace', () => {
        entireLineLeadingWhitespace('    __abcd__', [EmphasisType.bold]);
        entireLineLeadingWhitespace('    *abcd*', [EmphasisType.italic]);
    });
    function entireLineLeadingWhitespace(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [new Line('abcd', 0)];
        results[0].emphasis = emphasis;
        testSingleLine(given, results);
    }

    test('does not require whitespace before markup token', () => {
        noLeadingWhitespaceRequired('a__b__cd', [EmphasisType.bold]);
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

    test('parses block at the beginning of a line', () => {
        beginningOfLine('__a__ b', [EmphasisType.bold]);
        beginningOfLine('*a* b', [EmphasisType.italic]);
    });
    function beginningOfLine(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
        ];
        results[0].emphasis = emphasis;
        results[1].emphasis = [];
        testSingleLine(given, results);
    }

    test('parses block in the middle of a line', () => {
        middleOfLine('a __b__ c', [EmphasisType.bold]);
        middleOfLine('a *b* c', [EmphasisType.italic]);
    });
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

    test('parses block at the end of a line', () => {
        endOfLine('a __b__', [EmphasisType.bold]);
        endOfLine('a *b*', [EmphasisType.italic]);
    });
    function endOfLine(given: string, emphasis: EmphasisType[]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 1),
        ];
        results[0].emphasis = [];
        results[1].emphasis = emphasis;
        testSingleLine(given, results);
    }

    test('parses block that covers multiple lines', () => {
        multipleLines(['a __b', 'c', 'd__ e'], [EmphasisType.bold]);
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

    test('extends emphasis to EOF if closing token not found', () => {
        noClosingToken(['a __b', 'c', 'd e'], [EmphasisType.bold]);
        noClosingToken(['a *b', 'c', 'd e'], [EmphasisType.italic]);
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

    test('extends emphasis to EOF if closing token is hidden', () => {
        closingTokenHidden(['a __b', 'c ## __', 'd e'], [EmphasisType.bold]);
        closingTokenHidden(['a *b', 'c ## *', 'd e'], [EmphasisType.italic]);
        closingTokenHidden(['a __b', 'c ### __', '### d e'], [EmphasisType.bold]);
        closingTokenHidden(['a *b', 'c ### *', '### d e'], [EmphasisType.italic]);
        closingTokenHidden(['a __b', 'c [__]', 'd e'], [EmphasisType.bold]);
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

    test('does not apply markup if start/end tokens are commented out on a single line', () => {
        markupCommentedOutSingleLine('a ### __ ### b ### __ ###');
        markupCommentedOutSingleLine('a ### * ### b ### * ###');
    });
    function markupCommentedOutSingleLine(given: string) {
        const results: Line[] = [new Line('a b', 0)];
        results[0].emphasis = [];
        testSingleLine(given, results);
    }

    test('escaping markup token does not start an emphasis block', () => {
        escapeStartingToken('a \\__ b', 'a __ b');
        escapeStartingToken('a \\* b', 'a * b');
        escapeStartingToken('a\\__b', 'a__b');
        escapeStartingToken('a\\*b', 'a*b');
    });
    function escapeStartingToken(given: string, expected: string) {
        const results: Line[] = [new Line(expected, 0)];
        results[0].emphasis = [];
        testSingleLine(given, results);
    }

    test('extends emphasis to EOF if closing token is escaped', () => {
        escapeClosingToken(['a __b', 'c \\__', 'd e'], '__', [EmphasisType.bold]);
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

    // Nesting emphasis markup

    test('handles a token block fully nested in another', ()=> {
        nested(
            'a__b*c*d__e',
            [
                [],
                [EmphasisType.bold],
                [EmphasisType.bold, EmphasisType.italic],
                [EmphasisType.bold],
                []
            ]
        );
        nested(
            'a__b*c__d*e',
            [
                [],
                [EmphasisType.bold],
                [EmphasisType.bold, EmphasisType.italic],
                [EmphasisType.italic],
                []
            ]
        );
    });
    function nested(given: string, emphasis: EmphasisType[][]) {
        const results: Line[] = [
            new Line('a', 0),
            new Line('b', 0),
            new Line('c', 0),
            new Line('d', 0),
            new Line('e', 0),
        ];
        for (let i=0; i < results.length; i++) {
            results[i].emphasis = emphasis[i];
        }
        testSingleLine(given, results);
    }
});