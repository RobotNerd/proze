export class ParseError extends Error {

    constructor(
        public message: string,
        public lineNumber: number
    ) {
        super(message);
    }
}
