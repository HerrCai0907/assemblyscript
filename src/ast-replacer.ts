import {
  AssertionExpression,
  BinaryExpression,
  BlockStatement,
  BreakStatement,
  CallExpression,
  ClassDeclaration,
  ClassExpression,
  CommaExpression,
  CommentNode,
  CompiledExpression,
  ConstructorExpression,
  ContinueStatement,
  DeclarationStatement,
  DecoratorNode,
  DoStatement,
  ElementAccessExpression,
  EmptyStatement,
  EnumDeclaration,
  EnumValueDeclaration,
  ExportDefaultStatement,
  ExportImportStatement,
  ExportMember,
  ExportStatement,
  Expression,
  ExpressionStatement,
  FalseExpression,
  FieldDeclaration,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration,
  FunctionExpression,
  FunctionTypeNode,
  IdentifierExpression,
  IfStatement,
  ImportDeclaration,
  ImportStatement,
  IndexSignatureNode,
  InstanceOfExpression,
  InterfaceDeclaration,
  LiteralExpression,
  MethodDeclaration,
  ModuleDeclaration,
  NamedTypeNode,
  NamespaceDeclaration,
  NewExpression,
  Node,
  NodeKind,
  NullExpression,
  OmittedExpression,
  ParameterNode,
  ParenthesizedExpression,
  PropertyAccessExpression,
  ReturnStatement,
  Source,
  Statement,
  SuperExpression,
  SwitchCase,
  SwitchStatement,
  TernaryExpression,
  ThisExpression,
  ThrowStatement,
  TrueExpression,
  TryStatement,
  TypeDeclaration,
  TypeName,
  TypeNode,
  TypeParameterNode,
  UnaryPostfixExpression,
  UnaryPrefixExpression,
  VariableDeclaration,
  VariableLikeDeclarationStatement,
  VariableStatement,
  VoidStatement,
  WhileStatement,
} from "./ast";

export class Item {
  constructor(public node: Node, public index: u32) {}
}

export class AstVisitor {
  protected stack: Item[] = [];

  visitSource(node: Source): void {
    this.visitNodes(node.statements);
  }
  visitNamedTypeNode(node: NamedTypeNode): void {
    this.visitNode(node.name);
    this.visitNodes(node.typeArguments);
  }

  visitFunctionTypeNode(node: FunctionTypeNode): void {
    this.visitNodes(node.parameters);
    this.visitNode(node.returnType);
    this.visitNode(node.explicitThisType);
  }
  visitTypeName(node: TypeName): void {
    this.visitNode(node.identifier);
    this.visitNode(node.next);
  }
  visitTypeParameterNode(node: TypeParameterNode): void {
    this.visitNode(node.name);
    this.visitNode(node.extendsType);
    this.visitNode(node.defaultType);
  }
  visitParameterNode(node: ParameterNode): void {
    this.visitNode(node.name);
    this.visitNode(node.type);
    this.visitNode(node.initializer);
  }

  visitIdentifierExpression(_: IdentifierExpression): void {}
  visitAssertionExpression(node: AssertionExpression): void {
    this.visitNode(node.expression);
    this.visitNode(node.toType);
  }
  visitBinaryExpression(node: BinaryExpression): void {
    this.visitNode(node.left);
    this.visitNode(node.right);
  }
  visitCallExpression(node: CallExpression): void {
    this.visitNode(node.expression);
    this.visitNodes(node.typeArguments);
    this.visitNodes(node.args);
  }
  visitClassExpression(node: ClassExpression): void {
    this.visitNode(node.declaration);
  }
  visitCommaExpression(node: CommaExpression): void {
    this.visitNodes(node.expressions);
  }
  visitElementAccessExpression(node: ElementAccessExpression): void {
    this.visitNode(node.expression);
    this.visitNode(node.elementExpression);
  }
  visitFalseExpression(_: FalseExpression): void {}
  visitFunctionExpression(node: FunctionExpression): void {
    this.visitNode(node.declaration);
  }
  visitInstanceOfExpression(node: InstanceOfExpression): void {
    this.visitNode(node.expression);
    this.visitNode(node.isType);
  }
  visitLiteralExpression(_: LiteralExpression): void {}
  visitNewExpression(node: NewExpression): void {
    this.visitNode(node.typeName);
    this.visitNodes(node.typeArguments);
    this.visitNodes(node.args);
  }
  visitNullExpression(_: NullExpression): void {}
  visitOmittedExpression(_: OmittedExpression): void {}
  visitParenthesizedExpression(node: ParenthesizedExpression): void {
    this.visitNode(node.expression);
  }
  visitPropertyAccessExpression(node: PropertyAccessExpression): void {
    this.visitNode(node.expression);
    this.visitNode(node.property);
  }
  visitTernaryExpression(node: TernaryExpression): void {
    this.visitNode(node.condition);
    this.visitNode(node.ifThen);
    this.visitNode(node.ifElse);
  }
  visitSuperExpression(_: SuperExpression): void {}
  visitThisExpression(_: ThisExpression): void {}
  visitTrueExpression(_: TrueExpression): void {}
  visitConstructorExpression(_: ConstructorExpression): void {}
  visitUnaryPostfixExpression(node: UnaryPostfixExpression): void {
    this.visitNode(node.operand);
  }
  visitUnaryPrefixExpression(node: UnaryPrefixExpression): void {
    this.visitNode(node.operand);
  }
  visitCompiledExpression(_: CompiledExpression): void {}

