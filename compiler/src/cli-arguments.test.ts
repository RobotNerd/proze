import { ArgParser, Format, ProzeArgs, ShowHelpError } from './cli-arguments';


describe('CLI arg parser', () => {
    test('throws error if help message should be displayed', () => {
        expect(
            () => ArgParser.parseArgs(['-h'])
        ).toThrow(ShowHelpError);

        expect(
            () => ArgParser.parseArgs(['--help'])
        ).toThrow(ShowHelpError);

        expect(
            () => ArgParser.parseArgs(['--format', 'text', '-h'])
        ).toThrow(ShowHelpError);
    });

    test('parses format', () => {
        let result: ProzeArgs = {
            format: Format.text,
            inputString: 'test',
        };
        expect(ArgParser.parseArgs(['--format', 'text', '--input-string', 'test'])).toEqual(result);
        expect(ArgParser.parseArgs(['--input-string', 'test', '--format', 'text'])).toEqual(result);
    });

    test('parses input string', () => {
        let result: ProzeArgs = {
            format: Format.text,
            inputString: 'test',
        };
        expect(ArgParser.parseArgs(
            ['--format', 'text', '--input-string', 'test'])
        ).toEqual(result);

        result.inputString = 'this is another test';
        expect(ArgParser.parseArgs(
            ['--input-string', result.inputString, '--format', 'text'])
        ).toEqual(result);
    });
});
