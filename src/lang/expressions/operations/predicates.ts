import { Ast } from "../../../parser/ast";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export abstract class EPredicate extends EOperation {
	static predicate(n1: number, n2: number): number {
		throw new Error("not implemented");
	}

	static evaluate(node: Ast): number {
		let { first_child, other_childs } = EExpression.parameters(node);

		if (other_childs.length != 2)
			throw new Error()

		let o1_node = other_childs.at(0);
		if (!o1_node)
			throw new Error("impossible");

		let o1_et = o1_node.evaluableType;
		if (!o1_et)
			throw new Error("impossible");

		let o2_node = other_childs.at(1);
		if (!o2_node)
			throw new Error("impossible");

		let o2_et = o2_node.evaluableType;
		if (!o2_et)
			throw new Error("impossible");

		let n1 = o1_et.evaluate(o1_node);
		let n2 = o2_et.evaluate(o2_node);

		return this.predicate(n1, n2);
	}
}

export class EEq extends EPredicate {
	static predicate(n1: number, n2: number): number {
		return (n1 == n2) ? 1 : 0;
	}
}

export class EGreater extends EPredicate {
	static predicate(n1: number, n2: number): number {
		return (n1 > n2) ? 1 : 0;
	}
}

export class ELess extends EPredicate {
	static predicate(n1: number, n2: number): number {
		return (n1 < n2) ? 1 : 0;
	}
}

export class ENot extends EPredicate {
	static predicate(n1: number, _: number): number {
		return (n1) ? 1 : 0;
	}
}
