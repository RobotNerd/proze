import { existsSync, readFileSync, statSync } from "fs";
import { ProzeFile } from './proze-file';
import YAML from 'yaml';

export interface ConfigCompilerOptionsInterface {
    order?: string[];
}

export interface ConfigNames {
    invalid?: string [];
}

export interface ConfigInterface {
    names?: ConfigNames;
    compile?: ConfigCompilerOptionsInterface;
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
        ConfigParser.buildFilePaths(config, path);
        return config;
    }

    private static parseJSON(path: string): ConfigInterface {
        let content = readFileSync(path, 'utf-8');
        return JSON.parse(content);
    }

    private static parseYAML(path: string): ConfigInterface {
        let content = readFileSync(path, 'utf-8');
        return YAML.parse(content);
    }

}
