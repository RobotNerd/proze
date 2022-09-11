import { CompileError, Compiler } from '../compiler';
import { ProzeArgs, Format } from '../cli-arguments';


describe('text listener', () => {

    let mockArgs: ProzeArgs;

    beforeEach(() => {
        mockArgs = {
            format: Format.text,
            inputString: null,
        };
    });

    test('parses title', () => {
        mockArgs.inputString = 'Title: My Book\n';
        const compiler = new Compiler(mockArgs, mockArgs.inputString);
        let output = compiler.compile();
        expect(output).toBe('My Book\n');
    });

    test('throws on parse error and provides a list of all errors', () => {
        mockArgs.inputString = 'Title:\n';
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

});
