describe("interpreted", () => {
	test("factorials", () => {

	let source = `
(defun times (args a b) (if (greater b 0) (+ a (times a (+ b (- 1))) ) (0) ))
(defun fact (args a) (if (greater a 0) (times a (fact (+ a (- 1))) ) (1) ))

(0)

(fact 1)
(fact 2)
(fact 3)
(fact 4)
(fact 5)
`

	})
})