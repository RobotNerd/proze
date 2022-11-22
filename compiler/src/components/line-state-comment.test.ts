import { CompilerMessages } from "../util/compiler-messages";
import { Line } from "./line";
import { LineState } from "./line-state";
import { testSingleLine, testMultiLine } from './line-state-test-helper';

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

    test('returns nothing if entire line is commented out', () => {
        testSingleLine('## XXX', []);
    });

    test('returns nothing if entire line is leading whitespace followed by a comment', () => {
        testSingleLine('     ## XXX', []);
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
        testMultiLine(
            [
                'abc ### XXX',
                'ZZZ',
                'XXX ### def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 2),
            ]
        );
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
});
