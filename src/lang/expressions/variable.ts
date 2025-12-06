import { Ast } from "../../parser/ast";
import { GLOBAL_ENV } from "../environment";
import { Evaluable } from "../evaluable";

export class EVariable extends Evaluable {
	name: string = "";
	value: number = 100;

	static evaluate(node: Ast): number {
		let name: string;
		if (!node.literal)
			throw new Error("variable name cannot be empty");

		let value = 10;

		return value;
	}

}
