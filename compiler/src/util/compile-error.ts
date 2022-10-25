import { ParseError } from "./parse-error";

export class CompileError extends Error {

    constructor(
        public message: string,
        public errors: ParseError[]
    ) {
        super(message);
        let lineErrors: string[] = [];
        for (let err of errors) {
            lineErrors.push(`    ${err.lineNumber}: ${err.message}`);
        }
        this.message += `\n${lineErrors.join('\n')}`;
    }
}
