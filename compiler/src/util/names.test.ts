import { CompilerMessages } from "../util/compiler-messages";
import { ConfigInterface } from "../util/config";
import { Line, LineType } from "../parse/line";
import { Names } from "./names";
import { TestUtils } from "../util/test-utils";

describe("LineState", () => {

  let config: ConfigInterface = {
    names: {
      characters: [],
      invalid: ['John,Johnny'],
      places: [],
      things: [],
    },
  };

  beforeEach(() => {
    TestUtils.resetCompiler();
  });

  test('flags an invalid name at the beginning of the line', () => {
    const line = new Line('John went to the store.', 1, LineType.paragraph);
    Names.findInvalid(line, config);
    expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
    expect(CompilerMessages.getInstance().errors.length).toBe(1);
  });

  test('flags an invalid name at the end of the line', () => {
    const line = new Line('His name was John.', 1, LineType.paragraph);
    Names.findInvalid(line, config);
    expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
    expect(CompilerMessages.getInstance().errors.length).toBe(1);
  });

  test('flags an invalid name in the middle of the line', () => {
    const line = new Line('That was John who went to the store.', 1, LineType.paragraph);
    Names.findInvalid(line, config);
    expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
    expect(CompilerMessages.getInstance().errors.length).toBe(1);
  });

  test('matches only the longest invalid name among substrings', () => {
    const line = new Line('Johnny is one name.', 1, LineType.paragraph);
    Names.findInvalid(line, config);
    expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
    expect(CompilerMessages.getInstance().errors.length).toBe(1);
  });

  test('does not match shorter invalid name if part of a larger non-invalid word', () => {
    const line = new Line('Johnathan Smith is one name.', 1, LineType.paragraph);
    Names.findInvalid(line, config);
    expect(CompilerMessages.getInstance().hasErrors()).toBe(false);
  });

  test('matches shorter invalid name among substrings when longer name not matched', () => {
    config.names!.invalid = ['John,John Smith'];
    const line = new Line('John Smalls is one name.', 1, LineType.paragraph);
    Names.findInvalid(line, config);
    expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
    expect(CompilerMessages.getInstance().errors.length).toBe(1);
    expect(CompilerMessages.getInstance().errors[0].message).toContain('John');
    expect(CompilerMessages.getInstance().errors[0].message).not.toContain('Smalls');
  });

  test('matches invalid words that include terminator characters', () => {
    config.names!.invalid = ['John,Dr. Smith'];
    const line = new Line('I heard that Dr. Smith is back in town.', 1, LineType.paragraph);
    Names.findInvalid(line, config);
    expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
    expect(CompilerMessages.getInstance().errors.length).toBe(1);
    expect(CompilerMessages.getInstance().errors[0].message).toContain('Dr. Smith');
  });
});
