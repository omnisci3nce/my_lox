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
  BANG, BANG_EQUAL
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
  literal: Object,
  line: number;

  constructor(type: TokenType, lexeme: string, literal: Object, line: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }

  toString() {
    // fill
  }
}

class Scanner {
  source: string;

  constructor(source: string) {
    this.source = source;
  }

  scanTokens() : Token[] {
    return [];
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

    run(source);
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
