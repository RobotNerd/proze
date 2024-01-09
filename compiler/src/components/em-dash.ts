import { Component } from "./component";
import { EmDashProze } from '../parse/em-dash-parser'
import { Token } from "./token";

const EmDashUnicode = '—';  // \u{2014}

export class EmDash implements Component {
  public token: Token = Token.emdash;

  toString(): string {
    return EmDashProze;
  }

  toUnicode(): string {
    return EmDashUnicode;
  }
}
