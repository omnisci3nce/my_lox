import * as fs from 'fs';

class Lox {
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
  }

  private static runPrompt() : void {

  }
}

Lox.main(process.argv.slice(3));
