import { Rule, RuleMethod } from "./rule";
import { DEBUG_PARSER } from "../flags";

const DEBUG = DEBUG_PARSER;

export interface ParseError {
	position: number;
}

export interface RecursiveParseResult {
	matched: boolean;
	remaining: string;
}

export interface ParseResult {
	matched: boolean;
	error?: ParseError;
}

export class Caught {
	name: string = "";
	literal: string = "";
	method: RuleMethod = RuleMethod.Or;
	caught: Caught[] = [];

	findFirst(name: string): Caught | null {
		if (this.name === name) return this;
		for (const child of this.caught) {
			const found = child.findFirst(name);
			if (found) return found;
		}
		return null;
	}

	findAll(name: string): Caught[] {
		const results: Caught[] = [];
		if (this.name === name) results.push(this);
		for (const child of this.caught) {
			results.push(...child.findAll(name));
		}
		return results;
	}

	getText(): string {
		if (this.literal) return this.literal;
		return this.caught.map(c => c.getText()).join("");
	}
}

export class Parser {
	rule: Rule;
	caught: Caught;
	debug: boolean = DEBUG;

	constructor(rule: Rule) {
		this.rule = rule;
		this.caught = new Caught();
		this.caught.name = "main";
	}

	parse(text: string): ParseResult {
		let inputLength = text.length;
		const recursiveResult = this.parseRecursive(this.rule, text, this.caught);
		const fullyParsed = recursiveResult.matched && recursiveResult.remaining.trim() === "";

		let result: ParseResult = {
			matched: fullyParsed,
		}

		if (!fullyParsed) {
			result.error = {
				position: (inputLength - recursiveResult.remaining.length)
			}
		}

		return result;
	}

	private parseRecursive(rule: Rule, text: string, parent: Caught, depth = 0): RecursiveParseResult {
		if (rule.literal) {
			let child = new Caught();
			child.literal = rule.literal;
			child.name = child.literal;

			let matched = rule.match(text)
			if (matched.matched) {
				parent.caught.push(child);
				this.debug && rule.debug(depth);
			}
			return matched;
		}

		if (rule.method === RuleMethod.Or) {
			let child = parent;
			if (rule.name) {
				child = new Caught();
				child.method = rule.method;
				child.name = rule.name;
			}

			for (const subrule of rule.definition) {

				const result = this.parseRecursive(subrule, text, child, depth + 1);

				if (result.matched) {
					if (rule.name)
						parent.caught.push(child);
					this.debug && rule.debug(depth);
					return result;
				}
			}

			return { matched: false, remaining: text };
		}

		if (rule.method === RuleMethod.And) {
			let currentText = text;

			let child = parent;
			if (rule.name) {
				child = new Caught();
				child.method = rule.method;
				child.name = rule.name;
			}

			for (const subrule of rule.definition) {

				const result = this.parseRecursive(subrule, currentText, child, depth + 1);

				if (!result.matched) {
					return { matched: false, remaining: text };
				}
				currentText = result.remaining;
			}

			if (rule.name)
				parent.caught.push(child);
			this.debug && rule.debug(depth);
			return { matched: true, remaining: currentText };
		}

		if (rule.method === RuleMethod.ZeroOrMore) {
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

					const result = this.parseRecursive(subrule, tempText, child, depth + 1);

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
			this.debug && rule.debug(depth);
			return { matched: true, remaining: currentText };
		}

		if (rule.method === RuleMethod.OneOrMore) {
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

					const result = this.parseRecursive(subrule, tempText, child, depth + 1);

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
			this.debug && rule.debug(depth);
			return { matched: true, remaining: currentText };
		}

		return { matched: false, remaining: text };
	}
}

// Grammar definition

// const digit = new Rule();
// digit.define([new Rule("0"), new Rule("1"), new Rule("2"), new Rule("3"), new Rule("4"), new Rule("5"), new Rule("6"), new Rule("7"), new Rule("8"), new Rule("9")])

// const number = new Rule();
// number.name = "number";
// number.method = RuleMethod.OneOrMore;
// number.define([digit])

// const space = new Rule();
// space.define([new Rule(" ")]);

// const spaces = new Rule();
// spaces.method = RuleMethod.ZeroOrMore;
// spaces.define([space]);

// const lbracket = new Rule();
// lbracket.define([new Rule("(")])

// const rbracket = new Rule();
// rbracket.define([new Rule(")")])

// const operation = new Rule();
// operation.name = "operation";
// operation.define([new Rule("+"), new Rule("-"), new Rule("*"), new Rule("/")])

// const expression = new Rule();
// const base_expression = new Rule();
// base_expression.name = "base expression";

// expression.method = RuleMethod.Or
// expression.define([number, base_expression])

// const one_or_more_expressions = new Rule();
// one_or_more_expressions.method = RuleMethod.OneOrMore
// one_or_more_expressions.define([expression, spaces])

// base_expression.method = RuleMethod.And;
// base_expression.define([lbracket, spaces, operation, spaces, one_or_more_expressions, rbracket])

// const rpn = new Rule();
// rpn.name = "rpn";
// rpn.define([expression])

// // Test the parser
// const p = new Parser(rpn);
// const text = "(+ 13 2 3 4 (- 1))";

// export class Interpreter {
// 	p: Parser;
// 	execute: (caugt: Caught) => number = function () { return 0; };

// 	constructor(p: Parser) {
// 		this.p = p;
// 	}

// 	run() {
// 		let result = this.execute(this.p.caught);
// 		return result;
// 	}
// }

// const i = new Interpreter(p);


// i.execute = (c: Caught): number => {
// 	// Se è un numero letterale, restituiscilo
// 	if (c.name === number.name) {
// 		let digits = c.caught.map(ch => ch.literal).join('');
// 		return Number.parseInt(digits);
// 	}

// 	// Se è una base_expression, estrai op e valuta gli argomenti
// 	if (c.name === base_expression.name) {
// 		// Trova il nome dell'operazione (es: "+")
// 		let opNode = c.caught.find(x => x.name === operation.name);
// 		let op = opNode ? opNode.caught[0].name : "";

// 		// Trova tutte le sub-espressioni figlie (espressioni numeriche o altre base_expression)
// 		let args: number[] = [];

// 		for (let child of c.caught) {
// 			if (child.name === expression.name || child.name === base_expression.name || child.name === number.name) {
// 				args.push(i.execute(child));
// 			}
// 		}

// 		// Applica l’operazione
// 		let result = (op === "*" || op === "/") ? 1 : 0;

// 		for (let n of args) {
// 			if (op === "+") result += n;
// 			else if (op === "-") result -= n;
// 			else if (op === "*") result *= n;
// 			else if (op === "/") result /= n;
// 		}

// 		return result;
// 	}

// 	// Se è un wrapper (tipo expression), scendi nei figli
// 	if (c.caught.length === 1) {
// 		return i.execute(c.caught[0]);
// 	}

// 	// Caso di fallback: somma tutti i figli interpretabili
// 	let res = 0;
// 	for (let child of c.caught) {
// 		res += i.execute(child);
// 	}
// 	return res;
// }

// try {
// 	const success = p.parse(text);
// 	console.log(p.caught);
// 	console.log("Parse successful:", success);
// 	console.log(i.run())
// } catch (e) {
// 	console.log("Parse error:", e);
// }
