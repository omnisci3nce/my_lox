import * as fs from 'fs';
const readlineSync = require('readline-sync');
import Scanner from './Lexer';
import { Token, TokenType } from './Lexer';

export class Lox {
  static hadError = false;

  public static main(args: string[]): void {
    if (args.length > 1) {
      console.log('Usage: jlox [script]');
      return;
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  private static runFile(path: string): void {
    let source;

    try {
      source = fs.readFileSync(path, { encoding: 'utf-8' });
    } catch (err) {
      console.error(`Error :O`);
      process.exit(64);
    }

    this.run(source);
  }

  private static runPrompt(): void {
    while (true) {
      const line = readlineSync.question('> ');
      if (!line) break;
      this.run(line);
    }
  }

  private static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    // print tokens
    tokens.forEach((token: Token) => {
      process.stdout.write(TokenType[token.type]);
      console.log(' ', token);
    });
  }

  static error(line: number, message: string): void {
    this.report(line, '', message);
  }

  private static report(line: number, where: string, message: string): void {
    console.log('[line ' + line + '] Error' + where + ': ' + message);
    this.hadError = true;
  }
}

// Lox.main(process.argv.slice(3));
