import { Component } from "./component";
import { Token } from "./token";
import { Line } from './line';

export class Text implements Component {
    token: Token = Token.text;

    constructor(public line: Line) {}
}
