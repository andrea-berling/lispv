export enum Method {
	ZeroOrMore,
	OneOrMore,
	And,
	Or,
}

interface ParseResult {
	matched: boolean;
	remaining: string;
}

class Parser {
	rule: Rule;
	constructor(rule: Rule) {
		this.rule = rule;
	}

	parse(text: string): boolean {
		const result = this.parseRecursive(this.rule, text);
		const fullyParsed = result.matched && result.remaining.trim() === "";
		return fullyParsed;
	}

	private parseRecursive(rule: Rule, text: string): ParseResult {
		console.log(`Parsing rule with method ${Method[rule.method]}, text: "${text}"`);

		if (rule.literal) {
			return rule.match(text);
		}

		if (rule.method === Method.Or) {
			for (const subrule of rule.definition) {
				const result = this.parseRecursive(subrule, text);
				if (result.matched) {
					return result;
				}
			}
			return { matched: false, remaining: text };
		}

		if (rule.method === Method.And) {
			let currentText = text;
			for (const subrule of rule.definition) {
				const result = this.parseRecursive(subrule, currentText);
				if (!result.matched) {
					return { matched: false, remaining: text };
				}
				currentText = result.remaining;
			}
			return { matched: true, remaining: currentText };
		}

		if (rule.method === Method.ZeroOrMore) {
			let currentText = text;
			while (true) {
				let allMatched = true;
				let tempText = currentText;

				for (const subrule of rule.definition) {
					const result = this.parseRecursive(subrule, tempText);
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
			return { matched: true, remaining: currentText };
		}

		if (rule.method === Method.OneOrMore) {
			let currentText = text;
			let matchCount = 0;

			while (true) {
				let allMatched = true;
				let tempText = currentText;

				for (const subrule of rule.definition) {
					const result = this.parseRecursive(subrule, tempText);
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
			return { matched: true, remaining: currentText };
		}

		return { matched: false, remaining: text };
	}
}

class Rule {
	parent: Rule = this;
	method: Method;
	definition: Rule[] = [];
	caught: Rule[] = [];
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
const adjective = new Rule();
adjective.method = Method.Or;
adjective.define([new Rule("wow"), new Rule("many"), new Rule("so"), new Rule("such")]);

const noun = new Rule();
noun.method = Method.Or;
noun.define([new Rule("lisp"), new Rule("language"), new Rule("book"), new Rule("build"), new Rule("c")]);

const spaces = new Rule();
spaces.method = Method.OneOrMore;
spaces.define([new Rule(" ")]);

const phrase = new Rule();
phrase.method = Method.And;
phrase.define([adjective, spaces, noun]);

const doge = new Rule();
doge.method = Method.ZeroOrMore;
doge.define([phrase, spaces]);

// Test the parser
const p = new Parser(doge);
const text = "such   book wow   lisp ";

try {
	const success = p.parse(text);
	console.log("Parse successful:", success);
} catch (e) {
	console.log("Parse error:", e);
}