export class ShowHelpError extends Error {}

export enum Format {
    pdf = "pdf",
    text = "text",
}

export interface ProzeArgs {
    file: string;
    format: Format;
    path: string;
}

let helpMessage = `Usage: proze compiler

    proze [--format FORMAT] [--path PATH] [--file NAME]

    If the --file argument is not provided, the resulting content will be written to stdout.
    
    Optional arguments:
        -h, --help: Show this help message.
        --format: Target format for the generated output file (default: text)
        --file: Name of the output file (without the extension).
        --path: Path to a proze file or a project directory. Defaults to current directory.

    Available output formats (for use with the --format argument)
        - [${Object.keys(Format)}]
`;

export class ArgParser {

    args: ProzeArgs;

    constructor() {
        this.args = {
            file: '',
            format: Format.text,
            path: '.',
        };
    }

    parseArgs(cliArgs: string[]): ProzeArgs {
        for (let i=0; i < cliArgs.length; i++) {
            this.parseHelpFlag(cliArgs[i]);
            this.parseFormat(cliArgs, i);
            this.parseOutputPath(cliArgs, i);
            this.parsePath(cliArgs, i);
        }
        return this.args;
    }

    private parseHelpFlag(flag: string) {
        if (flag == '-h' || flag == '--help') {
            throw new ShowHelpError();
        }
    }

    private parseFormat(cliArgs: string[], i: number) {
        if (cliArgs[i] == '--format') {
            if (i + 1 < cliArgs.length) {
                this.args.format = cliArgs[i+1].toLowerCase() as Format;
            }
        }
    }

    private parseOutputPath(cliArgs: string[], i: number) {
        if (cliArgs[i] == '--file') {
            if (i + 1 < cliArgs.length) {
                this.args.file = cliArgs[i+1];
            }
        }
    }

    private parsePath(cliArgs: string[], i: number) {
        if (cliArgs[i] == '--path') {
            if (i + 1 <= cliArgs.length) {
                this.args.path = cliArgs[i+1];
            }
        }
    }

    static showHelp() {
        console.log(helpMessage);
    }
}
