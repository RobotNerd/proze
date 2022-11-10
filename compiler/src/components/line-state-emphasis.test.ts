import { CompilerMessages } from "../util/compiler-messages";
import { EmphasisType, Line } from "./line";
import { LineState } from "./line-state";

describe('LineState', () => {

    beforeEach(() => {
        CompilerMessages.getInstance().reset();
    });

    test('parses a bold block that takes up the entire line', () => {
        const line = new Line('*abcd*', 0);
        const lineState = new LineState();
        const newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abcd');
        expect(newLines[0].emphasis.length).toBe(1);
        expect(newLines[0].emphasis).toContain(EmphasisType.bold);
    });

    test('parses a bold block that takes up the entire line with leading whitespace', () => {
        const line = new Line('   *abcd*', 0);
        const lineState = new LineState();
        const newLines = lineState.update(line);
        expect(newLines.length).toBe(1);
        expect(newLines[0].text).toBe('abcd');
        expect(newLines[0].emphasis.length).toBe(1);
        expect(newLines[0].emphasis).toContain(EmphasisType.bold);
    });

    test('parses a bold block at the beginning of a line', () => {
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

    test('parses a bold block in the middle of a line', () => {
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

    test('parses a bold block at the end of a line', () => {
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

    // TODO bold block covering multiple lines
    // TODO bold block without closing token - extends to EOF
    // TODO bold block with closing token commented out - extends to EOF
    // TODO bold block with closing token in bracket block - extends to EOF
    // TODO bold start/end tokens commented out on single line - no bold applied
    // TODO bold block starting token commented out - bold not applied
    // TODO bold block starting token in bracket block - bold not applied
    // TODO bold start/end surrounding a line comment - bold applied
    // TODO bold start/end surrounding a block comment - bold applied
});