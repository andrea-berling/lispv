import { Rule, RuleMethod } from "../src/parser/rule";
import { Parser } from "../src/parser/parser";
import { number, grammar, expression, space, spaces, optional_spaces, lbracket, rbracket, one_or_more_expressions } from "../src/grammar/definitions"

const p = new Parser(grammar);
const text = "(+ 1 2 (- 3 4 5) 34)";

let result = p.parse(text);

if (result.parsed) {
	let be = result.parsed.findFirst(expression);
	if (be) {
		console.log(be.getText())

		let ast = be.copyAsAst().remove(spaces, lbracket, rbracket, optional_spaces);

		ast = ast.simplify(one_or_more_expressions);

		ast = ast.collapse(number);

		console.log(ast);

		console.log(JSON.stringify(ast));

		// ast.children = ast.flatten();
		// usare sto coso per accorpare i digit di number
	}
}
