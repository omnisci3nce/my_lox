import { Expr } from './Expr';
import { Token, TokenType } from './Lexer';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  // private expression(): Expr {
  //   return this.equality();
  // }

  // private equality(): Expr {
  //   let expr = this.comparison();

  //   while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {

  //   }

  //   return expr;
  // }

  // private match(): boolean {}
}