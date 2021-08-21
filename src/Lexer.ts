import { Lox } from './index'

export enum TokenType {
  // Single-character tokens
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
  COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,

  // One or two character tokens
  BANG, BANG_EQUAL,
  EQUAL, EQUAL_EQUAL,
  GREATER, GREATER_EQUAL,
  LESS, LESS_EQUAL,

  // Literals
  IDENTIFIER, STRING, NUMBER,

  // Keywords
  AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
  PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,

  EOF
};

export class Token {
  type: TokenType;
  lexeme: string;
  literal: Object | null;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: Object | null, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  public toString(): string {
    return this.type + ' ' + this.lexeme + ' ' + this.literal;
  }
}

const keywords = new Map<String, TokenType>();
keywords.set('and', TokenType.AND);
keywords.set('class', TokenType.CLASS);
keywords.set('else', TokenType.ELSE);
keywords.set('false', TokenType.FALSE);
keywords.set('for', TokenType.FOR);
keywords.set('fun', TokenType.FUN);
keywords.set('if', TokenType.IF);
keywords.set('nil', TokenType.NIL);
keywords.set('or', TokenType.OR);
keywords.set('print', TokenType.PRINT);
keywords.set('return', TokenType.RETURN);
keywords.set('super', TokenType.SUPER);
keywords.set('this', TokenType.THIS);
keywords.set('true', TokenType.TRUE);
keywords.set('var', TokenType.VAR);
keywords.set('while', TokenType.WHILE);

export default class Scanner {
  private source: string;
  private tokens: Token[] = [];
  private start = 0;
  private current = 0;
  private line = 1;

  constructor(source: string) {
    this.source = source;
  }

  public scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      // beginning of the next lexeme
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line));
    return this.tokens;
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private scanToken(): void {
    let c = this.advance();
    switch (c) {
      case '(': { this.addToken(TokenType.LEFT_PAREN); break; }
      case ')': { this.addToken(TokenType.RIGHT_PAREN); break; }
      case '{': { this.addToken(TokenType.LEFT_BRACE); break; }
      case '}': { this.addToken(TokenType.RIGHT_BRACE); break; }
      case ',': { this.addToken(TokenType.COMMA); break; }
      case '.': { this.addToken(TokenType.DOT); break; }
      case '-': { this.addToken(TokenType.MINUS); break; }
      case '+': { this.addToken(TokenType.PLUS); break; }
      case ';': { this.addToken(TokenType.SEMICOLON); break; }
      case '*': { this.addToken(TokenType.STAR); break; }
      case '/': {
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      }
      case '!': {
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      }
      case '=': {
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      }
      case '<': {
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      }
      case '>': {
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
        break;
      }
      case ' ':
      case '\r':
      case '\t': {
        // ignore whitespace
        break;
      }
      case '\n': {
        this.line++;
        break;
      }
      case '"': this.string(); break;
      default: {
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          Lox.error(this.line, 'Unexpected character.');
        }
      }
    }
  }
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;

    this.current++;
    return true;
  }

  private advance(): string { // returns next character and moves current forward by one
    return this.source[this.current++];
  }

  private peek(): string { // lookahead
    if (this.isAtEnd()) return '\0';
    return this.source[this.current];
  }
  private peekNext(): string {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source[this.current + 1];
  }

  private addToken(type: TokenType, literal?: Object | null): void {
    const text = this.source.substring(this.start, this.current);
    if (literal) {
      this.tokens.push(new Token(type, text, literal, this.line));
    } else {
      this.tokens.push(new Token(type, text, null, this.line));
    }
  }

  private string() { // handle string literals
    // continue until closing double quote or end of line
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      Lox.error(this.line, 'Unterminated string.');
      return;
    }

    // the closing double quote
    this.advance();

    const value: String = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  private isDigit(c: string) {
    return c >= '0' && c <= '9';
  }
  private number() { // handle number literals
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // look for fractional component
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    this.addToken(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)));
  }

  private isAlpha(c: string): boolean {
    return (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z') ||
      c === '_';
  }
  private isAlphaNumeric(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }
  private identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    var tType = keywords.get(text);
    if (!tType) {
      tType = TokenType.IDENTIFIER;
    }

    this.addToken(tType);
  }
}