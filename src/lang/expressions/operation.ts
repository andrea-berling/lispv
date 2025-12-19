import { MAX_PRIMITIVES } from "../../flags";
import { Ast } from "../../parser/ast";
import { COMPILER_ENV } from "../environment";
import { Evaluable } from "../evaluable";
import { EExpression } from "./expression";

export class EOperation extends Evaluable {
	static evaluate(node: Ast): number {
		throw new Error("not implemented");
	}

	static compile(node: Ast): string[] {

		let asm: string[] = [];
		let atom: string[];

		let { other_childs } = EExpression.parameters(node);

		let opn = other_childs.length;

		this.debug_compiler && asm.push(`\t# op ${node.getText()}`)

		COMPILER_ENV.push(opn - 1);

		// go through operands backwards so that we dont need to save a0 many times.
		for (let i = opn - 1; i >= 0; i--) {

			asm = asm.concat(EExpression.compile(other_childs[i]));

			COMPILER_ENV.decrease();
		}

		COMPILER_ENV.pop();

		return asm;
	}

	static generatePrimitive(n: number): string {
		throw new Error("not implemented");
	}

	static primitives() {
		let primitives = "";

		for (let i = 1; i < MAX_PRIMITIVES; i++) {
			primitives = primitives.concat(this.generatePrimitive(i))
		}

		return primitives;
	}


}
