import { CompileError, Compiler } from '../compiler';
import { ProzeArgs, Format } from '../cli-arguments';


describe('text listener', () => {

    let mock_args: ProzeArgs;

    beforeEach(() => {
        mock_args = {
            format: Format.text,
            input_string: null,
        };
    });

    test('parses title', () => {
        mock_args.input_string = 'Title: My Book\n';
        const compiler = new Compiler(mock_args, mock_args.input_string);
        let output = compiler.compile();
        expect(output).toBe('My Book\n');
    });

    test('throws on parse error and provides a list of all errors', () => {
        mock_args.input_string = 'Title:\n';
        const compiler = new Compiler(mock_args, mock_args.input_string);
        // expect(() => {
        //     let output = compiler.compile();
        // }).toThrow();
        // let errors = compiler.errors();
        // expect(() => { errors.length }).toBe(1);
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
