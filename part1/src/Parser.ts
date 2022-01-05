import { Expr, Binary, Unary, Literal, Grouping } from './Expr';
import { Token, TokenType } from './Lexer';

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private expression(): Expr {
    return this.equality();
  }

  private equality(): Expr {
    let expr = this.comparison();

    while (this.match([TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL])) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private comparison(): Expr {
    let expr = this.term();

    while (this.match([
      TokenType.GREATER,
      TokenType.GREATER_EQUAL,
      TokenType.LESS,
      TokenType.LESS_EQUAL,
    ])) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private term(): Expr {
    let expr = this.factor();

    while (this.match([TokenType.MINUS, TokenType.PLUS])) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private factor(): Expr {
    let expr = this.unary();

    while (this.match([TokenType.SLASH, TokenType.STAR])) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  private unary(): Expr {
    if (this.match([TokenType.BANG, TokenType.MINUS])) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }

    return this.primary();
  }

  private primary(): Expr {
    if (this.match([TokenType.FALSE])) return new Literal(false);
    if (this.match([TokenType.TRUE])) return new Literal(true);
    if (this.match([TokenType.NIL])) return new Literal(null);

    if (this.match([TokenType.NUMBER, TokenType.STRING])) {
      return new Literal(this.previous().literal);
    }

    if (this.match([TokenType.LEFT_PAREN])) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return new Grouping(expr);
    }
  }

  private consume(tokenType: TokenType, )

  private match(tokenTypes: TokenType[]): boolean {
    let matched = false;
    tokenTypes.forEach((type) => {
      if (this.check(type)) {
        this.advance(); // consume token
        matched = true;
      }
    })

    return matched;
  }

  private check(type: TokenType): boolean { // doesnt consume token
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++; // consume token
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }
  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}
