import { Ast } from "../parser/ast";
import { Parser } from "../parser/parser";
import { EExpression } from "./expressions/expression";
import { GRAMMAR, ONE_OR_MORE_SPACES, LBRACKET, RBRACKET, ZERO_OR_MORE_SPACES, OPERATION, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION, NUMBER, VARIABLE, FUNCTION } from "./grammar";

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
	}

	start(): number {
		function explore(node: Ast): number | undefined {
			if (node.evaluableType === EExpression) {
				return EExpression.evaluate(node);
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

		return result;
	}

	static cleanAst(line: string) {

		const p = new Parser(GRAMMAR);

		let result = p.parse(line);

		if (result.parsed) {
			let ast = result.parsed.copyAsAst();

			// wipe rules that were added for parsing purposes
			ast.wipe(ONE_OR_MORE_SPACES, LBRACKET, RBRACKET, ZERO_OR_MORE_SPACES)

			// remove picked grammar patterns that are not of use
			ast.simplify(GRAMMAR, OPERATION, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION);

			// collapse the digits of a number in a node of name number, 
			ast.collapse(NUMBER, VARIABLE, FUNCTION);

			return ast;
		}
	}

}
