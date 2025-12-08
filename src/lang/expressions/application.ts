import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";
import { EExpression } from "./expression";
import { EOperation } from "./operation";

export class EApplication extends Evaluable {

	static evaluate(node: Ast): number {

		let { first_child_type } = EExpression.parameters(node);

		if (!(first_child_type.prototype instanceof EOperation)) {
			throw new Error("invalid operation");
		}

		return first_child_type.evaluate(node);
	}

}
