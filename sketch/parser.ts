import { Rule, RuleMethod } from "../src/parser/rule";
import { Parser, Parsed } from "../src/parser/parser";

const digit = Rule.or(
	"digit",
	..."1234567890".split("").map((x) => Rule.literal(x)),
);
const number = Rule.oneOrMore("number", digit);

const space = Rule.literal(" ");
const spaces = Rule.zeroOrMore("spaces", space);

const lbracket = Rule.literal("(");
const rbracket = Rule.literal(")");

const operation = Rule.or("operation", Rule.literal("+"), Rule.literal("-"));

const base_expression = new Rule();
base_expression.name = "base_expression";

const expression = new Rule();
expression.method = RuleMethod.Or;
expression.define([number, base_expression]);

const one_or_more_expressions = new Rule();
one_or_more_expressions.method = RuleMethod.OneOrMore;
one_or_more_expressions.define([expression, spaces]);

// base expression definition
base_expression.method = RuleMethod.And;
base_expression.define([
	lbracket,
	spaces,
	operation,
	spaces,
	one_or_more_expressions,
	rbracket,
]);

const rpn = new Rule();
rpn.name = "rpn";
rpn.define([expression]);

const p = new Parser(rpn);
p.debug = true;
const text = "(+ 13 2 3 4 (- 1))";

let result = p.parse(text);

console.log(result);

if (result.parsed) {
	let numbers = result.parsed.findAll(number);
	console.log(numbers)
}

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
