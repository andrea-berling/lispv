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
	parsed?: Parsed;
	error?: ParseError;
}

export class Parsed {
	name: string = "";
	literal: string = "";
	method: RuleMethod = RuleMethod.Or;
	children: Parsed[] = [];

	findFirst(name: string | Rule): Parsed | null {
		if (name instanceof Rule)
			name = name.name;
		if (this.name === name) return this;
		for (const child of this.children) {
			const found = child.findFirst(name);
			if (found) return found;
		}
		return null;
	}

	findAll(name: string | Rule): Parsed[] {
		if (name instanceof Rule)
			name = name.name;
		const results: Parsed[] = [];
		if (this.name === name) results.push(this);
		for (const child of this.children) {
			results.push(...child.findAll(name));
		}
		return results;
	}

	getText(): string {
		if (this.literal) return this.literal;
		return this.children.map(c => c.getText()).join("");
	}
}

export class Parser {
	rule: Rule;
	private parsed: Parsed;
	debug: boolean = DEBUG;

	constructor(rule: Rule) {
		this.rule = rule;
		this.parsed = new Parsed();
		this.parsed.name = "main";
	}

	parse(text: string): ParseResult {
		let inputLength = text.length;
		const recursiveResult = this.parseRecursive(this.rule, text, this.parsed);
		const fullyParsed = recursiveResult.matched && recursiveResult.remaining.trim() === "";

		let result: ParseResult = {
			matched: fullyParsed,
		}

		if (!result.matched) {
			result.error = {
				position: (inputLength - recursiveResult.remaining.length)
			}
		} else {
			result.parsed = this.parsed;
		}

		return result;
	}

	private parseRecursive(rule: Rule, text: string, parent: Parsed, depth = 0): RecursiveParseResult {
		if (rule.literal) {
			let child = new Parsed();
			child.literal = rule.literal;
			child.name = child.literal;

			let matched = rule.match(text)
			if (matched.matched) {
				parent.children.push(child);
				this.debug && rule.debug(depth);
			}
			return matched;
		}

		if (rule.method === RuleMethod.Or) {
			let child = parent;
			if (rule.name) {
				child = new Parsed();
				child.method = rule.method;
				child.name = rule.name;
			}

			for (const subrule of rule.definition) {

				const result = this.parseRecursive(subrule, text, child, depth + 1);

				if (result.matched) {
					if (rule.name)
						parent.children.push(child);
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
				child = new Parsed();
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
				parent.children.push(child);
			this.debug && rule.debug(depth);
			return { matched: true, remaining: currentText };
		}

		if (rule.method === RuleMethod.ZeroOrMore) {
			let currentText = text;

			let child = parent;
			if (rule.name) {
				child = new Parsed();
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
				parent.children.push(child);
			this.debug && rule.debug(depth);
			return { matched: true, remaining: currentText };
		}

		if (rule.method === RuleMethod.OneOrMore) {
			let currentText = text;
			let matchCount = 0;

			let child = parent;
			if (rule.name) {
				child = new Parsed();
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
				parent.children.push(child);
			this.debug && rule.debug(depth);
			return { matched: true, remaining: currentText };
		}

		return { matched: false, remaining: text };
	}
}
