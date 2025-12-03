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
		let result = new Ast(this.name, this.level, this.literal);

		function explore(original: Parsed, copy: Ast) {
			for (let child of original.children || []) {
				let childCopy = new Ast(child.name, child.level, child.literal);
				if (copy.children)
					copy.children.push(childCopy);
				explore(child, childCopy);
			}
		}

		explore(this, result);
		return result;
	}

	findFirst(rule: Rule): Parsed | null {
		if (this.name === rule.name) return this;
		for (const child of this.children || []) {
			const found = child.findFirst(rule);
			if (found) return found;
		}
		return null;
	}

	findLast(rule: Rule): Parsed | null {
		if (this.name === rule.name) return this;
		if (!this.children)
			return null;
		for (let i = this.children.length - 1; i >= 0; i--) {
			let child = this.children[i];
			const found = child.findFirst(rule);
			if (found) return found;
		}
		return null;
	}

	findAll(rule: Rule): Parsed[] {
		const results: Parsed[] = [];
		if (this.name === rule.name) results.push(this);
		for (const child of this.children || []) {
			results.push(...child.findAll(rule));
		}
		return results;
	}

	getText(): string {
		if (this.literal)
			return this.literal;
		if (!this.children)
			throw new Error("undefined literal and undefined children")
		return this.children.map(c => c.getText()).join("");
	}
}

export class Ast extends Parsed {
	parent: Ast | undefined = undefined;
	children?: Ast[];

	/**
	 * wipe rules off of the AST, together with its children.
	 */
	remove(...rules: Rule[]) {
		function explore(explored: Ast) {
			if (!explored.children)
				return;

			for (let i = explored.children.length - 1; i >= 0; i--) {
				let child = explored.children[i];
				let shouldRemove = rules.some(rule =>
					(child.name && child.name == rule.name) || (child.literal && child.literal == rule.literal)
				);
				if (shouldRemove) {
					explored.children.splice(i, 1);
				} else {
					explore(child);
				}
			}
		}
		explore(this);
		return this;
	}

	/**
	 * simplify unwanted rules but maintain their children.
	 */
	simplify(...rules: Rule[]) {
		function explore(parent: Ast | null, explored: Ast) {
			if (!explored.children)
				return;

			for (let i = explored.children.length - 1; i >= 0; i--) {
				let child = explored.children[i];
				explore(explored, child);
			}

			let shouldSimplify = rules.some(rule =>
				explored.name && explored.name == rule.name
			);

			if (shouldSimplify && parent && parent.children) {
				let index = parent.children.findIndex(c => c === explored);

				if (index !== -1) {
					parent.children.splice(index, 1, ...explored.children);
				}
			}
		}
		explore(null, this);
		return this;
	}

	/**
	 * collapse wrapper rules to their text. a literal Ast node is added.
	 */
	collapse(...rules: Rule[]) {
		function explore(parent: Ast | null, explored: Ast) {
			if (!explored.children)
				return;

			for (let i = explored.children.length - 1; i >= 0; i--) {
				let child = explored.children[i];
				explore(explored, child);
			}

			let shouldSimplify = rules.some(rule =>
				explored.name && explored.name == rule.name
			);

			if (shouldSimplify && parent && parent.children) {
				let index = parent.children.findIndex(c => c === explored);

				if (index !== -1) {
					let added = new Ast(explored.name, explored.level, explored.getText())
					parent.children.splice(index, 1,);
				}
			}
		}
		explore(null, this);
		return this;
	}

	flatten(): Ast[] {
		let result: Ast[] = [];

		function explore(explored: Ast) {
			if (!explored.children) {
				result.push(explored)
				return;
			}
			for (let child of explored.children)
				explore(child);
		}

		explore(this);

		return result;
	}


}
