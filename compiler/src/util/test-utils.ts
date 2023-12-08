import { ProzeArgs, Format } from './cli-arguments';
import { Compiler } from '../compiler';
import { CompilerMessages } from "./compiler-messages";
import { Metadata } from "../components/metadata";


export class TestUtils {

  public static resetCompiler(): ProzeArgs {
    this.resetCompilerMessages();
    Metadata.getInstance().reset();
    return {
      file: '',
      format: Format.text,
      inputString: '',
      path: '.',
    };
  }

  public static resetCompilerMessages() {
    CompilerMessages.getInstance().reset();
  }

  public static runTest(mockArgs: ProzeArgs, expected: string) {
    const compiler = new Compiler(mockArgs);
    expect(compiler.compile()).toBe(expected);
  }

}
