import { ProzeLexer } from '../generated/ProzeLexer';
import { ProzeParser } from '../generated/ProzeParser';

import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'

import { ListenerOutput } from '../src/listeners/interface';
import { ParseErrorListener, ParseError } from './listeners/error-listener';
import { TextListener } from './listeners/text';


export class CompileError extends Error {
    errors: ParseError[];

    constructor(message: string, errors: ParseError[]) {
        super(message);
        this.errors = errors;
    }
}


export class Compiler {

    private listener: ListenerOutput;
    private tree: any;
    private errorListener: ParseErrorListener;

    constructor(args: any, input_string: string) {
        this.errorListener = new ParseErrorListener();
        this.listener = this.createListener(args);
        this.tree = this.createParseTree(input_string);
    }

    compile() {
        let walker = new ParseTreeWalker();
        walker.walk(this.listener, this.tree);
        const errors = this.errorListener.errors();
        if (errors.length > 0) {
            throw new CompileError(
                `Unable to compile due to ${errors.length} parse errors.`,
                errors
            );
        }
        return this.listener.getOutput();
    }

    private createListener(args: any): ListenerOutput {
        if (args.format == 'text') {
            return new TextListener();
        }
        throw Error('No compiler for format ' + args.format);
    }

    private createParseTree(input_string: string) {
        let chars = CharStreams.fromString(input_string);
        let lexer = new ProzeLexer(chars);
        lexer.removeErrorListeners();
        lexer.addErrorListener(this.errorListener);
        let tokens = new CommonTokenStream(lexer);
        let parser = new ProzeParser(tokens);
        parser.removeErrorListeners();
        parser.addErrorListener(this.errorListener);

        parser.buildParseTree = true;
        return parser.document();
    }
}
