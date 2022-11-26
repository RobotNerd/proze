import { existsSync, readFileSync, statSync } from "fs";
import { ProzeFile } from './proze-file';

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
        // TODO add yaml and yml
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
        if (statSync(path).isDirectory()) {
            for (let ext of ConfigParser.allowedConfigExtensions) {
                let configPath = `${path}/config.${ext}`;
                if (existsSync(configPath)) {
                    return configPath;
                }
            }
        }
        return null;
    }

    static load(path: string): ConfigInterface | null {
        let config: ConfigInterface | null = null;
        const configPath = ConfigParser.configFilePath(path);
        if (configPath !== null) {
            let content = readFileSync(configPath, 'utf-8');
            config = JSON.parse(content);
        }
        ConfigParser.buildFilePaths(config, path);
        return config;
    }
}
