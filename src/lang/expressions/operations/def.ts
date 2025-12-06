import { Ast } from "../../../parser/ast";
import { EOperation } from "../operation";

export class EDef extends EOperation {

	static evaluate(node: Ast): number {
		return 10;
	}

}