  visitBlockStatement(node: BlockStatement): void {
    this.visitNodes(node.statements);
  }
  visitBreakStatement(node: BreakStatement): void {
    this.visitNode(node.label);
  }
  visitContinueStatement(node: ContinueStatement): void {
    this.visitNode(node.label);
  }
  visitDoStatement(node: DoStatement): void {
    this.visitNode(node.body);
    this.visitNode(node.condition);
  }
  visitEmptyStatement(_: EmptyStatement): void {}
  visitExportStatement(node: ExportStatement): void {
    this.visitNodes(node.members);
    this.visitNode(node.path);
  }
  visitExportDefaultStatement(node: ExportDefaultStatement): void {
    this.visitNode(node.declaration);
  }
  visitExportImportStatement(node: ExportImportStatement): void {
    this.visitNode(node.name);
    this.visitNode(node.externalName);
  }
  visitExpressionStatement(node: ExpressionStatement): void {
    this.visitNode(node.expression);
  }
  visitForStatement(node: ForStatement): void {
    this.visitNode(node.initializer);
    this.visitNode(node.condition);
    this.visitNode(node.incrementor);
    this.visitNode(node.body);
  }
  visitForOfStatement(node: ForOfStatement): void {
    this.visitNode(node.variable);
    this.visitNode(node.iterable);
    this.visitNode(node.body);
  }
  visitIfStatement(node: IfStatement): void {
    this.visitNode(node.condition);
    this.visitNode(node.ifTrue);
    this.visitNode(node.ifFalse);
  }
  visitImportStatement(node: ImportStatement): void {
    this.visitNodes(node.declarations);
    this.visitNode(node.namespaceName);
    this.visitNode(node.path);
  }
  visitReturnStatement(node: ReturnStatement): void {
    this.visitNode(node.value);
  }
  visitSwitchStatement(node: SwitchStatement): void {
    this.visitNode(node.condition);
    this.visitNodes(node.cases);
  }
  visitThrowStatement(node: ThrowStatement): void {
    this.visitNode(node.value);
  }
  visitTryStatement(node: TryStatement): void {
    this.visitNodes(node.bodyStatements);
    this.visitNode(node.catchVariable);
    this.visitNodes(node.catchStatements);
    this.visitNodes(node.finallyStatements);
  }
  visitVariableStatement(node: VariableStatement): void {
    this.visitNodes(node.decorators);
    this.visitNodes(node.declarations);
  }
  visitVoidStatement(node: VoidStatement): void {
    this.visitNode(node.expression);
  }
  visitWhileStatement(node: WhileStatement): void {
    this.visitNode(node.condition);
    this.visitNode(node.body);
  }

  visitModuleDeclaration(_: ModuleDeclaration): void {}

  visitDeclarationStatement(node: DeclarationStatement): void {
    this.visitNode(node.name);
    this.visitNodes(node.decorators);
  }
  visitClassDeclaration(node: ClassDeclaration): void {
    this.visitDeclarationStatement(node);
    this.visitNodes(node.typeParameters);
    this.visitNode(node.extendsType);
    this.visitNodes(node.implementsTypes);
    this.visitNodes(node.members);
  }
  visitEnumDeclaration(node: EnumDeclaration): void {
    this.visitDeclarationStatement(node);
    this.visitNodes(node.values);
  }
  visitVariableLikeDeclarationStatement(node: VariableLikeDeclarationStatement): void {
    this.visitNode(node.type);
    this.visitNode(node.initializer);
  }
  visitEnumValueDeclaration(node: EnumValueDeclaration): void {
    this.visitVariableLikeDeclarationStatement(node);
  }
  visitFieldDeclaration(node: FieldDeclaration): void {
    this.visitVariableLikeDeclarationStatement(node);
  }
  visitFunctionDeclaration(node: FunctionDeclaration): void {
    this.visitDeclarationStatement(node);
    this.visitNodes(node.typeParameters);
    this.visitNode(node.signature);
    this.visitNode(node.body);
  }
  visitImportDeclaration(node: ImportDeclaration): void {
    this.visitDeclarationStatement(node);
    this.visitNode(node.foreignName);
  }
  visitInterfaceDeclaration(node: InterfaceDeclaration): void {
    this.visitClassDeclaration(node);
  }
  visitMethodDeclaration(node: MethodDeclaration): void {
    this.visitFunctionDeclaration(node);
  }
  visitNamespaceDeclaration(node: NamespaceDeclaration): void {
    this.visitDeclarationStatement(node);
    this.visitNodes(node.members);
  }
  visitTypeDeclaration(node: TypeDeclaration): void {
    this.visitDeclarationStatement(node);
    this.visitNodes(node.typeParameters);
    this.visitNode(node.type);
  }
  visitVariableDeclaration(node: VariableDeclaration): void {
    this.visitVariableLikeDeclarationStatement(node);
  }

