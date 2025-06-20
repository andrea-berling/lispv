export enum Method {
	ZeroOrMore,
	OneOrMore,
	And,
	Or,
}

class Parser {
	rule: Rule;

	constructor(rule: Rule) {
		this.rule = rule;
	}

	parse(text: string) {

		const dfs = (rule: Rule) => {

			console.log(text)

			if (rule.literal) {
				let match = rule.match(text);
				return { matched: match.matched, text: match.text };
			}

			if (rule.method == Method.Or) {
				let found = false;
				for (const subrule of rule.definition) {
					if (dfs(subrule)) {
						found = true;
						break;
					}
				}
				if (!found)
					throw new Error("not Or")
			}

			// for And rules we need to make sure that every one of the subrules is matched
			if (rule.method == Method.And) {
				let matched = 0;
				for (const subrule of rule.definition) {
					if (dfs(subrule))
						matched++;
				}
				if (matched != rule.definition.length)
					throw new Error("not And");
			}

			if (rule.method == Method.ZeroOrMore) {
				let running = true;
				while (running) {
					for (const subrule of rule.definition) {
						running = dfs(subrule);
					}
				}
			}

			if (rule.method == Method.OneOrMore) {
				let running = true;
				let matched = 0;
				while (running) {
					for (const subrule of rule.definition) {
						running = dfs(subrule);
					}
					if (running)
						matched++;
				}
				if (matched == 0)
					throw new Error("not OneOrMore")
			}

			return true;
		}

		dfs(this.rule);

		console.log("parsed: ", text == "");
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

	match(text: string) {
		if (this.literal) {
			// if we can find the match as the first subword of the text, lets trim the 
			if (text.indexOf(this.literal) == 0) {
				return { matched: true, text: text.replace(this.literal, "") };
			}
		}
		return { matched: false, text: text };
	}
}

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
doge.define([phrase]);

const p = new Parser(doge); // TODO

const text = "such book"

try {
	p.parse(text)
	console.log(p);
}
catch (e) {
	console.log(e);
}

