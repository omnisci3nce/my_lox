import { Token } from './index'

export interface Visitor<R> {
  visitLiteralExpr(expr: Literal): R;
  visitUnaryExpr(expr: Unary): R;
  visitBinaryExpr(expr: Binary): R;
  visitGroupingExpr(expr: Grouping): R;
}

// class Visitor implements IVisitor<string> {
//   public visitBinary(expr: Binary): any {
//     return true
//   }
// }

export abstract class Expr {
  public abstract accept<R>(visitor: Visitor<R>): R;
}

export class Literal extends Expr {
  constructor(public value: any) {
    super();
  }

  public accept<R>(visitor: Visitor<R>) {
    return visitor.visitLiteralExpr(this);
  }
}

export class Unary extends Expr {
  constructor(public operator: Token, public right: Expr) {
    super();
  }

  public accept<R>(visitor: Visitor<R>) {
    return visitor.visitUnaryExpr(this);
  }
}
export class Binary extends Expr {
  constructor(public left: Expr, public operator: Token, public right: Expr) {
    super();
  }

  public accept<R>(visitor: Visitor<R>) {
    return visitor.visitBinaryExpr(this);
  }
}

export class Grouping extends Expr {
  constructor(public expression: Expr) {
    super();
  }

  public accept<R>(visitor: Visitor<R>) {
    return visitor.visitGroupingExpr(this);
  }
}
