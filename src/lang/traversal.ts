import { Ast } from "../parser/ast";
import { Evaluable } from "./evaluable";

export class Traversal {
	tree: Ast;
	constructor(tree: Ast) {
		this.tree = tree;
	}

	start() {

		function explore(node: Ast) {
			for (let child of node.children || []) {
				explore(child);
			}
			if (node.evaluableType) {
				let evaluator = new (node.evaluableType as any) as Evaluable;
				
				evaluator.evaluate(node);
			}
		}
		explore(this.tree);


	}

}