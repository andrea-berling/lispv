import { Ast } from "../../../parser/ast";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EDef extends EOperation {

	static evaluate(node: Ast): number {
		let { first_child, first_child_type, other_childs } = EExpression.parameters(node);

		if (other_childs.length != 2)
			throw new Error("syntax: def <VARIABLE> <EXPRESSION>")

		let name = other_childs[0].literal;

		let value = EExpression.evaluate(other_childs[1]);

		return value;
	}

}
