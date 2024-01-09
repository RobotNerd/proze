import { Component } from "./component";
import { Token } from "./token";

export class Title implements Component {
    token: Token = Token.title;

    constructor(public name: string) {}
}
