import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";
import { ENumber } from "./number";
import { EVariable } from "./variable";

export class EExpression implements Evaluable {

	value?: number;
	context: any;

	static evaluate(node: Ast): number {
		// empty expression
		if (!node.children)
			return 0;

		let first_child = node.children.at(0);

		if (!first_child)
			return 0;

		let first_child_type = first_child.evaluableType;

		if (!first_child_type)
			throw new Error("impossible")

		if (first_child_type === ENumber) {
			return ENumber.evaluate(first_child);
		}

		if (first_child_type === EVariable) {
			return EVariable.evaluate(first_child);
		}
		return 1;
	}

}
