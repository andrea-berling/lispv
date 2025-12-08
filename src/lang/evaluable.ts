import { Ast } from "../parser/ast";

export abstract class Evaluable {
	static evaluate(node: Ast): number {
		throw new Error("not implemented");
	};
}
