import { Compiler } from '../compiler';
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
});
