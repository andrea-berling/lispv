# Lispv - a didactic lisp-like language that compiles to rv32i assembly

This is a Typescript project and is comprised of 4 main packages:

- `src/riscv`: an implementation of a simulator for a risc cpu.
- `src/parser`: a context-free-grammar parser combinator library.
- `src/lang`: a lisp programming language, comprehensive of an interpreter and a compiler.
- `frontend`: a vue application that let the user play with the language, and the simulator.

## Riscv simulator

Despite only implementing 37/40[^missing-instructions] instructions of the official rv32i specification[^riscv-specification], the code for this simulator was designed to be extensible.

[^missing-instructions]: ECALL, EFENCE and EBREAK are not implemented.
[^riscv-specification]: [link](https://riscv.atlassian.net/wiki/spaces/HOME/pages/16154769/RISC-V+Technical+Specifications).

Here is an example of a custom instruction that can be added to the `InstructionRegistry`, with the provided static block[^jest-decorator-error]. For every instruction defined of the ISA, we have a class that extends `Instruction`. The _mnemonic_ for the instruction is here called `tag` for better ease.

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

With the custom instruction added to the registry and `f3` and `f7` fields defined, the instruction can be encoded and decoded from and a to a 32 bit string representation (a js `number`), with the methods:

- `static Instruction.decode(number): Instruction` turns a number in an instance of the specific custom instruction class it belongs to.
- `Instruction.encode(): number` is the instance method that returns a number.

Every instruction is also represented by a js `string`, such as `"cust i1, i2, i3"`. The following methods translate back and forth from a string representation to an object representaiton:

- `static Instruction.factoryFromAssembly(string): Instruction` from string to object.
- `Instruction.disassemble(): string` from object to string.

The string representation is used in the `Assembler`, which supports labels, comments and register asliases.

```assembly
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

The number representaiton is written to `Memory`.

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


## Lang

The language interpreter supports a bunch of 

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

