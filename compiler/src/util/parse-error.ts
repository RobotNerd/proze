export class ParseError {

    constructor(
        public message: string,
        public lineNumber: number,
        public filePath: string,
    ) {}
}

export class ParseWarning {

    constructor(
        public message: string,
        public lineNumber: number,
        public filePath: string,
    ) {}
}
