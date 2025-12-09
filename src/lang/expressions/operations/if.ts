import { Ast } from "../../../parser/ast";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EIf extends EOperation {
	static evaluate(node: Ast): number {
		let { other_childs } = EExpression.parameters(node);

		if (other_childs.length != 3)
			throw new Error("syntax: if (<condition>) <expression if true> <expression if false>")

		let condition_node = other_childs.at(0);

		if (!condition_node)
			throw new Error("if expression must have a condition")

		let condition = EExpression.evaluate(condition_node);

		let result_node: Ast | undefined;

		if (condition) {
			result_node = other_childs.at(1);
		} else {
			result_node = other_childs.at(2);
		}

		if (!result_node)
			throw new Error("if expression must have a result")

		return EExpression.evaluate(result_node);
	}
}
