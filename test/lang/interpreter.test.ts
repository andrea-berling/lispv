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

		let lines_and_answers = i.run();

		let f4 = lines_and_answers.find(x => x.line == "(fact 4)")?.answer

		if (f4 === undefined)
			throw new Error("undefined");

		expect(f4).toBe(24);

	})

	test("functions as arguments", () => {

		let source = `
(defun plus (args a b) (+ a b))
(defun apply (args a b c) (a b c))
(apply plus 2 3)
`
		let i = new Interpreter(source.split("\n"));

		let lines_and_answers = i.run();

		let application = lines_and_answers.find(x => x.line == "(apply plus 2 3)")?.answer

		if (application === undefined)
			throw new Error("undefined");

		expect(application).toBe(5);

	})

	test("currying", () => {

		let source = `
(defun create (args x) (defun created (args y) (+ x y)) )
(create 100)
(created 200)
`
		let i = new Interpreter(source.split("\n"));

		let lines_and_answers = i.run();

		let result = lines_and_answers.find(x => x.line == "(created 200)")?.answer

		if (result === undefined)
			throw new Error("undefined");

		expect(result).toBe(300);

	})
})