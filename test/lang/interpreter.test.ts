import { Interpreter } from "../../src/lang/interpreter"

describe("interpreter", () => {
	test("factorials", () => {

		let source = `
(defun times (args a b) (if (greater b 0) (+ a (times a (+ b (- 1))) ) (0) ))
(defun fact (args a) (if (greater a 0) (times a (fact (+ a (- 1))) ) (1) ))

(0)

(fact 4)
`
		let i = new Interpreter(source.split("\n"));

		let f4 = i.runAndGetAnswerFromLine("(fact 4)");

		expect(f4).toBe(24);
	})

	test("functions as arguments", () => {

		let source = `
(defun plus (args a b) (+ a b))
(defun apply (args a b c) (a b c))
(apply plus 2 3)
`
		let i = new Interpreter(source.split("\n"));

		let application = i.runAndGetAnswerFromLine("(apply plus 2 3)");

		expect(application).toBe(5);

	})

	test("currying", () => {

		let source = `
(defun create (args x) (defun created (args y) (+ x y)) )
(create 100)
(created 200)
`
		let i = new Interpreter(source.split("\n"));

		let result = i.runAndGetAnswerFromLine("(created 200)");

		expect(result).toBe(300);

	})
})