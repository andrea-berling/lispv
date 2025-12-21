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

		let leaf_call = true;
		for (let child of other_childs)
			if (child.evaluableType == EExpression)
				leaf_call = false;

		let opn = other_childs.length;

		if (!leaf_call) {
			asm.push(`\taddi sp, sp, -${opn * 4}`);
			COMPILER_ENV.saveOnStack = true;
		}

		this.debug_compiler && asm.push(`\t# op ${node.getText(true)}`)

		COMPILER_ENV.push(opn);

		// go through operands backwards so that we dont need to save a0 many times.
		for (let i = opn - 1; i >= 0; i--) {
			asm = asm.concat(EExpression.compile(other_childs[i]));

			if (!leaf_call) {
				let r = COMPILER_ENV.get() as number;
				asm.push(`\tsw a${r}, ${(r-1)* 4}(sp)`)
			}

			COMPILER_ENV.decrease();
		}

		COMPILER_ENV.pop();

		// call
		if (!leaf_call) {
			for (let i = 1; i <= opn; i ++)
				asm.push(`\tlw a${i}, ${(i-1)* 4}(sp)`)
		}
		asm.push(this.jumpLabel(opn));

		let destination_register = COMPILER_ENV.get();

		if (destination_register != 0)
			asm.push(`\tadd a${destination_register}, zero, a0`);

		if (!leaf_call) {
			asm.push(`\taddi sp, sp, ${opn * 4}`);
			COMPILER_ENV.saveOnStack = false;
		}

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
