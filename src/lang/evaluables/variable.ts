import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";

export class EVariable extends Evaluable {

	evaluate(node: Ast) {
		// console.log("variable:", node.literal);
	}

}