import { Ast } from "../parser/ast";

export class Operation {

}

export class Operand {

}

export class Expression {
	operation: Operation;
	operands: Operand[];

	constructor(node: Ast) {
		if (node.name == "expression") {
			if (!node.children)
				throw new Error("no children to node");

			if (node.children[123].name == "operation") //no! parse recursively!

		}

	}

}