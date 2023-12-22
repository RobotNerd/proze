import { CompilerMessages } from "../util/compiler-messages";
import { ConfigInterface } from "../util/config";
import { Line, LineType } from "./line";
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

  // // TODO - should only have one error for "Johnny"
  // test('flags name variations', () => {
  //   const line = new Line('Johnny is one name.', 1, LineType.paragraph);
  //   Names.findInvalid(line, config);
  //   console.log('errors:\n', CompilerMessages.getInstance().toString());
  //   // expect(CompilerMessages.getInstance().hasErrors()).toBe(true);
  //   // expect(CompilerMessages.getInstance().errors.length).toBe(1);
  // });

  /** TODO
   * - test case
   *   - invalid: "John,John Smith"
   *   - text: "Johnny said something to John."
   *   - should flag only the last John.
   * - test case
   *   - invalid: "John,John Smith"
   *   - line: "John Smiley said hi."
   *   - should only flag on John
   * - test case
   *   - invalid: "John,John Smith"
   *   - line: "Johnny Smith said hi."
   *   - no errors
  **/
});
