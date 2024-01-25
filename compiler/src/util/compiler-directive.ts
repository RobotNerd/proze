export enum DirectiveType {
  indent = 'indent',
  lineBreak = 'line',
  pageBreak = 'page',
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
      let directive = this.parseType(block);
      if (directive) {
        directives.push(directive);
      }
    }

    return directives;
  }

  static parseType(text: string): CompilerDirective | null {
    switch(text) {
      case 'break:line':
        return new CompilerDirective(DirectiveType.lineBreak);
      case 'break:page':
        return new CompilerDirective(DirectiveType.pageBreak);
      case 'indent:true':
        return new CompilerDirective(DirectiveType.indent);
      case 'indent:false':
        return new CompilerDirective(DirectiveType.unindent);
    }
    return null;
  }
}
