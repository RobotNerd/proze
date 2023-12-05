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
            file: '',
            format: Format.text,
            path: '',
        };
    });

    test('parses document', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/default.proze';
        let expected = 'test-data/text-formatter/single-file/default.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('creates parse error if invalid name found', () => {
        mockArgs.path = 'test-data/text-formatter/multiple-files/invalid-names/';
        const compiler = new Compiler(mockArgs);
        try {
            let output = compiler.compile();
            expect('').toBe('expected CompileError to be thrown');
        }
        catch(e: unknown) {
            if (e instanceof CompileError) {
                expect(e).toBeInstanceOf(CompileError);
                expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
                expect(CompilerMessages.getInstance().errors.length).toBe(6);
            }
            else {
                throw e;
            }
        }
    });

    // Config file

    test('parses all files in a directory if there is no config', () => {
        mockArgs.path = 'test-data/text-formatter/multiple-files/no-config/';
        let expected = 'test-data/text-formatter/multiple-files/no-config/no-config.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('compiles files in a directory by the order provided in the config', () => {
        mockArgs.path = 'test-data/text-formatter/multiple-files/with-config-json/';
        let expected = 'test-data/text-formatter/multiple-files/with-config-json/with-config-json.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('compiles files with a "yaml" config file', () => {
        mockArgs.path = 'test-data/text-formatter/multiple-files/config-file-yaml/';
        let expected = 'test-data/text-formatter/multiple-files/config-file-yaml/config-file-yaml.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('compiles files with a "yml" config file', () => {
        mockArgs.path = 'test-data/text-formatter/multiple-files/config-file-yml/';
        let expected = 'test-data/text-formatter/multiple-files/config-file-yml/config-file-yml.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('throws error if multiple config files exist in a directory', () => {
        mockArgs.path = 'test-data/text-formatter/multiple-files/multiple-config-files/';
        try {
            const compiler = new Compiler(mockArgs);
            let output = compiler.compile();
            expect('').toBe('expected CompileError to be thrown');
        }
        catch(e) {
            expect((e as Error).message).toContain('Multiple config files found');
        }
    });

    // Metadata

    test('allows no metadata fields to be provided', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/no-metadata.proze';
        let expected = 'test-data/text-formatter/single-file/no-metadata.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('allows title to be the only metadata', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/titles/title-only.proze';
        let expected = 'test-data/text-formatter/single-file/titles/title-only.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('throws compile error on invalid title', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/titles/invalid-title.proze';
        const compiler = new Compiler(mockArgs);
        try {
            let output = compiler.compile();
            expect('').toBe('expected CompileError to be thrown');
        }
        catch(e: unknown) {
            if (e instanceof CompileError) {
                expect(e).toBeInstanceOf(CompileError);
                expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
                expect(CompilerMessages.getInstance().errors.length).toBe(1);
            }
            else {
                throw e;
            }
        }
    });

    test('allows author to be the only metadata', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/author/author-only.proze';
        let expected = 'test-data/text-formatter/single-file/author/author-only.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('does not parse line as metadata when it is part of a paragraph', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/metadata-in-paragraph.proze';
        let expected = 'test-data/text-formatter/single-file/metadata-in-paragraph.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    // Paragraphs

    test('supports multi-line paragraphs', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/multi-line-paragraphs.proze';
        let expected = 'test-data/text-formatter/single-file/multi-line-paragraphs.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });


    // Chapters

    test('parses document that does not contain chapters', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/chapters/no-chapters.proze';
        let expected = 'test-data/text-formatter/single-file/chapters/no-chapters.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('parses document where only some chapters are named', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/chapters/partial-chapter-names.proze';
        let expected = 'test-data/text-formatter/single-file/chapters/partial-chapter-names.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
        expect(CompilerMessages.getInstance().hasWarnings()).toBe(true);
        expect(CompilerMessages.getInstance().warnings.length).toBe(1);
    });

    // Sections

    test('parses document with sections but no chapters', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/sections/no-chapters.proze';
        let expected = 'test-data/text-formatter/single-file/sections/no-chapters.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('parses named sections', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/sections/with-names.proze';
        let expected = 'test-data/text-formatter/single-file/sections/with-names.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('parses named sections', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/sections/symbol-only.proze';
        let expected = 'test-data/text-formatter/single-file/sections/symbol-only.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    // Comments

    test('ignores line comments', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/comments/line-comment.proze';
        let expected = 'test-data/text-formatter/single-file/comments/line-comment.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('ignores block comments', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/comments/block-comment.proze';
        let expected = 'test-data/text-formatter/single-file/comments/block-comment.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    // Brackets

    test('ignores text in square brackets', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/brackets/brackets.proze';
        let expected = 'test-data/text-formatter/single-file/brackets/brackets.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    test('extends a bracket block to EOF if no closing bracket is found', () => {
        mockArgs.path = 'test-data/text-formatter/single-file/brackets/no-closing-bracket.proze';
        let expected = 'test-data/text-formatter/single-file/brackets/no-closing-bracket.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

});
