import { CompilerMessages } from "../util/compiler-messages";
import { Config, ConfigInterface } from "../util/config";
import { ParseError } from "../util/parse-error";
import { Line, LineType } from "../parse/line";
import { Trie } from '../util/trie';

const terminators = ['.', ' ', '?', '!', ',', '"', "'", '\n', '\t'];

export class Names {

    private trie: Trie | null = null;

    constructor(config?: ConfigInterface) {
        if (!config) {
            config = Config.get();
        }
        if (config.names?.invalid) {
            this.trie = new Trie(terminators);
            this.addInvalid(this.trie, config);
        }
    }

    private addInvalid(trie: Trie, config: ConfigInterface) {
        if (config.names?.invalid) {
            for (let name of config.names.invalid) {
                let splitNames = name.split(',').map(word => word.trim());
                for (let splitName of splitNames) {
                    trie.insert(splitName);
                }
            }
        }
    }

    findInvalid(line: Line) {
        if (!this.trie) {
            return;
        }

        if (line.lineType != LineType.metadata && line.lineType != LineType.paragraph) {
            return;
        }

        let matches: string[] = this.trie.searchInText(line.text);
        for (let name of matches) {
            CompilerMessages.getInstance().add(
                new ParseError(
                    `Invalid name found: "${name}"`,
                    line.lineNumber,
                    line.filePath
                )
            );
        }
    }
}
