import { Parser } from "../src/parser/parser";
import { Traversal } from "../src/lang/traversal"
import { NUMBER, GRAMMAR, ONE_OR_MORE_SPACES, ZERO_OR_MORE_SPACES, LBRACKET, RBRACKET, OPERATION, FUNCTION, VARIABLE, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION } from "../src/lang/grammar"
import { DEBUG, DEBUG_INTERPRETER } from "../src/flags";
import { GLOBAL_ENV } from "../src/lang/environment";

let debug = DEBUG || DEBUG_INTERPRETER;

// (defun loop (args a b c) (if (greater c 0) (a b (loop a b (+ c (- 1)))) (1) ))
let source = `
(defun loop (args a b c) (if (greater c 0) (a b (loop a b (+ c (- 1)))) (1) ))
(defun plus (args a b c) (+ a b c))
(loop plus 10 3)
`

let lines = source.split("\n");

for (let line of lines) {

	const p = new Parser(GRAMMAR);

	let result = p.parse(line);

	if (result.parsed) {
		let ast = result.parsed.copyAsAst();

		// wipe rules that were added for parsing purposes
		ast.wipe(ONE_OR_MORE_SPACES, LBRACKET, RBRACKET, ZERO_OR_MORE_SPACES)

		// remove picked grammar patterns that are not of use
		ast.simplify(GRAMMAR, OPERATION, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION);

		// collapse the digits of a number in a node of name number, 
		ast.collapse(NUMBER, VARIABLE, FUNCTION);

		debug && console.log(ast);

		let traversal = new Traversal(ast);

		// let traversal_result = traversal.start();
		//
		// console.log(traversal_result);
	}
}

console.log(GLOBAL_ENV)
