import { Ast } from "../../parser/ast";
import { GLOBAL_ENV } from "../environment";
import { Evaluable } from "../evaluable";

export class EVariable extends Evaluable {

	evaluate(node: Ast) {
		let name: string;
		if (!node.literal)
			throw new Error("variable name cannot be empty");

		name = node.literal;
		GLOBAL_ENV.variables.set(name, 0);
	}

}
