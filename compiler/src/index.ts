import { exit } from 'process';
import { ArgParser, ShowHelpError } from './util/cli-arguments';
import { Compiler } from './compiler';


try {
    const argParser = new ArgParser();
    let args = argParser.parseArgs(process.argv.slice(2));
    if (args.path == null) {
        console.log('no proze input_string provided to parse');
        exit(0);
    }
    let compiler = new Compiler(args);
    console.log(compiler.compile());
}
catch (e: unknown) {
    if (e instanceof ShowHelpError) {
        ArgParser.showHelp();
        exit(0);
    }
    else {
        throw e;
    }
}

