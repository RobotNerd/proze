import { CompilerMessages } from "../util/compiler-messages";
import { ConfigInterface } from "../util/config";
import { ParseError } from "../util/parse-error";
import { Line, LineType } from "../components/line";
import { Trie } from '../util/trie';

const terminators = ['.', ' ', '?', '!', ',', '"', "'", '\n', '\t'];

export class Names {

    private static addInvalid(trie: Trie, config: ConfigInterface) {
        if (config.names?.invalid) {
            for (let name of config.names.invalid) {
                let splitNames = name.split(',').map(word => word.trim());
                for (let splitName of splitNames) {
                    trie.insert(splitName);
                }
            }
        }
    }

    static findInvalid(line: Line, config: ConfigInterface | null) {
        if (line.lineType != LineType.metadata && line.lineType != LineType.paragraph) {
            return;
        }
        if (!config?.names?.invalid) {
            return
        }

        let trie = new Trie(terminators);
        this.addInvalid(trie, config);
        let matches: string[] = trie.searchInText(line.text);
        for (let name of matches) {
            CompilerMessages.getInstance().add(
                new ParseError(
                    `Invalid name found: "${name}"`,
                    line.lineNumber
                )
            );
        }
    }
}
