import { exit } from 'process';
import { ArgParser, ShowHelpError } from './src/cli-arguments';
import { Compiler } from './src/compiler';


try {
    let args = ArgParser.parse_args();
    if (args.input_string == null) {
        console.log('no proze input_string provided to parse');
        exit(0);
    }
    let compiler = new Compiler(args, args.input_string);
    console.log(compiler.compile());
}
catch (e: unknown) {
    if (e instanceof ShowHelpError) {
        exit(0);
    }
    throw e;
}

