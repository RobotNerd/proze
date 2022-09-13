import { ProzeLexer } from '../generated/ProzeLexer';
import { ProzeParser } from '../generated/ProzeParser';

import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'

import { ListenerOutput } from '../src/listeners/interface';
import { Metadata } from './metadata';
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

    private errorListener: ParseErrorListener;
    private listener: ListenerOutput;
    private metadata: Metadata;
    private tree: any;

    constructor(args: any, input_string: string) {
        this.errorListener = new ParseErrorListener();
        this.metadata = new Metadata();
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
            return new TextListener(this.metadata);
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
