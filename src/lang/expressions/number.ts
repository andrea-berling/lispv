import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";

export class ENumber extends Evaluable {

	static evaluate(node: Ast): number {
		let value = Number.parseInt(node.literal || "");
		return value;
	}

}
