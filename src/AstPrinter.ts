import { Expr, Visitor, Binary, Literal, Grouping, Unary } from './Expr'

class AstPrinter implements Visitor<string> {
  public print(expr: Expr): string {
    return expr.accept(this);
  }

  public visitLiteralExpr(expr: Literal): string {
    return "";
  }

  public visitUnaryExpr(expr: Unary): string {
    // return this.parenthesise(expr.operator.lexeme, [expr.left, expr.right]);
    return "";
  }

  public visitBinaryExpr(expr: Binary): string {
    // return this.parenthesise(expr.operator.lexeme, [expr.left, expr.right]);
    return "";
  }

  public visitGroupingExpr(expr: Grouping): string {
    // return this.parenthesise(expr.operator.lexeme, [expr.left, expr.right]);
    return "";
  }

  private parenthesise(name: string, subExpressions: Expr[]): string {
    return "";
  }
}
