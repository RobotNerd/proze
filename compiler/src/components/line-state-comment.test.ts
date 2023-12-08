import { ProzeArgs } from '../util/cli-arguments';
import { TestUtils } from "../util/test-utils";

describe('LineState', () => {

    let mockArgs: ProzeArgs;

    beforeEach(() => {
        mockArgs = TestUtils.resetCompiler();
        mockArgs.path = '';
    });

    // Line comment

    test('strips line comments from the end of a line', () => {
        mockArgs.inputString = 'abc ## XXX';
        TestUtils.runTest(mockArgs, 'abc\n');
    });

    test('returns nothing if entire line is commented out', () => {
        mockArgs.inputString = '## XXX';
        TestUtils.runTest(mockArgs, '');
    });

    test('does not treat a fully-commented out line mid-paragraph as an empty line', () => {
        mockArgs.inputString = [
            'abc',
            '## ZZZ',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('does not treat a commented out line mid-paragraph as an empty line even with leading whitespace', () => {
        mockArgs.inputString = [
            'abc',
            '   ## ZZZ',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes commented line at beginning of paragraph', () => {
        mockArgs.inputString = [
            '## ZZZ',
            'abc',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes commented line at beginning of paragraph with leading whitespace', () => {
        mockArgs.inputString = [
            '   ## ZZZ',
            'abc',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes commented line at end of paragraph', () => {
        mockArgs.inputString = [
            'abc',
            'def',
            '## ZZZ',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes commented line at beginning of end with leading whitespace', () => {
        mockArgs.inputString = [
            'abc',
            'def',
            '   ## ZZZ',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('returns nothing if entire line is leading whitespace followed by a comment', () => {
        mockArgs.inputString = '     ## XXX';
        TestUtils.runTest(mockArgs, '');
    });

    // Comment block

    test('strips a comment block from middle of a line', () => {
        mockArgs.inputString = 'abc ### XXX ### def';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('strips a comment block from the beginning of a line', () => {
        mockArgs.inputString = '### XXX ### abc';
        TestUtils.runTest(mockArgs, 'abc\n');
    });

    test('requires whitespace before block comment if not at beginning of the line', () => {
        mockArgs.inputString = 'abc def### ghi';
        TestUtils.runTest(mockArgs, 'abc def### ghi\n');
    });

    test('strips a comment block from the end of a line', () => {
        mockArgs.inputString = 'abc   ### XXX ###  ';
        TestUtils.runTest(mockArgs, 'abc\n');
    });

    test('strips multiple comment blocks from a line', () => {
        mockArgs.inputString = 'a ### XXX ### b ### XXX ### c';
        TestUtils.runTest(mockArgs, 'a b c\n');
    });

    test('parsed block comments over multiple lines', () => {
        mockArgs.inputString = [
            'abc ### XXX',
            'ZZZ',
            'XXX ### def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('does not treat a fully block-commented out line mid-paragraph as an empty line', () => {
        mockArgs.inputString = [
            'abc',
            '### ZZZ ###',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('does not treat a block-commented out line mid-paragraph as an empty line even with leading whitespace', () => {
        mockArgs.inputString = [
            'abc',
            '   ### ZZZ ###',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes block-commented line at beginning of paragraph', () => {
        mockArgs.inputString = [
            '### ZZZ ###',
            'abc',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes block-commented line at beginning of paragraph with leading whitespace', () => {
        mockArgs.inputString = [
            '   ### ZZZ ###',
            'abc',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes block-commented line at end of paragraph', () => {
        mockArgs.inputString = [
            'abc',
            'def',
            '### ZZZ ###',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('removes block-commented line at beginning of end with leading whitespace', () => {
        mockArgs.inputString = [
            'abc',
            'def',
            '   ### ZZZ ###',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });
    

    // Line comment and block comment interaction

    test('line comment hides block comments', () => {
        mockArgs.inputString = [
            'abc ## XXX ### ZZZ',
            'def',
        ].join('\n');
        TestUtils.runTest(mockArgs, 'abc def\n');
    });

    test('block comment hides line comment', () => {
        mockArgs.inputString = 'abc ### XXX ## XXX';
        TestUtils.runTest(mockArgs, 'abc\n');
    });

    // Escaped comments

    test('ignores an escaped block comment', () => {
        mockArgs.inputString = 'abc \\### def';
        TestUtils.runTest(mockArgs, 'abc ### def\n');
    });
    
    test('ignores an escaped block inside another block comment', () => {
        mockArgs.inputString = 'abc ### XXX \\### ### def';
        TestUtils.runTest(mockArgs, 'abc def\n');
    });
    
    test('ignores an escaped line comment', () => {
        mockArgs.inputString = 'abc \\## def';
        TestUtils.runTest(mockArgs, 'abc ## def\n');
    });
    
    test('ignores an escaped line comment hidden by another line comment', () => {
        mockArgs.inputString = 'abc ## XXX \\## XXX';
        TestUtils.runTest(mockArgs, 'abc\n');
    });
    
    test('ignores an escaped block hidden by a line comment', () => {
        mockArgs.inputString = 'abc ## XXX ### XXX ### XXX \\### XXX';
        TestUtils.runTest(mockArgs, 'abc\n');
    });
});
