const DEBUG = true;

export enum Method {
	ZeroOrMore,
	OneOrMore,
	And,
	Or,
}

export interface ParseResult {
	matched: boolean;
	remaining: string;
}

export class Caught {
	name: string = "";
	literal: string = "";
	method: Method = Method.Or;
	caught: Caught[] = [];
}

export class Parser {
	rule: Rule;
	caught: Caught;

	constructor(rule: Rule) {
		this.rule = rule;
		this.caught = new Caught();
		this.caught.name = "main";
	}

	parse(text: string): boolean {
		const result = this.parseRecursive(this.rule, text, this.caught);
		const fullyParsed = result.matched && result.remaining.trim() === "";
		return fullyParsed;
	}

	private parseRecursive(rule: Rule, text: string, parent: Caught): ParseResult {
		if (rule.literal) {
			let child = new Caught();
			child.literal = rule.literal;
			child.name = child.literal;

			let matched = rule.match(text)
			if (matched.matched) {
				parent.caught.push(child);
				DEBUG && rule.debug();
			}
			return matched;
		}

		if (rule.method === Method.Or) {
			let child = parent;
			if (rule.name) {
				child = new Caught();
				child.method = rule.method;
				child.name = rule.name;
			}

			for (const subrule of rule.definition) {

				const result = this.parseRecursive(subrule, text, child);

				if (result.matched) {
					if (rule.name)
						parent.caught.push(child);
					DEBUG && rule.debug();
					return result;
				}
			}

			return { matched: false, remaining: text };
		}

		if (rule.method === Method.And) {
			let currentText = text;

			let child = parent;
			if (rule.name) {
				child = new Caught();
				child.method = rule.method;
				child.name = rule.name;
			}

			for (const subrule of rule.definition) {

				const result = this.parseRecursive(subrule, currentText, child);

				if (!result.matched) {
					return { matched: false, remaining: text };
				}
				currentText = result.remaining;
			}

			if (rule.name)
				parent.caught.push(child);
			DEBUG && rule.debug();
			return { matched: true, remaining: currentText };
		}

		if (rule.method === Method.ZeroOrMore) {
			let currentText = text;

			let child = parent;
			if (rule.name) {
				child = new Caught();
				child.method = rule.method;
				child.name = rule.name;
			}

			while (true) {
				let allMatched = true;
				let tempText = currentText;

				for (const subrule of rule.definition) {

					const result = this.parseRecursive(subrule, tempText, child);

					if (!result.matched) {
						allMatched = false;
						break;
					}
					tempText = result.remaining;
				}

				if (!allMatched || tempText === currentText) {
					// No progress made, stop
					break;
				}
				currentText = tempText;
			}

			if (rule.name)
				parent.caught.push(child);
			DEBUG && rule.debug();
			return { matched: true, remaining: currentText };
		}

		if (rule.method === Method.OneOrMore) {
			let currentText = text;
			let matchCount = 0;

			let child = parent;
			if (rule.name) {
				child = new Caught();
				child.method = rule.method;
				child.name = rule.name;
			}

			while (true) {
				let allMatched = true;
				let tempText = currentText;

				for (const subrule of rule.definition) {

					const result = this.parseRecursive(subrule, tempText, child);

					if (!result.matched) {
						allMatched = false;
						break;
					}
					tempText = result.remaining;
				}

				if (!allMatched || tempText === currentText) {
					// No progress made, stop
					break;
				}
				currentText = tempText;
				matchCount++;
			}

			if (matchCount === 0) {
				return { matched: false, remaining: text };
			}

			if (rule.name)
				parent.caught.push(child);
			DEBUG && rule.debug();
			return { matched: true, remaining: currentText };
		}

		return { matched: false, remaining: text };
	}
}

export class Rule {
	parent: Rule = this;
	name: string = "";
	method: Method;
	definition: Rule[] = [];
	literal: string = "";

	constructor(literal = "") {
		this.method = Method.Or;
		this.literal = literal;
	}

	define(rules: Rule[]) {
		for (let rule of rules)
			rule.parent = this;
		this.definition = rules;
	}

	debug() {
		if (this.name) {
			console.log("matched named rule", this.name);
		}

		if (this.literal) {
			console.log("matched literal rule", this.literal);
		}
	}

	match(text: string): ParseResult {
		if (this.literal) {
			if (text.startsWith(this.literal)) {
				return {
					matched: true,
					remaining: text.substring(this.literal.length)
				};
			}
		}
		return { matched: false, remaining: text };
	}
}

// Grammar definition

const digit = new Rule();
digit.define([new Rule("0"), new Rule("1"), new Rule("2"), new Rule("3"), new Rule("4"), new Rule("5"), new Rule("6"), new Rule("7"), new Rule("8"), new Rule("9")])

const number = new Rule();
number.name = "number";
number.method = Method.OneOrMore;
number.define([digit])

const space = new Rule();
space.define([new Rule(" ")]);

const spaces = new Rule();
spaces.method = Method.ZeroOrMore;
spaces.define([space]);

const lbracket = new Rule();
lbracket.define([new Rule("(")])

const rbracket = new Rule();
rbracket.define([new Rule(")")])

const operation = new Rule();
operation.name = "operation";
operation.define([new Rule("+"), new Rule("-"), new Rule("*"), new Rule("/")])

const expression = new Rule();
// expression.name = "expression";
const base_expression = new Rule();
base_expression.name = "base expression";

expression.method = Method.Or
expression.define([number, base_expression])

const one_or_more_expressions = new Rule();
one_or_more_expressions.method = Method.OneOrMore
one_or_more_expressions.define([expression, spaces])

base_expression.method = Method.And;
base_expression.define([lbracket, spaces, operation, spaces, one_or_more_expressions, rbracket])

const rpn = new Rule();
rpn.name = "rpn";
rpn.define([expression])

// Test the parser
const p = new Parser(rpn);
const text = "(+ (- 3 (+ 432 (+ 1 2) (+ 1 2 3))) 2)";

try {
	const success = p.parse(text);
	console.log("Parse successful:", success);
	console.log(p.caught)
} catch (e) {
	console.log("Parse error:", e);
}