import { LineType } from "./line-type";

export class Line {

    constructor(
        public text: string,
        public lineNumber: number,
        public lineType: LineType = LineType.unknown
    ) {}
}
