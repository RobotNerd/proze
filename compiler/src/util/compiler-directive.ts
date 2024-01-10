export enum DirectiveType {
  indent = 'indent',
  unindent = 'unindent',
  unknown = 'unknown',
}

export class CompilerDirective {
  directiveType: DirectiveType = DirectiveType.unknown;

  constructor(type: DirectiveType) {
    this.directiveType = type;
  }

  static copy(directive: CompilerDirective): CompilerDirective {
    return new CompilerDirective(directive.directiveType);
  }

  static parse(text: string): CompilerDirective[] {
    let directives: CompilerDirective[] = [];
    let blocks = text.split(';').map((v: string) => v.trim().toLowerCase());
    for (let block of blocks) {
      let directive = this.parseIndent(block);
      if (directive) {
        directives.push(directive);
      }
    }

    return directives;
  }

  static parseIndent(text: string): CompilerDirective | null {
    if (text === 'indent:true') {
      return new CompilerDirective(DirectiveType.indent);
    }
    else if (text === 'indent:false') {
      return new CompilerDirective(DirectiveType.unindent);
    }
    return null;
  }
}
