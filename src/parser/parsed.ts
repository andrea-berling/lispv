import { Ast } from "./ast";
import { Rule } from "./rule";

export class Parsed {
	name: string
	level: number;
	literal?: string;
	children?: Parsed[];

	constructor(name: string, level: number, literal?: string) {
		this.name = name;
		this.level = level;
		this.literal = literal;
		if (!this.literal)
			this.children = [];
	}

	copyAsAst() {
		let result = new Ast(this.name, this.literal);

		function explore(original: Parsed, copy: Ast) {
			for (let child of original.children || []) {
				let childCopy = new Ast(child.name, child.literal);
				if (copy.children)
					copy.children.push(childCopy);
				explore(child, childCopy);
			}
		}

		explore(this, result);
		return result;
	}

}