import { Ast } from "../parser/ast";
import { EExpression } from "./expressions/expression";

export class Traversal {
	tree: Ast;

	constructor(tree: Ast) {
		this.tree = tree;

		if (!this.tree.children)
			throw new Error("impossible");

		if (this.tree.children.at(0)?.name != "expression") {
			let base_expression = new Ast("expression");
			base_expression.evaluableType = EExpression;
			base_expression.children = this.tree.children;
			base_expression.parent = this.tree;
			this.tree.children = [base_expression];
		}
		console.log(this.tree);
	}

	start() {
		function explore(node: Ast): number | undefined {
			if (node.evaluableType === EExpression) {
				return (node.evaluableType as typeof EExpression).evaluate(node);
			}

			for (const child of node.children || []) {
				const res = explore(child);
				if (res !== undefined) return res;
			}

			return undefined;
		}

		const result = explore(this.tree);

		if (result === undefined)
			throw new Error("must have at least one expression");

		console.log(result);
	}

}
