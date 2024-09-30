import { BinaryExpression, ElementAccessExpression, ExpressionStatement, Node, NodeKind, Source } from "./ast";
import { AstVisitor } from "./ast-replacer";
import { BuiltinNames } from "./builtins";
import { Program } from "./program";
import { Token } from "./tokenizer";

class ComplexElementAccessExtractor extends AstVisitor {
  private _uuid: i32 = 0;
  get uuid(): i32 {
    return this._uuid++;
  }
  override visitBinaryExpression(node: BinaryExpression): void {
    if (node.operator != Token.Plus_Equals || node.left.kind != NodeKind.ElementAccess) return;
    let left = <ElementAccessExpression>node.left;
    let elementAccessExprKind = left.elementExpression.kind;
    if (elementAccessExprKind == NodeKind.Literal || elementAccessExprKind == NodeKind.Identifier) return;
    node.left = Node.createCallExpression(
      Node.createIdentifierExpression(BuiltinNames.element_access_compound, left.elementExpression.range),
      null,
      [left.expression, left.elementExpression, node.right],
      left.range
    );
  }
}

export class Desurgar {
  visitors: AstVisitor[] = [];
  constructor(private program: Program) {
    this.visitors.push(new ComplexElementAccessExtractor());
  }
  desurgar(): void {
    for (let i = 0, k = this.visitors.length; i < k; i++) {
      this.visitors[i].visitNodes(this.program.sources);
    }
  }
}
