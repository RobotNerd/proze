import { CompilerMessages } from "../util/compiler-messages";
import { Line } from "./line";
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

    test('does not treat a fully-commented out line mid-paragraph as an empty line', () => {
        testMultiLine(
            [
                'abc',
                '## ZZZ',
                'def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 2),
            ]
        );
    });

    test('does not treat a commented out line mid-paragraph as an empty line even with leading whitespace', () => {
        testMultiLine(
            [
                'abc',
                '   ## ZZZ',
                'def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 2),
            ]
        );
    });

    test('removes commented line at beginning of paragraph', () => {
        testMultiLine(
            [
                '## ZZZ',
                'abc',
                'def',
            ],
            [
                new Line('abc', 1),
                new Line('def', 2),
            ]
        );
    });

    test('removes commented line at beginning of paragraph with leading whitespace', () => {
        testMultiLine(
            [
                '   ## ZZZ',
                'abc',
                'def',
            ],
            [
                new Line('abc', 1),
                new Line('def', 2),
            ]
        );
    });

    test('removes commented line at end of paragraph', () => {
        testMultiLine(
            [
                'abc',
                'def',
                '## ZZZ',
            ],
            [
                new Line('abc', 0),
                new Line('def', 1),
            ]
        );
    });

    test('removes commented line at beginning of end with leading whitespace', () => {
        testMultiLine(
            [
                'abc',
                'def',
                '   ## ZZZ',
            ],
            [
                new Line('abc', 0),
                new Line('def', 1),
            ]
        );
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

    test('does not treat a fully block-commented out line mid-paragraph as an empty line', () => {
        testMultiLine(
            [
                'abc',
                '### ZZZ ###',
                'def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 2),
            ]
        );
    });

    test('does not treat a block-commented out line mid-paragraph as an empty line even with leading whitespace', () => {
        testMultiLine(
            [
                'abc',
                '   ### ZZZ ###',
                'def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 2),
            ]
        );
    });

    test('removes block-commented line at beginning of paragraph', () => {
        testMultiLine(
            [
                '### ZZZ ###',
                'abc',
                'def',
            ],
            [
                new Line('abc', 1),
                new Line('def', 2),
            ]
        );
    });

    test('removes block-commented line at beginning of paragraph with leading whitespace', () => {
        testMultiLine(
            [
                '   ### ZZZ ###',
                'abc',
                'def',
            ],
            [
                new Line('abc', 1),
                new Line('def', 2),
            ]
        );
    });

    test('removes block-commented line at end of paragraph', () => {
        testMultiLine(
            [
                'abc',
                'def',
                '### ZZZ ###',
            ],
            [
                new Line('abc', 0),
                new Line('def', 1),
            ]
        );
    });

    test('removes block-commented line at beginning of end with leading whitespace', () => {
        testMultiLine(
            [
                'abc',
                'def',
                '   ### ZZZ ###',
            ],
            [
                new Line('abc', 0),
                new Line('def', 1),
            ]
        );
    });

    // Line comment and block comment interaction

    test('line comment hides block comments', () => {
        testMultiLine(
            [
                'abc ## XXX ### ZZZ',
                'def',
            ],
            [
                new Line('abc', 0),
                new Line('def', 2),
            ]
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
