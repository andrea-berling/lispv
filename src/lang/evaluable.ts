import { Ast } from "../parser/ast";

export abstract class Evaluable {
	constructor(...args: any[]) { }

	static evaluate(node: Ast) { 

		console.log("falling back", node);

	};
}
