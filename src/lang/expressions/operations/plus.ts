import { Ast } from "../../../parser/ast";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EPlus extends EOperation {

	static evaluate(node: Ast): number {

		let { first_child, first_child_type, other_childs } = EExpression.parameters(node);

		let sum = 0;
		let intermediate: number;

		for (let child of other_childs) {

			if (!child.evaluableType)
				throw new Error("impossible")

			intermediate = child.evaluableType.evaluate(child);
			sum += intermediate;
		}

		return sum;
	}

}