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
        --format: Target format for the generated output file (default: text)
        --input-string: A proze-formatted string to compile (mainly used for testing).
`;


export class ArgParser {

    static parseArgs(cliArgs: string[]): ProzeArgs {
        this.parseHelpFlag(cliArgs);
        let args: ProzeArgs = {
            format: Format.text,
            inputString: null,
        };
        args.format = this.parseFormat(cliArgs); 
        args.inputString = this.parseInputString(cliArgs);
        return args;
    }

    private static parseHelpFlag(cliArgs: string[]) {
        for (let i=0; i < cliArgs.length; i++) {
            if (cliArgs[i] == '-h' || cliArgs[i] == '--help') {
                throw new ShowHelpError();
            }
        }
    }

    private static parseFormat(cliArgs: string[]): Format {
        let format = Format.text;
        for (let i=0; i < cliArgs.length; i++) {
            if (cliArgs[i] == '--format') {
                if (i + 1 < cliArgs.length) {
                    format = cliArgs[i+1].toLowerCase() as Format;
                    break;
                }
            }
        }
        return format;
    }

    private static parseInputString(cliArgs: string[]): string|null {
        let inputString: string|null = null;
        for (let i=0; i < cliArgs.length; i++) {
            if (cliArgs[i] == '--input-string') {
                if (i + 1 <= cliArgs.length) {
                    inputString = cliArgs[i+1];
                }
            }
        }
        return inputString;
    }

    static showHelp() {
        console.log(helpMessage);
    }
}