import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";

export class EOperation extends Evaluable {
	static evaluate(node: Ast): number {
		throw new Error("not implemented");
	}
}
