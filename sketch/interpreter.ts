import { Parser } from "../src/parser/parser";
import { Traversal } from "../src/lang/traversal"
import { NUMBER, GRAMMAR, ONE_OR_MORE_SPACES, ZERO_OR_MORE_SPACES, LBRACKET, RBRACKET, OPERATION, FUNCTION, VARIABLE, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION } from "../src/lang/grammar"
import { DEBUG, DEBUG_INTERPRETER } from "../src/flags";
import { INTERPRETER_ENV } from "../src/lang/environment";
import { Interpreter } from "../src/lang/interpreter";

export function main() {

	let debug = DEBUG || DEBUG_INTERPRETER;
	let source = `
;; ricorsione
(defun times (args a b) (if (greater b 0) (+ a (times a (+ b (- 1))) ) (0) ))
(defun fact (args a) (if (greater a 0) (times a (fact (+ a (- 1))) ) (1) ))

(fact 1)
(fact 2)
(fact 3)
(fact 4)
(fact 5)

;; passaggio di funzioni come argomento (funtori di 1o ordine)
(defun plus (args a b) (+ a b))
(defun apply (args a b c) (a b c))

(plus 2 3)
(times 2 3)

(apply plus 2 3)
(apply times 2 3)

;; creazione di funzioni curry-ed
(defun create (args x) (defun created (args y) (+ x y)) )
(create 50)
(created 200)

(defun f (args if) (+ if 1))
(f 10)
	`

	let lines = source.split("\n");

	let i = new Interpreter(lines);

	i.log({ includeLines: true });

	console.log(INTERPRETER_ENV)

}
