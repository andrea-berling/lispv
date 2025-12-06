import { Ast } from "../../../parser/ast";
import { Evaluable } from "../../evaluable";
import { EExpression } from "../expression";
import { EOperation } from "../operation";
import { EVariable } from "../variable";

export class EDefun extends EOperation {

	static syntax: Evaluable[] = [
		EDefun,
		EVariable,
		EExpression,
		EExpression
	]

	static evaluate(node: Ast): number {

		let { first_child, first_child_type, other_childs } = EExpression.parameters(node);

		if (node.children?.length != this.syntax.length)
			throw new Error("defun <NAME> (args <ARGS...>) (<EXPRESSION>)");

		return 10;
	}

}