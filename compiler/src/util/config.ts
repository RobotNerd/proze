import { existsSync, readFileSync, statSync } from "fs";
import { ProzeFile } from './proze-file';
import YAML from 'yaml';

export enum Formatting {
    block = 'block',
    standard = 'standard',
}

export interface ConfigParagraphIndentation {
    chapter?: boolean;
    section?: boolean;
}

export interface ConfigCompilerOptionsInterface {
    formatting?: string;
    indentFirst?: ConfigParagraphIndentation;
    order?: string[];
}

export interface ConfigNames {
    characters: string[];
    invalid: string[];
    places: string[];
    things: string [];
}

export interface ConfigInterface {
    names?: ConfigNames;
    compile?: ConfigCompilerOptionsInterface;
}

const DefaultConfig: ConfigInterface = {
    names: {
        characters: [],
        invalid: [],
        places: [],
        things: [],
    },
    compile: {
        formatting: Formatting.standard,
        indentFirst: {
            chapter: false,
            section: false,
        },
    },
}

export class ConfigParser {

    private static allowedConfigExtensions: string[] = [
        'json',
        'yaml',
        'yml',
    ];

    private static buildFilePaths(config: ConfigInterface | null, basePath: string) {
        if (config?.compile?.order) {
            for (let i=0; i < config.compile.order.length; i++) {
                config.compile.order[i] = `${basePath}/${config.compile.order[i]}`;
            }
            let newFileOrder: string[] = [];
            for (let path of config.compile.order) {
                if (statSync(path).isDirectory()) {
                    newFileOrder = newFileOrder.concat(ProzeFile.loadDirectory(path));
                }
                else {
                    newFileOrder.push(path);
                }
            }
            config.compile.order = newFileOrder;
        }
    }

    private static configFilePath(path: string): string | null {
        let configPath: string | null = null;
        let foundConfigFiles: string[] = this.findConfigFiles(path);
        if (foundConfigFiles.length > 0) {
            configPath = foundConfigFiles[0];
        }
        return configPath;
    }

    private static findConfigFiles(path: string): string[] {
        let foundConfigFiles: string[] = [];
        if (statSync(path).isDirectory()) {
            for (let ext of ConfigParser.allowedConfigExtensions) {
                let tmpPath = `${path}/config.${ext}`;
                if (existsSync(tmpPath)) {
                    foundConfigFiles.push(tmpPath);
                }
            }
        }
        if (foundConfigFiles.length > 1) {
            throw new Error(
                'Multiple config files found in project directory. ' +
                'There should be only one.\n' +
                `${foundConfigFiles}`
            );
        }
        return foundConfigFiles;
    }

    static load(path: string): ConfigInterface | null {
        let config: ConfigInterface | null = null;
        const configPath = ConfigParser.configFilePath(path);
        if (configPath !== null) {
            switch(true) {
                case configPath.endsWith('json'):
                    config = this.parseJSON(configPath);
                    break;
                case configPath.endsWith('yaml') || configPath.endsWith('yml'):
                    config = this.parseYAML(configPath);
                    break;
            }
        }
        config = this.mergeDefault(config as ConfigInterface);
        ConfigParser.buildFilePaths(config, path);
        this.splitNames(config);
        return config;
    }

    static mergeDefault(config: ConfigInterface): ConfigInterface {
        if (!config) {
            return DefaultConfig;
        }

        let mergedConfig = {...DefaultConfig};

        if (config.names) {
            mergedConfig.names!.characters =
                this.pickNameList(config.names.characters, DefaultConfig.names!.characters);
            mergedConfig.names!.invalid =
                this.pickNameList(config.names.invalid, DefaultConfig.names!.invalid);
            mergedConfig.names!.places =
                this.pickNameList(config.names.places, DefaultConfig.names!.places);
            mergedConfig.names!.things =
                this.pickNameList(config.names.things, DefaultConfig.names!.things);
        }

        if (config.compile) {
            mergedConfig.compile = {...DefaultConfig.compile, ...config.compile};
            mergedConfig.compile.order = config.compile.order;

            // Sanitize formatting value.
            if (!Object.keys(Formatting).includes(mergedConfig.compile?.formatting!)) {
                mergedConfig.compile.formatting = DefaultConfig.compile?.formatting;
            }
        }

        return mergedConfig;
    }

    private static parseJSON(path: string): ConfigInterface {
        let content = readFileSync(path, 'utf-8');
        return JSON.parse(content);
    }

    private static parseYAML(path: string): ConfigInterface {
        let content = readFileSync(path, 'utf-8');
        return YAML.parse(content);
    }

    private static pickNameList(fromFile: string[], DefaultValue: string[]): string[] {
        if (fromFile) {
            return fromFile;
        }
        return DefaultValue;
    }

    private static split(names: string[]): string[] {
        let splitNames: string[] = [];
        for (let name of names) {
            splitNames = splitNames.concat(name.split(',').map(item => item.trim()));
        }
        return splitNames;
    }

    private static splitNames(config: ConfigInterface): void {
        if (config.names?.characters) {
            config.names.characters = this.split(config.names.characters);
        }
        if (config.names?.places) {
            config.names.places = this.split(config.names.places);
        }
        if (config.names?.things) {
            config.names.things = this.split(config.names.things);
        }
        if (config.names?.invalid) {
            config.names.invalid = this.split(config.names.invalid);
        }
    }

}
