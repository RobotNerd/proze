export class ShowHelpError extends Error {}

export enum Format {
    text = "text",
}

export interface ProzeArgs {
    format: Format;
    inputString: string|null;
}

let help_msg = `Usage: proze compiler

    proze [--format FORMAT] [--input-string STRING]
    
    Optional arguments:
        --format: Target format for the generated output file (default: text)
        --input-string: A proze-formatted string to compile (mainly used for testing).
`;


export class ArgParser {

    static parse_args(): ProzeArgs {
        let cliArgs = process.argv.slice(2);
        let args: ProzeArgs = {
            format: Format.text,
            inputString: null,
        };
        args.format = this.parse_format(cliArgs); 
        args.inputString = this.parse_inputString(cliArgs);
        return args;
    }

    private static parse_format(cliArgs: string[]): Format {
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

    private static parse_inputString(cliArgs: string[]): string|null {
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

    static show_help() {
        console.log(help_msg);
    }
}