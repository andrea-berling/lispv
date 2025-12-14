import { Ast } from "../../parser/ast";
import { GLOBAL_ENV } from "../environment";
import { Evaluable } from "../evaluable";

export class EVariable extends Evaluable {
	static evaluate(node: Ast): number {
		let name: string;
		if (!node.literal)
			throw new Error("variable name cannot be empty");

		name = node.literal;

		let value = GLOBAL_ENV.variables.find(name);

		if (value === undefined)
			throw new Error(`variable ${name} undefined at level ${GLOBAL_ENV.variables.current}`);

		return value;
	}

	static compile(node: Ast): string[] {
		let asm: string[] = [ ]

		if (!node.literal)
			throw new Error("variable name cannot be empty");

		asm.push(node.literal);

		return asm;
	}
}
