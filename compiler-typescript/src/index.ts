import { exit } from 'process';
import { ArgParser, ShowHelpError } from './cli-arguments';
import { Compiler, CompileError } from './compiler';


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
    if (e instanceof CompileError) {
        console.log(e.message);
        for (let err of e.errors) {
            console.log(`${err.line}:${err.charPositionInLine} ${err.msg}`);
        }
    }
    else if (e instanceof ShowHelpError) {
        exit(0);
    }
    else {
        throw e;
    }
}

