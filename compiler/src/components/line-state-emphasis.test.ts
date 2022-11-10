import { CompilerMessages } from "../util/compiler-messages";
import { EmphasisType, Line } from "./line";
import { LineState } from "./line-state";

describe('LineState', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

    test('strips text in a bracket block that takes up the entire line', () => {
        const line = new Line('*abcd*', 0);
        const lineState = new LineState();
        const newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abcd');
        expect(newLines[0].emphasis.length).toBe(1);
        expect(newLines[0].emphasis).toContain(EmphasisType.bold);
    });

    test('strips text in a bracket block that takes up the entire line with leading whitespace', () => {
        const line = new Line('   *abcd*', 0);
        const lineState = new LineState();
        const newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abcd');
        expect(newLines[0].emphasis.length).toBe(1);
        expect(newLines[0].emphasis).toContain(EmphasisType.bold);
    });

    test('strips text in a bracket block from the beginning of a line', () => {
        const line = new Line('*a* b', 0);
        const lineState = new LineState();
        const newLines = lineState.update(line);
        expect(newLines.length).toBe(2);
        
        expect(newLines[0].text).toBe('a');
        expect(newLines[0].emphasis.length).toBe(1);
        expect(newLines[0].emphasis).toContain(EmphasisType.bold)

        expect(newLines[1].text).toBe('b');
        expect(newLines[1].emphasis.length).toBe(0);
        expect(newLines[1].emphasis.length).toBe(0);
    });

    test('strips text in a bracket block from the middle of a line', () => {
        const line = new Line('a *b* c', 0);
        const lineState = new LineState();
        const newLines = lineState.update(line);
        expect(newLines.length).toBe(3);
        
        expect(newLines[0].text).toBe('a');
        expect(newLines[0].emphasis.length).toBe(0);
        expect(newLines[0].emphasis.length).toBe(0);

        expect(newLines[1].text).toBe('b');
        expect(newLines[1].emphasis.length).toBe(1);
        expect(newLines[1].emphasis).toContain(EmphasisType.bold)

        expect(newLines[2].text).toBe('c');
        expect(newLines[2].emphasis.length).toBe(0);
        expect(newLines[0].emphasis.length).toBe(0);
    });

    test('strips text in a bracket block from the end of a line', () => {
        const line = new Line('a *b*', 0);
        const lineState = new LineState();
        const newLines = lineState.update(line);
        expect(newLines.length).toBe(2);
        
        expect(newLines[0].text).toBe('a');
        expect(newLines[0].emphasis.length).toBe(0);
        expect(newLines[0].emphasis.length).toBe(0);

        expect(newLines[1].text).toBe('b');
        expect(newLines[1].emphasis.length).toBe(1);
        expect(newLines[1].emphasis).toContain(EmphasisType.bold)
    });
});