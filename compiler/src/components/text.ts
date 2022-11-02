import { Component } from "./component";
import { Token } from "./token";

export class Text implements Component {
    token: Token = Token.text;

    constructor(
        public text: string
    ) {}
}
