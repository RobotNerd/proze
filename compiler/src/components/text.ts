import { Component } from "./component";
import { Token } from "./token";
import { Line, EmphasisType } from './line';

export class Text implements Component {
    token: Token = Token.text;
    text: string;
    emphasis: EmphasisType[];
    blockquoteLevel: number = 0;

    constructor(line: Line) {
        this.text = line.text;
        this.emphasis = line.emphasis;
        this.blockquoteLevel = line.blockquoteLevel;
    }
}
