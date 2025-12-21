import { MAX_PRIMITIVES } from "../../../flags";
import { Ast } from "../../../parser/ast";
import { Primitives } from "../../lib/primitives";
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
		let { other_childs } = EExpression.parameters(node);

		let n_operands = other_childs.length;

		return super.compile(node).concat(`\tjalr ra, -${n_operands}(zero)`)
	}

	static generatePrimitive(n: number): string {
		let primitive = `
-${n}:
	sub a0, zero, zero
`;
		for (let i = 1; i < n + 1; i++) {
			primitive = primitive.concat(`\tsub a0, a0, a${i}\n`);
		}

		return primitive.concat("\tjal ra, 0")
	}

	static {
		Primitives.addToRegistry(this.primitives());
	}
}
