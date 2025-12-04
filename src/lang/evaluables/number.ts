import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";

export class ENumber extends Evaluable {

	evaluate(node: Ast) {
		console.log(Number.parseInt(node.literal || ""));
	}

}