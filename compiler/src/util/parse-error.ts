export class ParseError {

    constructor(
        public message: string,
        public lineNumber: number
    ) {}
}

export class ParseWarning {

    constructor(
        public message: string,
        public lineNumber: number
    ) {}
}
