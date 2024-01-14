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
}
