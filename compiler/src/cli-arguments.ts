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
        let cli_args = process.argv.slice(2);
        let args: ProzeArgs = {
            format: Format.text,
            inputString: null,
        };
        args.format = this.parse_format(cli_args); 
        args.inputString = this.parse_inputString(cli_args);
        return args;
    }

    private static parse_format(cli_args: string[]): Format {
        let format = Format.text;
        for (let i=0; i < cli_args.length; i++) {
            if (cli_args[i] == '--format') {
                if (i + 1 < cli_args.length) {
                    format = cli_args[i+1].toLowerCase() as Format;
                    break;
                }
            }
        }
        return format;
    }

    private static parse_inputString(cli_args: string[]): string|null {
        let inputString: string|null = null;
        for (let i=0; i < cli_args.length; i++) {
            if (cli_args[i] == '--input-string') {
                if (i + 1 <= cli_args.length) {
                    inputString = cli_args[i+1];
                }
            }
        }
        return inputString;
    }

    static show_help() {
        console.log(help_msg);
    }
}