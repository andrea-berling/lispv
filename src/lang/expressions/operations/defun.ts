import { Ast } from "../../../parser/ast";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EDefun extends EOperation {

	static evaluate(node: Ast): number {

		let { first_child, first_child_type, other_childs } = EExpression.parameters(node);

		return 10;
	}

}