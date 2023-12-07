import { ArgParser, ShowHelpError } from './util/cli-arguments';
import { Compiler } from './compiler';
import { exit } from 'process';
import { CompileError } from './util/compile-error';
import { CompilerMessages } from './util/compiler-messages';

try {
    const argParser = new ArgParser();
    let args = argParser.parseArgs(process.argv.slice(2));
    if (args.path === '' && args.inputString === '') {
        console.log('no proze input provided to parse; use either --path or --input-string');
        exit(0);
    }
    let compiler = new Compiler(args);
    if (CompilerMessages.getInstance().hasWarnings()) {
        console.log(CompilerMessages.getInstance().toString());
    }
    console.log(compiler.compile());
}
catch (e: unknown) {
    if (e instanceof ShowHelpError) {
        ArgParser.showHelp();
        exit(0);
    }
    else if (e instanceof CompileError) {
        console.log(e);
        console.log(CompilerMessages.getInstance().toString());
    }
    else {
        throw e;
    }
}
