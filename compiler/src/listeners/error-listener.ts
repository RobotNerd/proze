import { ANTLRErrorListener } from "antlr4ts";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { Recognizer } from "antlr4ts/Recognizer";


export class ParseError {
    line: number = -1;
    charPositionInLine: number = -1;
    msg: string = '';

    constructor(line: number, charPositionInLine: number, msg: string) {
        this.line = line;
        this.charPositionInLine = charPositionInLine;
        this.msg = msg;
    }

    toString(): string {
        return `${this.line}:${this.charPositionInLine} ${this.msg}`;
    }
}


export class ParseErrorListener implements ANTLRErrorListener<any> {

    private errorList: ParseError[];

    constructor() {
        this.errorList = [];
    }

    private add(line: number, charPositionInLine: number, msg: string) {
        this.errorList.push(new ParseError(line, charPositionInLine, msg));
    }

    errors(): ParseError[] {
        return this.errorList;
    }

    syntaxError<T>(
        _recognizer: Recognizer<T, any>,
        _offendingSymbol: T,
        line: number,
        charPositionInLine: number,
        msg: string,
        _e: RecognitionException | undefined
    ) {
        this.add(line, charPositionInLine, msg);
    };
}
