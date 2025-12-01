import { RecursiveParseResult } from "./parser"

export enum RuleMethod {
	ZeroOrMore,
	OneOrMore,
	And,
	Or,
}

export class Rule {
	parent: Rule = this;
	name: string = "";

	method: RuleMethod;
	definition: Rule[] = [];
	literal: string = "";

	private constructor(literal = "") {
		this.method = RuleMethod.Or;
		this.literal = literal;
	}

	define(rules: Rule[]) {
		for (let rule of rules)
			rule.parent = this;
		this.definition = rules;
	}

	debug(depth: number) {
		if (this.name != "" || this.literal != "")
			console.log("  ".repeat(depth) + ((this.name) ? this.name : this.literal))
	}

	match(text: string): RecursiveParseResult {
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

	static literal(text: string): Rule {
		return new Rule(text);
	}

	static or(name: string, ...rules: Rule[]): Rule {
		const r = new Rule();
		r.name = name;
		r.method = RuleMethod.Or;
		r.define(rules);
		return r;
	}

	static and(name: string, ...rules: Rule[]): Rule {
		const r = new Rule();
		r.name = name;
		r.method = RuleMethod.And;
		r.define(rules);
		return r;
	}

	static zeroOrMore(name: string, rule: Rule): Rule {
		const r = new Rule();
		r.name = name;
		r.method = RuleMethod.ZeroOrMore;
		r.define([rule]);
		return r;
	}

	static oneOrMore(name: string, rule: Rule): Rule {
		const r = new Rule();
		r.name = name;
		r.method = RuleMethod.OneOrMore;
		r.define([rule]);
		return r;
	}
}
