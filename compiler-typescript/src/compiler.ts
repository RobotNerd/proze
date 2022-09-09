import {ProzeLexer} from '../generated/ProzeLexer';
import {ProzeParser} from '../generated/ProzeParser';

import {CharStreams, CommonTokenStream} from 'antlr4ts';
import {ParseTreeWalker} from 'antlr4ts/tree/ParseTreeWalker'

import {ListenerOutput} from '../src/listeners/interface';
import {TextListener} from './listeners/text';


export class Compiler {

    listener: ListenerOutput;
    tree: any;

    constructor(args: any, input_string: string) {
        this.listener = this.create_listener(args);
        this.tree = this.create_parse_tree(input_string);
    }

    compile() {
        let walker = new ParseTreeWalker();
        walker.walk(this.listener, this.tree);
        return this.listener.get_output();
    }

    private create_listener(args: any): ListenerOutput {
        if (args.format == 'text') {
            return new TextListener();
        }
        throw Error('No compiler for format ' + args.format);
    }

    private create_parse_tree(input_string: string) {
        let chars = CharStreams.fromString(input_string);
        let lexer = new ProzeLexer(chars);
        let tokens = new CommonTokenStream(lexer);
        let parser = new ProzeParser(tokens);
        parser.buildParseTree = true;
        return parser.document();
    }
}
