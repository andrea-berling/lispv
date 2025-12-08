import { Ast } from "../../../parser/ast";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EIf extends EOperation {
	static evaluate(node: Ast): number {
		let { first_child, other_childs } = EExpression.parameters(node);

		if (other_childs.length != 3)
			throw new Error("syntax: if (<condition>) <expression if true> <expression if false>")

		let condition_node = other_childs.at(0);
		
		if (!condition_node)
			throw new Error("impossible")

		return 100;
	}
}
