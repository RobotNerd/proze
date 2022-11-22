import { ConfigInterface } from './config';
import { ProzeArgs } from './cli-arguments';
import { readdirSync, readFileSync, statSync } from 'fs';

export class ProzeFile {

    static paths(args: ProzeArgs, config: ConfigInterface | null): string[] {
        if (config?.compile?.order) {
            return config.compile.order;
        }
        else if (statSync(args.path).isDirectory()) {
            // Default to recursively loading all proze files.
            return this.loadDirectory(args.path);
        }
        return [args.path];
    }

    static load(path: string): string[] {
        let content = readFileSync(path, 'utf-8');
        return content.split(/\r?\n/);
    }

    static loadDirectory(basePath: string): string[] {
        const allFiles: string[] = readdirSync(basePath).sort();
        let prozeFiles: string[] = [];
        for (let path of allFiles) {
            const fullPath = `${basePath}/${path}`;
            if (path.endsWith('.proze')) {
                prozeFiles.push(fullPath);
            }
            else if (statSync(fullPath).isDirectory()) {
                prozeFiles = prozeFiles.concat(this.loadDirectory(fullPath));
            }
        }
        return prozeFiles;
    }
}
