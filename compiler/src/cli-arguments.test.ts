import { ArgParser, Format, ProzeArgs, ShowHelpError } from './cli-arguments';


describe('CLI arg parser', () => {
    test('throws error if help message should be displayed', () => {
        const argParser = new ArgParser();
        expect(
            () => argParser.parseArgs(['-h'])
        ).toThrow(ShowHelpError);

        expect(
            () => argParser.parseArgs(['--help'])
        ).toThrow(ShowHelpError);

        expect(
            () => argParser.parseArgs(['--format', 'text', '-h'])
        ).toThrow(ShowHelpError);
    });

    test('parses format', () => {
        const argParser = new ArgParser();
        let result: ProzeArgs = {
            format: Format.text,
            inputString: 'test',
        };
        expect(argParser.parseArgs(['--format', 'text', '--input-string', 'test'])).toEqual(result);
        expect(argParser.parseArgs(['--input-string', 'test', '--format', 'text'])).toEqual(result);
    });

    test('parses input string', () => {
        const argParser = new ArgParser();
        let result: ProzeArgs = {
            format: Format.text,
            inputString: 'test',
        };
        expect(argParser.parseArgs(
            ['--format', 'text', '--input-string', 'test'])
        ).toEqual(result);

        result.inputString = 'this is another test';
        expect(argParser.parseArgs(
            ['--input-string', result.inputString, '--format', 'text'])
        ).toEqual(result);
    });
});
