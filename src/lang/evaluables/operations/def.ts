import { Ast } from "../../../parser/ast";
import { EOperation } from "../operation";

export class EDef extends EOperation {

	static evaluate(node: Ast): void {
		console.log("evaluating def")
	}

}
