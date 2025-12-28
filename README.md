# Lispv - a didactic lisp-like language that compiles to rv32i assembly

This is a Typescript project and is comprised of 4 main packages:

- `src/riscv`: an implementation of a simulator for a risc cpu.
- `src/parser`: a context-free-grammar parser combinator library.
- `src/lang`: a lisp programming language, comprehensive of an interpreter and a compiler.
- `frontend`: a vue application that let the user play with the language, and the simulator.

## Riscv simulator

Despite only implementing 37/40[^missing-instructions] instructions of the official [rv32i specification](https://riscv.atlassian.net/wiki/spaces/HOME/pages/16154769/RISC-V+Technical+Specifications), the code for this simulator was designed to be extensible.

[^missing-instructions]: ECALL, EFENCE and EBREAK are not implemented.

Here is an example of a custom instruction that can be added to the `InstructionRegistry`, with the provided static block[^jest-decorator-error]. For every instruction defined of the ISA, we have a class that extends `Instruction`. The _mnemonic_ for the instruction is here called `tag` for better ease. The custom instruction is extending `RTypeInstruction`, from which it inherits the 7 bit `opcode`.

[^jest-decorator-error]: For the fact that we are using Jest for unit testing, I've found problems with typescript decorators. [Related issue](https://github.com/jestjs/jest/issues/15890).

```typescript

abstract class RTypeInstruction extends Instruction {/* ... */}

export class CustomInstruction extends RTypeInstruction {
	static tag = "cust";
	static f3 = 0b101;
	static f7 = 0b1010101;

	execute(): void {
		// what the instruction should do, given the Registers this.destination, this.source1, this.source2
	}

	static {
		InstructionRegistry.register(this);
	}
}
```

With the custom instruction added to the registry and `f3` and `f7` fields defined, the instruction can be encoded and decoded from and a to a 32 bit representation (a js `number`), with the methods:

- `static Instruction.decode(number): Instruction` turns a number in an instance of the specific custom instruction class it belongs to.
- `Instruction.encode(): number` is the instance method that returns a number.

Every instruction is also represented by a js `string`, such as `"cust i1, i2, i3"`. The following methods translate back and forth from a string representation to an object representation:

- `static Instruction.factoryFromAssembly(string): Instruction` from string to object.
- `Instruction.disassemble(): string` from object to string.

The string representation is used in the `Assembler`, which supports labels, comments and register asliases, as for this example:

```assembly
# fibonacci
	addi i10, i0, 0
	addi i11, i0, 1
	addi i1, i0, 40 # i1 = 40
loop:
	addi i1, i1, -4 # i -= 4
	add i12, i0, i11
	add i11, i11, i10
	add i10, i0, i12
	sw i10, 0x100(i1) # 0xff is the base address of the array, of size 4B and length 10
	bne i1, i0, loop # while i1 > 0
```

The number representation is written to `Memory`.

```
0x00000000: 0x0040006f (4194415) [jal i0, 4]
0x00000004: 0x00000513 (1299) [addi i10, i0, 0]
0x00000008: 0x00100593 (1050003) [addi i11, i0, 1]
0x0000000c: 0x02800093 (41943187) [addi i1, i0, 40]
0x00000010: 0xffc08093 (-4161389) [addi i1, i1, -4]
0x00000014: 0x00b00633 (11535923) [add i12, i0, i11]
0x00000018: 0x00a585b3 (10847667) [add i11, i11, i10]
0x0000001c: 0x00c00533 (12584243) [add i10, i0, i12]
0x00000020: 0x10a0a023 (278962211) [sw i10, 256(i1)]
0x00000024: 0xfe0096e3 (-33515805) [bne i1, i0, -20]
```

Executable code can be run in the `Pipeline`.

```typescript
Pipeline.init();
let instructions = `
...
`
let as = new Assembler(instructions.split("\n"));
as.parse();
Pipeline.run();
Registers.show();
```

And the `Registers` can be inspected.

## Parser

We included a [parser-combinator](https://en.wikipedia.org/wiki/Parser_combinator) library that allows for the definition of `Rule`s in a _context-free_ grammar. It takes both a _grammar_ rule and a _text_ (a js `string`) as input and works like this:

- Rules can be literals that match the text by checking string equality.
- Rules can be _combined_ with the following methods:
	- `ZeroOrMore` that will match a rule if it is repeated 0 or more times, like `*` in regular expressions.
	- `And` that will match the text if all rules are respected, in order.
	- `Or` that will match the text if any one of the rules is respected.
	- `OneOrMore` that is simply an _and_ with a rule and a _zero or more_ of that very rule.
- The parser _backtracks_ for alternatives.
- an `Ast` (_abstract syntax tree_) is returned if the text matches the grammar.
- errors are reported at the precise location where the text started not to match the grammar, if it did so.

The `Ast` 



## Lang

### Interpreter

Recursion:

```lisp
(defun times (args a b) (if (greater b 0) (+ a (times a (+ b (- 1))) ) (0) ))
(defun fact (args a) (if (greater a 0) (times a (fact (+ a (- 1))) ) (1) ))
(fact 4)
```

Functions as arguments:

```lisp
(defun plus (args a b) (+ a b))
(defun apply (args a b c) (a b c))
(apply plus 2 3)
```

Currying:

```lisp
(defun create (args x) (defun created (args y) (+ x y)) )
(create 100)
(created 200)
```

### Compiler

# Future extensions

This project was brought forewards for learning purposes. There is room for many improvements, such as:

- [ ] the simulator should have isa extensions, like M (multiplication and division), F (floating point), D (double precision).
- [ ] the compiled code should follow the official [ABI](https://riscv.org/wp-content/uploads/2024/12/riscv-calling.pdf).
- [ ] there should be an intermediate representation of the AST before compilation, that is the [A-normal form](https://en.wikipedia.org/wiki/A-normal_form).
- [ ] the compiled version of the language should support all the features of the interpreted version.
- [ ] the interprer should have memory optimizations and [tail call recursion](https://en.wikipedia.org/wiki/Tail_call) to prevent stack overflows.
- [ ] the parser library should allow the programmer to easily specify _NOT_.

# References

- [Build your own lisp](https://buildyourownlisp.com/) by [Daniel Holden](https://github.com/orangeduck) - a web book that shows how to implement a lisp interpreter with C.
- [Digital design and computer architecture - riscv edition](https://pages.hmc.edu/harris/ddca/ddcarv.html) by Sarah L. Harris and David Harris - particularly helpful for its chapter 6, with focus on code translation from C to assembly, and assembly programming.
- [RISC-V RV32I Base Instruction Set](./notes/rv32i.pdf) - for referencing the instruction bitwise representations.

# Considerations

I can say that this has been my first true creative and complex programming project.

No use of ai

100s of hours

```bash
vale@think:~/sou+/ts/lispv(dev)$ cloc src test
56 text files.
56 unique files.
0 files ignored.

github.com/AlDanial/cloc v 2.04 T=0.06 s (1006.2 files/s, 86982.3 lines/s)
-------------------------------------------------------------------------------
Language                                               files blank comment code
-------------------------------------------------------------------------------
TypeScript                                                     56 1094 245 3502
-------------------------------------------------------------------------------
SUM:                                                           56 1094 245 3502
-------------------------------------------------------------------------------
```
