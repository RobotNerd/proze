import { CompilerMessages } from "./compiler-messages";

export class CompileError extends Error {

    constructor(
        public message: string
    ) {
        super(message);
    }
}
