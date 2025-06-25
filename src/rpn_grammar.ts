let text = "(+ 1 (+ (+ 1 1) 1)))"

let grammar = `
expression
	operation
	number | expression
	number | expression
`;

let caught = `
expression
	operation
	number
	expression
		operation
		expression
			operation
			number
			number
		number
`