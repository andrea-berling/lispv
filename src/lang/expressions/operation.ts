import { MAX_PRIMITIVES } from "../../flags";
import { Ast } from "../../parser/ast";
import { COMPILER_ENV } from "../environment";
import { Evaluable } from "../evaluable";
import { EExpression } from "./expression";

export class EOperation extends Evaluable {
	static jumpLabel(_n: number): string {
		throw new Error("not implemented");
	}

	static evaluate(_node: Ast): number {
		throw new Error("not implemented");
	}

	static compile(node: Ast): string[] {

		let asm: string[] = [];

		let { other_childs } = EExpression.parameters(node);

		let opn = other_childs.length;

		this.debug_compiler && asm.push(`\t# op ${node.getText()}`)

		COMPILER_ENV.push(opn);

		// go through operands backwards so that we dont need to save a0 many times.
		for (let i = opn - 1; i >= 0; i--) {

			asm = asm.concat(EExpression.compile(other_childs[i]));

			COMPILER_ENV.decrease();
		}

		COMPILER_ENV.pop();

		asm.push(this.jumpLabel(opn));

		let destination_register = COMPILER_ENV.get();

		if (destination_register != 0)
			asm.push(`\tadd a${destination_register}, zero, a0`);

		return asm;
	}

	static generatePrimitive(_n: number): string {
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
