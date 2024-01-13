import { ParseError, ParseWarning } from "./parse-error";

export class CompilerMessages {

    public errors: ParseError[] = [];
    public warnings: ParseWarning[] = [];

    private static instance: CompilerMessages;

    private constructor() {}

    add(message: ParseError | ParseWarning) {
        if (message instanceof ParseError) {
            this.errors.push(message);
        }
        else {
            this.warnings.push(message);
        }
    }

    private errorsToString(): string {
        let instance = CompilerMessages.getInstance();
        let errors: string[] = [];
        if (instance.hasErrors()) {
            errors.push(`ERRORS:`);
        }
        for (let error of instance.errors) {
            errors.push(`    ${error.filePath}:${error.lineNumber}: ${error.message}`);
        }
        return errors.join('\n');
    }

    static getInstance(): CompilerMessages {
        if (!CompilerMessages.instance) {
            CompilerMessages.instance = new CompilerMessages();
        }
        return CompilerMessages.instance;
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    hasWarnings(): boolean {
        return this.warnings.length > 0;
    }

    reset() {
        this.errors = [];
        this.warnings = [];
    }

    toString(): string {
        return `${this.errorsToString()}\n${this.warningsToString()}`;
    }

    private warningsToString(): string {
        let instance = CompilerMessages.getInstance();
        let warnings: string[] = [];
        if (instance.hasWarnings()) {
            warnings.push(`WARNINGS:`);
        }
        for (let warning of instance.warnings) {
            warnings.push(`    ${warning.filePath}:${warning.lineNumber}: ${warning.message}`);
        }
        return warnings.join('\n');
    }
}