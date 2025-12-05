import { Ast } from "../../parser/ast";
import { GLOBAL_ENV } from "../environment";
import { Evaluable } from "../evaluable";

export class EVariable extends Evaluable {
	name: string = "";

	evaluate(node: Ast): EVariable {
		let name: string;
		if (!node.literal)
			throw new Error("variable name cannot be empty");


		let result = new EVariable();
		name = node.literal;

		return result;
	}

}
