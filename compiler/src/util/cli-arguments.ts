export class ShowHelpError extends Error {}

export enum Format {
    text = "text",
}

export interface ProzeArgs {
    format: Format;
    inputString: string|null;
}

let helpMessage = `Usage: proze compiler

    proze [--format FORMAT] [--input-string STRING]
    
    Optional arguments:
        -h, --help: Show this help message.
        --format: Target format for the generated output file (default: text)
        --input-string: A proze-formatted string to compile (mainly used for testing).
`;


export class ArgParser {

    args: ProzeArgs;

    constructor() {
        this.args = {
            format: Format.text,
            inputString: null,
        };
    }

    parseArgs(cliArgs: string[]): ProzeArgs {
        for (let i=0; i < cliArgs.length; i++) {
            this.parseHelpFlag(cliArgs[i]);
            this.parseFormat(cliArgs, i);
            this.parseInputString(cliArgs, i);
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

    private parseInputString(cliArgs: string[], i: number) {
        if (cliArgs[i] == '--input-string') {
            if (i + 1 <= cliArgs.length) {
                this.args.inputString = cliArgs[i+1];
            }
        }
    }

    static showHelp() {
        console.log(helpMessage);
    }
}