  visitDecoratorNode(node: DecoratorNode): void {
    this.visitNode(node.name);
    this.visitNodes(node.args);
  }
  visitExportMember(node: ExportMember): void {
    this.visitNode(node.localName);
    this.visitNode(node.exportedName);
  }
  visitSwitchCas(node: SwitchCase): void {
    this.visitNode(node.label);
    this.visitNodes(node.statements);
  }
  visitIndexSignatureNode(node: IndexSignatureNode): void {
    this.visitNode(node.keyType);
    this.visitNode(node.valueType);
  }
  visitCommentNode(_: CommentNode): void {}

  visitNodes<T extends Node>(nodes: T[] | null): void {
    if (nodes == null) {
      return;
    }
    for (let i = 0, k = nodes.length; i < k; i++) {
      this.visitNode(unchecked(nodes[i]), i);
    }
  }
  visitNode(node: Node | null, index = -1): void {
    if (node == null) {
      return;
    }
    this.stack.push(new Item(node, index));
    switch (node.kind) {
      case NodeKind.Source:
        this.visitSource(<Source>node);
        break;
      // types
      case NodeKind.NamedType:
        this.visitNamedTypeNode(<NamedTypeNode>node);
        break;
      case NodeKind.FunctionType:
        this.visitFunctionTypeNode(<FunctionTypeNode>node);
        break;
      case NodeKind.TypeName:
        this.visitTypeName(<TypeName>node);
        break;
      case NodeKind.TypeParameter:
        this.visitTypeParameterNode(<TypeParameterNode>node);
        break;
      case NodeKind.Parameter:
        this.visitParameterNode(<ParameterNode>node);
        break;

      // expressions
      case NodeKind.Identifier:
        this.visitIdentifierExpression(<IdentifierExpression>node);
        break;
      case NodeKind.Assertion:
        this.visitAssertionExpression(<AssertionExpression>node);
        break;
      case NodeKind.Binary:
        this.visitBinaryExpression(<BinaryExpression>node);
        break;
      case NodeKind.Call:
        this.visitCallExpression(<CallExpression>node);
        break;
      case NodeKind.Class:
        this.visitClassExpression(<ClassExpression>node);
        break;
      case NodeKind.Comma:
        this.visitCommaExpression(<CommaExpression>node);
        break;
      case NodeKind.ElementAccess:
        this.visitElementAccessExpression(<ElementAccessExpression>node);
        break;
      case NodeKind.False:
        this.visitFalseExpression(<FalseExpression>node);
        break;
      case NodeKind.Function:
        this.visitFunctionExpression(<FunctionExpression>node);
        break;
      case NodeKind.InstanceOf:
        this.visitInstanceOfExpression(<InstanceOfExpression>node);
        break;
      case NodeKind.Literal:
        this.visitLiteralExpression(<LiteralExpression>node);
        break;
      case NodeKind.New:
        this.visitNewExpression(<NewExpression>node);
        break;
      case NodeKind.Null:
        this.visitNullExpression(<NullExpression>node);
        break;
      case NodeKind.Omitted:
        this.visitOmittedExpression(<OmittedExpression>node);
        break;
      case NodeKind.Parenthesized:
        this.visitParenthesizedExpression(<ParenthesizedExpression>node);
        break;
      case NodeKind.PropertyAccess:
        this.visitPropertyAccessExpression(<PropertyAccessExpression>node);
        break;
      case NodeKind.Ternary:
        this.visitTernaryExpression(<TernaryExpression>node);
        break;
      case NodeKind.Super:
        this.visitSuperExpression(<SuperExpression>node);
        break;
      case NodeKind.This:
        this.visitThisExpression(<ThisExpression>node);
        break;
      case NodeKind.True:
        this.visitTrueExpression(<TrueExpression>node);
        break;
      case NodeKind.Constructor:
        this.visitConstructorExpression(<ConstructorExpression>node);
        break;
      case NodeKind.UnaryPostfix:
        this.visitUnaryPostfixExpression(<UnaryPostfixExpression>node);
        break;
      case NodeKind.UnaryPrefix:
        this.visitUnaryPrefixExpression(<UnaryPrefixExpression>node);
        break;
      case NodeKind.Compiled:
        this.visitCompiledExpression(<CompiledExpression>node);
        break;

      // statements
      case NodeKind.Block:
        this.visitBlockStatement(<BlockStatement>node);
        break;
      case NodeKind.Break:
        this.visitBreakStatement(<BreakStatement>node);
        break;
      case NodeKind.Continue:
        this.visitContinueStatement(<ContinueStatement>node);
        break;
      case NodeKind.Do:
        this.visitDoStatement(<DoStatement>node);
        break;
      case NodeKind.Empty:
        this.visitEmptyStatement(<EmptyStatement>node);
        break;
      case NodeKind.Export:
        this.visitExportStatement(<ExportStatement>node);
        break;
      case NodeKind.ExportDefault:
        this.visitExportDefaultStatement(<ExportDefaultStatement>node);
        break;
      case NodeKind.ExportImport:
        this.visitExportImportStatement(<ExportImportStatement>node);
        break;
      case NodeKind.Expression:
        this.visitExpressionStatement(<ExpressionStatement>node);
        break;
      case NodeKind.For:
        this.visitForStatement(<ForStatement>node);
        break;
      case NodeKind.ForOf:
        this.visitForOfStatement(<ForOfStatement>node);
        break;
      case NodeKind.If:
        this.visitIfStatement(<IfStatement>node);
        break;
      case NodeKind.Import:
        this.visitImportStatement(<ImportStatement>node);
        break;
      case NodeKind.Return:
        this.visitReturnStatement(<ReturnStatement>node);
        break;
      case NodeKind.Switch:
        this.visitSwitchStatement(<SwitchStatement>node);
        break;
      case NodeKind.Throw:
        this.visitThrowStatement(<ThrowStatement>node);
        break;
      case NodeKind.Try:
        this.visitTryStatement(<TryStatement>node);
        break;
      case NodeKind.Variable:
        this.visitVariableStatement(<VariableStatement>node);
        break;
      case NodeKind.Void:
        this.visitVoidStatement(<VoidStatement>node);
        break;
      case NodeKind.While:
        this.visitWhileStatement(<WhileStatement>node);
        break;

      // declaration statements
      case NodeKind.Module:
        this.visitModuleDeclaration(<ModuleDeclaration>node);
        break;
      case NodeKind.ClassDeclaration:
        this.visitClassDeclaration(<ClassDeclaration>node);
        break;
      case NodeKind.EnumDeclaration:
        this.visitEnumDeclaration(<EnumDeclaration>node);
        break;
      case NodeKind.EnumValueDeclaration:
        this.visitEnumValueDeclaration(<EnumValueDeclaration>node);
        break;
      case NodeKind.FieldDeclaration:
        this.visitFieldDeclaration(<FieldDeclaration>node);
        break;
      case NodeKind.FunctionDeclaration:
        this.visitFunctionDeclaration(<FunctionDeclaration>node);
        break;
      case NodeKind.ImportDeclaration:
        this.visitImportDeclaration(<ImportDeclaration>node);
        break;
      case NodeKind.InterfaceDeclaration:
        this.visitInterfaceDeclaration(<InterfaceDeclaration>node);
        break;
      case NodeKind.MethodDeclaration:
        this.visitMethodDeclaration(<MethodDeclaration>node);
        break;
      case NodeKind.NamespaceDeclaration:
        this.visitNamespaceDeclaration(<NamespaceDeclaration>node);
        break;
      case NodeKind.TypeDeclaration:
        this.visitTypeDeclaration(<TypeDeclaration>node);
        break;
      case NodeKind.VariableDeclaration:
        this.visitVariableDeclaration(<VariableDeclaration>node);
        break;

      // special
      case NodeKind.Decorator:
        this.visitDecoratorNode(<DecoratorNode>node);
        break;
      case NodeKind.ExportMember:
        this.visitExportMember(<ExportMember>node);
        break;
      case NodeKind.SwitchCase:
        this.visitSwitchCas(<SwitchCase>node);
        break;
      case NodeKind.IndexSignature:
        this.visitIndexSignatureNode(<IndexSignatureNode>node);
        break;
      case NodeKind.Comment:
        this.visitCommentNode(<CommentNode>node);
        break;
    }
    this.stack.pop();
  }

  getParent(index: u32): Item {
    assert(index < 0);
    return this.stack[this.stack.length - 1 + index];
  }
}
