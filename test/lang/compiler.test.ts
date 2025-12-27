import { Compiler } from "../../src/lang/compiler"
import { Assembler } from "../../src/riscv/assembler";
import { Pipeline } from "../../src/riscv/pipeline";
import { Registers } from "../../src/riscv/register";
import { Interpreter } from "../../src/lang/interpreter";

import "../../src/riscv/instructions/btype"
import "../../src/riscv/instructions/itype"
import "../../src/riscv/instructions/jtype"
import "../../src/riscv/instructions/rtype"
import "../../src/riscv/instructions/stype"
import "../../src/riscv/instructions/utype"

describe("compiled", () => {
	test("value", () => {
		Pipeline.init();

		let source = `
		(1)
		`.split("\n").map(x => x.trim()).filter(x => x != "");

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());
	})

	test("primitives", () => {
		Pipeline.init();

		let source = `
		(+ 1 2)
		`.split("\n").map(x => x.trim()).filter(x => x != "");

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());
	})


	test("defun", () => {
		Pipeline.init();

		let source = `
		(defun plus (args x y z) (+ x y z))
		(plus 1 2 3)
		`.split("\n").map(x => x.trim()).filter(x => x != "");

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());
	})

	test("nested operations", () => {
		Pipeline.init();

		let source = `
		(+ 2 (- 4 5 6) (+ 3 4 (- 1 2 3) 6))
		`

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());
	})

	test("nested operations and applications in call and definition", () => {
		Pipeline.init();

		let source = `
		(defun a (args x) (+ x (+ 2 x x)))
		(a (+ 10 (a 20) (+ 10 (a (+ 10 20) 20) 20)))
		`

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());

	})

	test("triangular numbers 1", () => {
		Pipeline.init();

		let source = `
		(defun f (args a) (if (a) (+ (f (+ a (- 1) )) a ) (0) ) )
		(f 5)
		`

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());

	})

	test("triangular numbers 2", () => {
		Pipeline.init();

		let source = `
		(defun f (args a) (if (a) (+ a (f (+ a (- 1) ))) (0) ) )
		(f 5)
		`

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());

	})

	test("times 1", () => {
		Pipeline.init();

		let source = `
		(defun times (args a b) (if (b) (+ (times a (+ b (- 1))) a ) (0) ))
		(times 3 4)
		`

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());

	})

	test("factorial", () => {
		Pipeline.init();

		let source = `
		(defun times (args a b) (if (b) (+ (times a (+ b (- 1))) a ) (0) ))
		(defun fact (args a) (if (a) (times a (fact (+ a (- 1))) ) (1) ))
		(fact 4)
		`

		let c = new Compiler(source);

		let assembly = c.compile();

		let as = new Assembler(assembly);

		as.parse();

		Pipeline.run();

		let i = new Interpreter(source)

		expect(Registers.parse("a0").value).toBe(i.run());

	})

});
