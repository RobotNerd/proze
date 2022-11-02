import { Token } from "./token";

export interface Component {
    token: Token;
}

export class EmptyComponent implements Component {
    constructor(
        public token: Token
    ) {}
}
