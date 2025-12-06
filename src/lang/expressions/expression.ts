import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";
import { EXPRESSION, NUMBER, VARIABLE } from "../grammar";
import { EApplication } from "./application";
import { ENumber } from "./number";
import { EOperation } from "./operation";
import { EVariable } from "./variable";

export class EExpression implements Evaluable {

	value?: number;
	context: any;

	static parameters(node: Ast): { first_child: Ast, first_child_type: typeof Evaluable, other_childs: Ast[] } {
		if (!node.children)
			throw new Error("no children");

		let first_child = node.children.at(0);

		if (!first_child)
			throw new Error("no first child");

		let first_child_type = first_child.evaluableType;

		if (!first_child_type)
			throw new Error("impossible");

		return { first_child, first_child_type, other_childs: node.children.slice(1) }
	}

	static evaluate(node: Ast): number {

		let { first_child, first_child_type } = EExpression.parameters(node);

		switch (first_child_type) {

			case ENumber: {
				return ENumber.evaluate(first_child);
			}

			case EVariable: {
				return EVariable.evaluate(first_child);
			}

			case EExpression: {
				return EExpression.evaluate(first_child);
			}

			case EApplication: {
				return EApplication.evaluate(first_child);
			}

		}


		return 1;
	}

}
