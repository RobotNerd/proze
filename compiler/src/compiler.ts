import { ProzeLexer } from '../generated/ProzeLexer';
import { ProzeParser } from '../generated/ProzeParser';

import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'

import { ListenerOutput } from '../src/listeners/interface';
import { Metadata } from './metadata';
import { ParseErrorListener, ParseError } from './listeners/error-listener';
import { TextListener } from './listeners/text';
import { readFileSync } from 'fs';


export class CompileError extends Error {
    errors: ParseError[];

    constructor(message: string, errors: ParseError[]) {
        super(message);
        this.message += `\n${this.errorsToString(errors)}`;

        // The array of errors is attached here to allow for programmatic access.
        this.errors = errors;
    }

    /** Automatically append errors to exception message. */
    private errorsToString(errors: ParseError[]): string {
        let result = '';
        for (let error of errors) {
            result += `${error.toString()}\n`
        }
        return result;
    }
}


export class Compiler {

    private errorListener: ParseErrorListener;
    private listener: ListenerOutput;
    private metadata: Metadata;
    private tree: any;

    constructor(args: any) {
        this.errorListener = new ParseErrorListener();
        this.metadata = new Metadata();
        this.listener = this.createListener(args);
        this.tree = this.createParseTree(args.path);
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

    private createParseTree(path: string) {
        let content = readFileSync(path, 'utf-8');
        let chars = CharStreams.fromString(content);
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
