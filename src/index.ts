import * as fs from 'fs';
import { createInterface } from 'readline';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

enum TokenType {
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

class Token {
  type: TokenType;
  lexeme: string;
  literal: Object;
  line: number;

  constructor(type: TokenType, lexeme: string, literal: Object, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  public toString(): string {
    return this.type + ' ' + this.lexeme + ' ' + this.literal;
  }
}

class Scanner {
  private source: string;
  private tokens: Token[] = [];
  private start = 0;
  private current = 0;
  private line = 1;

  constructor(source: string) {
    this.source = source;
  }

  public scanTokens() : Token[] {
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
      default: {
        Lox.error(this.line, "Unexpected character.");
      }
    }
  }
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;

    this.current++;
    return true;
  }

  private advance(): string {
    return this.source[this.current++];
  }

  private peek(): string { // lookahead
    if (this.isAtEnd()) return '\0';
    return this.source[this.current];
  }

  private addToken(type: TokenType, literal?: Object | null): void {
    const text = this.source.substring(this.start, this.current);
    if (literal) {
      this.tokens.push(new Token(type, text, literal, this.line));
    } else {
      this.tokens.push(new Token(type, text, null, this.line));
    }
  }
}

class Lox {
  static hadError: boolean = false;

  constructor() {}

  public static main(args: string[]) : void {
    if (args.length > 1) {
      console.log('Usage: jlox [script]');
      return;
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  private static runFile(path: string) : void {
    let source;
    
    try {
      source = fs.readFileSync(path, { encoding: 'utf-8' });
    } catch (err) {
      console.error(`Error :O`);
      process.exit(64);
    }

    this.run(source);
  }

  private static runPrompt() : void {}

  private static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    // print tokens
    tokens.forEach((token: Token) => {
      console.log(token);
    });
  }

  static error(line: number, message: string) : void {
    this.report(line, '', message);
  }

  private static report(line: number, where: string, message: string) : void {
    console.log('[line ' + line + '] Error' + where + ': ' + message);
    this.hadError = true;
  }
}

Lox.main(process.argv.slice(3));
