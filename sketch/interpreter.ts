import { Parser } from "../src/parser/parser";
import { Traversal } from "../src/lang/traversal"
import { NUMBER, GRAMMAR, ONE_OR_MORE_SPACES, ZERO_OR_MORE_SPACES, LBRACKET, RBRACKET, OPERATION, FUNCTION, VARIABLE, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION } from "../src/lang/grammar"
import { DEBUG, DEBUG_INTERPRETER } from "../src/flags";
import { GLOBAL_ENV } from "../src/lang/environment";

export function main() {

	let debug = DEBUG || DEBUG_INTERPRETER;
	let source = `
;; ricorsione
(defun times (args a b) (if (greater b 0) (+ a (times a (+ b (- 1))) ) (0) ))
(defun fact (args a) (if (greater a 0) (times a (fact (+ a (- 1))) ) (1) ))

(0)

(fact 1)
(fact 2)
(fact 3)
(fact 4)
(fact 5)

(0)

;; passaggio di funzioni come argomento (funtori di 1o ordine)
(defun plus (args a b) (+ a b))
(defun apply (args a b c) (a b c))

(0)

(plus 2 3)
(times 2 3)

(0)

(apply plus 2 3)
(apply times 2 3)

;; creazione di funzioni curry-ed
(0)
(defun create (args x) (defun created (args y) (+ x y)) )
(create 50)
(created 200)
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

			let traversal_result = traversal.start();

			console.log(traversal_result);
		}
	}

	debug && console.log(GLOBAL_ENV)

}
