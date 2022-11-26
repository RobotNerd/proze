import { CompilerMessages } from "../util/compiler-messages";
import { ConfigInterface } from "../util/config";
import { ParseError } from "../util/parse-error";
import { Line, LineType } from "./line";

export class Names {

    static delimiters: RegExp = /[.\s\?!,"]/;

    static checkForInvalid(line: Line, config: ConfigInterface | null) {
        if (line.lineType != LineType.metadata && line.lineType != LineType.paragraph) {
            return;
        }
        if (!config?.names?.invalid) {
            return
        }
        const words = line.text.split(Names.delimiters);
        for (let name of config.names.invalid) {
            if (words.includes(name)) {
                CompilerMessages.getInstance().add(
                    new ParseError(
                        `Invalid character name found: "${name}"`,
                        line.lineNumber
                    )
                );
            }
        }
    }
}