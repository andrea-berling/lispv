import { Ast } from "../../../parser/ast";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EPlus extends EOperation {

	static evaluate(node: Ast): number {

		let { other_childs } = EExpression.parameters(node);

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

	static compile(node: Ast): string[] {
		let asm: string[] = [];
		let intermediate: string[];

		let { other_childs } = EExpression.parameters(node);

		this.debug_compiler && asm.push(`\t# add ${node.getText()}`)

		asm.push(`\tadd t2, zero, zero`); // set t2 to 0

		for (let child of other_childs) {

			if (!child.evaluableType)
				throw new Error("impossible")

			intermediate = EExpression.compile(child)
			asm = asm.concat(intermediate);
			asm.push(`\tadd t2, t2, a0`);
		}

		return asm;
	}

	static primitives() {
		return `
+1:
	add a0, zero, a0
	jal ra, 0
+2:
	add a0, a0, a1
	jal ra, 0
`
	}

	static {
		// Primitives.addToRegistry(this.primitives());
	}

}
