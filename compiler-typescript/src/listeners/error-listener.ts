import { ANTLRErrorListener } from "antlr4ts";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { Recognizer } from "antlr4ts/Recognizer";


export interface ParseError {
    line: number;
    charPositionInLine: number;
    msg: string;
}


export class ParseErrorListener implements ANTLRErrorListener<any> {

    private errorList: ParseError[];

    constructor() {
        this.errorList = [];
    }

    private add(line: number, charPositionInLine: number, msg: string) {
        this.errorList.push({
            line,
            charPositionInLine,
            msg
        });
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
