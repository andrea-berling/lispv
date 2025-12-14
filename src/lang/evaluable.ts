import { Ast } from "../parser/ast";

export abstract class Evaluable {
	static tag?: string;

	static createAst(literal?: string): Ast {
		if (!this.tag)
			throw new Error("cannot make into ast");

		let ast = new Ast(this.tag, literal);
		ast.evaluableType = this;
		return ast;
	}

	static evaluate(_node: Ast): number {
		throw new Error("not implemented");
	};

	static compile(_node: Ast): string[] {
		throw new Error("not implemented");
	}
}
