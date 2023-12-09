import { Component } from "./component";
import { Token } from "./token";

export class Section implements Component {

    public token: Token = Token.section;
    private symbol = '---';

    constructor(
        public name: string = ''
    ) {}

    getOutput(): string {
        if (this.isNamed()) {
            return this.name;
        }
        return this.symbol;
    }

    isNamed(): boolean {
        return this.name !== '';
    }
}
