import { Token } from './index'

interface Visitor<R> {}

/*class Visitor {
  public visitBinary(expr: Binary): any {
    return true
  }
}
*/

abstract class Expr {
  public abstract accept(visitor: Visitor): any;
}

export class Binary extends Expr {
  constructor(public left: Expr, public operator: Token, public right: Expr) {
    super();
  }
  public accept(visitor: Visitor<R>) {
    return visitor.visitBinary(this);
  }
}
/*
export class Grouping extends Expr {
  constructor(public expression: Expr) {
    super();
  }
}
export class Literal extends Expr {
  constructor(public value: any) {
    super();
  }
}

export class Unary extends Expr {
  constructor(public operator: Token, public right: Expr) {
    super();
  }
}
*/

