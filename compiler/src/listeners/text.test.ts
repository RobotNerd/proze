import { CompileError, Compiler } from '../compiler';
import { ProzeArgs, Format } from '../util/cli-arguments';


const defaultContent =
`It was a dark and stormy night. Lightning flashed and illuminated the dust-covered furniture of the mansion. A trail of wet footprints crossed the wooden planks of the floor.

A dark figure stood by the fireplace, wet and shivering from the rain. A pool or orange light from the fire pressed against the darkness. The small fire provided little heat, but it was better than nothing.`;

const data = {
    default: {
        given: `Title: My Book\nAuthor: Jane Doe\n\n\n${defaultContent}\n`,
        expected: `My Book\nby Jane Doe\n\n${defaultContent}\n`,
    },
};


describe('text listener', () => {

    let mockArgs: ProzeArgs;

    beforeEach(() => {
        mockArgs = {
            format: Format.text,
            inputString: null,
        };
    });

    test('parses document', () => {
        const compiler = new Compiler(mockArgs, data.default.given);
        expect(compiler.compile()).toBe(data.default.expected);
    });

    test('allows no metadata fields to be provided', () => {
        mockArgs.inputString = `${defaultContent}\n`;
        const compiler = new Compiler(mockArgs, mockArgs.inputString);
        let output = compiler.compile();
        expect(output).toBe(`${defaultContent}\n`);
    });

    test('allows title to be the only metadata', () => {
        mockArgs.inputString = `Title: My Book\n\n${defaultContent}\n`;
        const compiler = new Compiler(mockArgs, mockArgs.inputString);
        let output = compiler.compile();
        expect(output).toBe(`My Book\n\n${defaultContent}\n`);
    });

    test('throws on parse error on invalid title', () => {
        mockArgs.inputString = `Title:\n\n${defaultContent}\n`;
        const compiler = new Compiler(mockArgs, mockArgs.inputString);
        try {
            let output = compiler.compile();
            fail('expected CompileError to be thrown');
        }
        catch(e: unknown) {
            expect(e).toBeInstanceOf(CompileError);
            expect((e as CompileError).errors.length).toBe(1);
        }
    });

    test('allows author to be the only metadata', () => {
        mockArgs.inputString = `Author: Jane Doe\n\n${defaultContent}\n`;
        const compiler = new Compiler(mockArgs, mockArgs.inputString);
        let output = compiler.compile();
        expect(output).toBe(`by Jane Doe\n\n${defaultContent}\n`);
    });

});
