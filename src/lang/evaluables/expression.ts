import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";

export class EExpression extends Evaluable {
	value?: number;

	static evaluate(node: Ast): number {
		return 1;
	}
}
