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
            file: '',
            format: Format.text,
            path: 'test',
        };
        expect(argParser.parseArgs(['--format', 'text', '--path', 'test'])).toEqual(result);
        expect(argParser.parseArgs(['--path', 'test', '--format', 'text'])).toEqual(result);
    });

    test('parses input string', () => {
        const argParser = new ArgParser();
        let result: ProzeArgs = {
            file: '',
            format: Format.text,
            path: 'test',
        };
        expect(argParser.parseArgs(
            ['--format', 'text', '--path', 'test'])
        ).toEqual(result);

        result.path = 'this is another test';
        expect(argParser.parseArgs(
            ['--path', result.path, '--format', 'text'])
        ).toEqual(result);
    });
});
