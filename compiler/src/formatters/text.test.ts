import { readFileSync } from 'fs';
import { Compiler } from '../compiler';
import { ProzeArgs, Format } from '../util/cli-arguments';


function loadExpectedOutput(path: string): string {
    return readFileSync(path, 'utf-8');
}


describe('text listener', () => {

    let mockArgs: ProzeArgs;

    beforeEach(() => {
        mockArgs = {
            format: Format.text,
            path: '',
        };
    });

    test('parses document', () => {
        mockArgs.path = 'test-data/default.proze';
        let expected = 'test-data/default.expected.txt';
        const compiler = new Compiler(mockArgs);
        expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    });

    // test('allows no metadata fields to be provided', () => {
    //     mockArgs.path = 'test-data/no-metadata.proze';
    //     let expected = 'test-data/no-metadata.expected.txt';
    //     const compiler = new Compiler(mockArgs);
    //     expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    // });

    // test('allows title to be the only metadata', () => {
    //     mockArgs.path = 'test-data/title-only.proze';
    //     let expected = 'test-data/title-only.expected.txt';
    //     const compiler = new Compiler(mockArgs);
    //     expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    // });

    // test('throws on parse error on invalid title', () => {
    //     mockArgs.path = 'test-data/invalid-title.proze';
    //     const compiler = new Compiler(mockArgs);
    //     try {
    //         let output = compiler.compile();
    //         fail('expected CompileError to be thrown');
    //     }
    //     catch(e: unknown) {
    //         expect(e).toBeInstanceOf(CompileError);
    //         expect((e as CompileError).errors.length).toBe(1);
    //     }
    // });

    // test('allows author to be the only metadata', () => {
    //     mockArgs.path = 'test-data/author-only.proze';
    //     let expected = 'test-data/author-only.expected.txt';
    //     const compiler = new Compiler(mockArgs);
    //     expect(compiler.compile()).toBe(loadExpectedOutput(expected));
    // });

});
