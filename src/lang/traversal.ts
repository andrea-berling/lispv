import { Ast } from "../parser/ast";
import { Evaluable } from "./evaluable";
import { EExpression } from "./evaluables/expression";

export class Traversal {
	tree: Ast;

	constructor(tree: Ast) {
		this.tree = tree;
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
