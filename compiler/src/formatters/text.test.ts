import { CompileError } from '../util/compile-error';
import { Compiler } from '../compiler';
import { Metadata } from '../components/metadata';
import { ProzeArgs, Format } from '../util/cli-arguments';
import { readFileSync } from 'fs';
import { CompilerMessages } from '../util/compiler-messages';

function loadExpectedOutput(path: string): string {
    return readFileSync(path, 'utf-8');
}

describe('text formatter', () => {

    let mockArgs: ProzeArgs;

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
        Metadata.getInstance().reset();
        mockArgs = {
            format: Format.text,
            path: '',
        };
    });

    test('parses document', () => {
        mockArgs.path = 'test-data/single-file/default.proze';
        let expected = 'test-data/single-file/default.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    // Metadata

    test('allows no metadata fields to be provided', () => {
        mockArgs.path = 'test-data/single-file/no-metadata.proze';
        let expected = 'test-data/single-file/no-metadata.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('allows title to be the only metadata', () => {
        mockArgs.path = 'test-data/single-file/titles/title-only.proze';
        let expected = 'test-data/single-file/titles/title-only.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('throws compile error on invalid title', () => {
        mockArgs.path = 'test-data/single-file/titles/invalid-title.proze';
        const compiler = new Compiler(mockArgs);
        try {
            let output = compiler.compile();
            throw new Error('expected CompileError to be thrown');
        }
        catch(e: unknown) {
            expect(e).toBeInstanceOf(CompileError);
            expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
            expect(CompilerMessages.getInstance().errors.length).toBe(1);
        }
    });

    test('allows author to be the only metadata', () => {
        mockArgs.path = 'test-data/single-file/author/author-only.proze';
        let expected = 'test-data/single-file/author/author-only.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('does not parse line as metadata when it is part of a paragraph', () => {
        mockArgs.path = 'test-data/single-file/metadata-in-paragraph.proze';
        let expected = 'test-data/single-file/metadata-in-paragraph.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    // Paragraphs

    test('supports multi-line paragraphs', () => {
        mockArgs.path = 'test-data/single-file/multi-line-paragraphs.proze';
        let expected = 'test-data/single-file/multi-line-paragraphs.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });


    // Chapters

    test('parses document that does not contain chapters', () => {
        mockArgs.path = 'test-data/single-file/chapters/no-chapters.proze';
        let expected = 'test-data/single-file/chapters/no-chapters.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('parses document where only some chapters are named', () => {
        mockArgs.path = 'test-data/single-file/chapters/partial-chapter-names.proze';
        let expected = 'test-data/single-file/chapters/partial-chapter-names.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
        expect(CompilerMessages.getInstance().hasWarnings()).toBe(true);
        expect(CompilerMessages.getInstance().warnings.length).toBe(1);
    });

    // Sections

    test('parses document with sections but no chapters', () => {
        mockArgs.path = 'test-data/single-file/sections/no-chapters.proze';
        let expected = 'test-data/single-file/sections/no-chapters.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('parses named sections', () => {
        mockArgs.path = 'test-data/single-file/sections/with-names.proze';
        let expected = 'test-data/single-file/sections/with-names.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('parses named sections', () => {
        mockArgs.path = 'test-data/single-file/sections/symbol-only.proze';
        let expected = 'test-data/single-file/sections/symbol-only.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    // Comments

    test('ignores line comments', () => {
        mockArgs.path = 'test-data/single-file/comments/line-comment.proze';
        let expected = 'test-data/single-file/comments/line-comment.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

});
