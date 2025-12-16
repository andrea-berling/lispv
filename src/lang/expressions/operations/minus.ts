import { Ast } from "../../../parser/ast";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EMinus extends EOperation {

	static evaluate(node: Ast): number {

		let { other_childs } = EExpression.parameters(node);

		let sum = 0;
		let intermediate: number;

		for (let child of other_childs) {

			if (!child.evaluableType)
				throw new Error("impossible")

			intermediate = child.evaluableType.evaluate(child);
			sum -= intermediate;
		}

		return sum;
	}

	static compile(node: Ast): string[] {
		let asm: string[] = [];

		let { other_childs } = EExpression.parameters(node);

		this.debug_compiler && asm.push(`\t# sub ${node.getText()}`)
		
		asm.push(`\tadd t2, zero, zero`); // set t2 to 0

		for (let child of other_childs) {

			if (!child.evaluableType)
				throw new Error("impossible")

			asm = asm.concat(EExpression.compile(child));
			asm.push(`\tsub t2, t2, a0`);
		}

		return asm;
	}

}