import { Config } from "../util/config";
import { Component } from "./component";
import { Token } from "./token";

export class Section implements Component {

    public token: Token = Token.section;

    constructor(
        public name: string = ''
    ) {}

    getOutput(): string {
        if (this.isNamed()) {
            return this.name;
        }
        let config = Config.get();
        return config.compile?.section?.symbol!;
    }

    isNamed(): boolean {
        return this.name !== '';
    }

    static preventInvalid(components: Component[]) {
        if (components.length > 1) {
            let c = components.length - 1;
            let p = components.length - 2;
            let current = components[c];
            let previous = components[p];
            this.removeUnnamedAtChapterStart(components, c, current, previous) ||
                this.removeUnnamedAtChapterEnd(components, p, current, previous) ||
                this.removeUnnamedDuplicates(components, c, p, current, previous);
        }
    }

    // Remove empty section at end of the document.
    // Only call once all components are parsed.
    static removeLastEmpty(components: Component[]) {
        if (components.length > 1) {
            let c = components.length - 1;
            let p = components.length - 2;
            let current = components[c];
            let previous = components[p];
            if (
                current.token === Token.eof &&
                previous.token === Token.section
            ) {
                components.splice(p, 1);
            }
        }
    }

    private static removeUnnamedDuplicates(
        components: Component[],
        c: number,
        p: number,
        current: Component,
        previous: Component
    ): boolean {
        if (
            current.token === Token.section &&
            previous.token === Token.section
        ) {
            if (!(current as Section).isNamed()) {
                components.splice(c, 1);
                return true;
            }
            else if (!(previous as Section).isNamed()) {
                components.splice(p, 1);
                return true;
            }
        }
        return false;
    }

    private static removeUnnamedAtChapterEnd(
        components: Component[],
        p: number,
        current: Component,
        previous: Component
    ): boolean {
        if (
            current.token === Token.chapter &&
            previous.token === Token.section &&
            !(previous as Section).isNamed()
        ) {
            components.splice(p, 1);
            return true;
        }
        return false;
    }

    private static removeUnnamedAtChapterStart(
        components: Component[],
        c: number,
        current: Component,
        previous: Component
    ): boolean {
        if (
            previous.token === Token.chapter &&
            current.token === Token.section &&
            !(current as Section).isNamed()
        ) {
            components.splice(c, 1);
            return true;
        }
        return false;
    }
}
