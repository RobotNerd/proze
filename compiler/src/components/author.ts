import { Component } from "./component";
import { Token } from "./token";

export class Author implements Component {
    public token: Token = Token.author;

    constructor(
        public name: string
    ) {}
}
