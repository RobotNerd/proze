export class ShowHelpError extends Error {}

export enum Format {
    text = "text",
}

export interface ProzeArgs {
    format: Format;
    path: string|null;
}

let helpMessage = `Usage: proze compiler

    proze [--format FORMAT] [--input-string STRING]
    
    Optional arguments:
        -h, --help: Show this help message.
        --format: Target format for the generated output file (default: text)
        --path: Path to a proze file or a project directory.
`;


export class ArgParser {

    args: ProzeArgs;

    constructor() {
        this.args = {
            format: Format.text,
            path: null,
        };
    }

    parseArgs(cliArgs: string[]): ProzeArgs {
        for (let i=0; i < cliArgs.length; i++) {
            this.parseHelpFlag(cliArgs[i]);
            this.parseFormat(cliArgs, i);
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