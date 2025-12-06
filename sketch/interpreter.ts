import { Parser } from "../src/parser/parser";
import { Traversal } from "../src/lang/traversal"
import { NUMBER, GRAMMAR, EXPRESSION, SPACE, ONE_OR_MORE_SPACES, ZERO_OR_MORE_SPACES, LBRACKET, RBRACKET, OPERATION, FUNCTION, VARIABLE, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION, APPLICATION } from "../src/lang/grammar"
import { GLOBAL_ENV } from "../src/lang/environment";

const p = new Parser(GRAMMAR);
let text = "(defun f (args a b c) (+ a c (- b)))";
// text = "(+ 1 (- 1 2 3) 3)"
// text = "(())"

// p.debug = true;
let result = p.parse(text);

if (result.parsed) {
	let ast = result.parsed.copyAsAst();

	// wipe rules that were added for parsing purposes
	ast.wipe(ONE_OR_MORE_SPACES, LBRACKET, RBRACKET, ZERO_OR_MORE_SPACES)

	// remove picked grammar patterns that are not of use
	ast.simplify(GRAMMAR, OPERATION, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION);

	// collapse the digits of a number in a node of name number, 
	ast.collapse(NUMBER, VARIABLE, FUNCTION);

	console.log(ast);

	let traversal = new Traversal(ast);

	let traversal_result = traversal.start();
	console.log(traversal_result);

	console.log(GLOBAL_ENV)
}
