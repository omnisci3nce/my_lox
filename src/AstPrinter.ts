import { Token, TokenType } from '.';
import { Expr, Visitor, Binary, Literal, Grouping, Unary } from './Expr'

export default class AstPrinter implements Visitor<string> {
  public print(expr: Expr): string {
    return expr.accept(this);
  }

  public visitLiteralExpr(expr: Literal): string {
    return expr.value ? expr.value : "nil";
  }

  public visitUnaryExpr(expr: Unary): string {
    return this.parenthesise(expr.operator.lexeme, [expr.right]);
  }

  public visitBinaryExpr(expr: Binary): string {
    return this.parenthesise(expr.operator.lexeme, [expr.left, expr.right]);
  }

  public visitGroupingExpr(expr: Grouping): string {
    return this.parenthesise("group", [expr.expression]);
  }

  private parenthesise(name: string, subExpressions: Expr[]): string {
    let str = "";


    // TODO: make it more declarative
    str += '(';
    str += name;
    subExpressions.forEach((e) => {
      str += ' ';
      str += e.accept(this);
    })
    str += ')';

    return str;
  }

  public static main(args: string[]): void {
    const expression = new Binary(
      new Unary(
        new Token(TokenType.MINUS, '-', null, 1),
        new Literal(123)
      ),
      new Token(TokenType.STAR, '*', null, 1),
      new Grouping(
        new Literal(45.67)
      )
    );

    console.log(
      new AstPrinter().print(expression)
    );
  } 
}

AstPrinter.main([]);