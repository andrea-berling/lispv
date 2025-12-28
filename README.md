# Lispv - a didactic lisp-like language that compiles to rv32i assembly

This is a Typescript project and is comprised of 4 main packages:

- `src/riscv`: an implementation of a simulator for a riscv cpu.
- `src/parser`: a context-free-grammar parser combinator library.
- `src/lang`: a lisp programming language, comprehensive of an interpreter and a compiler.
- `frontend`: a vue application that let the user play with the language, and the simulator (TODO).

With Node.js installed on your system you can run unit tests with:

```bash
npm install -g pnpm
pnpm install 
pnpm run test
```

## Riscv simulator

Despite only implementing 37/40[^missing-instructions] instructions of the official [rv32i specification](https://riscv.atlassian.net/wiki/spaces/HOME/pages/16154769/RISC-V+Technical+Specifications), the code for this simulator was designed to be extensible.

[^missing-instructions]: ECALL, EFENCE and EBREAK are not implemented.

Here is an example of a custom instruction that can be added to the `InstructionRegistry`, with the provided static block[^jest-decorator-error]. For every instruction defined of the ISA, we have a class that extends `Instruction`. The _mnemonic_ for the instruction is here called `tag` for better ease. The custom instruction is extending `RTypeInstruction`, from which it inherits the 7 bit `opcode` and methods for internal work.

[^jest-decorator-error]: For the fact that we are using Jest for unit testing, I've found problems with typescript decorators. [Related issue](https://github.com/jestjs/jest/issues/15890).

```typescript
abstract class RTypeInstruction extends Instruction {
	static opcode = 0b0110011;
	// ...
}

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

We included a [parser-combinator](https://en.wikipedia.org/wiki/Parser_combinator) library that allows for the definition of `Rule`s in a _context-free_ grammar[^chomsky]. It takes both a _grammar_ rule and a _text_ (a js `string`) as input and works like this:

[^chomsky]: It recognizes Chomsky-type-2 grammars with non-left-recursive rules. Put differently it is a LL(*) parser with backtracking.

- Rules can be literals that match the text by checking string equality.
- Rules can be _combined_ with the following methods:
 	- `ZeroOrMore` that will match a rule if it is repeated 0 or more times, like `*` in regular expressions.
 	- `And` that will match the text if all rules are respected, in order.
 	- `Or` that will match the text if any one of the rules is respected.
 	- `OneOrMore` that is simply an _and_ with a rule and a _zero or more_ of that very rule. This is just like `+` in regular expressions.
- the parser _backtracks_ for alternatives.
- an `Ast` (_abstract syntax tree_) is returned if the text matches the grammar.
- errors are reported at the precise location where the text started not to match the grammar, if it did so.

Once the `Ast` is returned, it can be cleaned by:

- _wiping_: removing nodes off of it, together with their children.
- _simplifying_: removing unwanted nodes but maintaining their children.
- _collapsing_: adding a leaf node that is the concatenation of the text of every old children node, recursively.
- _flattening_: making the tree structure linear.

## Lang

The _Lots of Irritating Silly Parentheses_ (LISP) grammar is defined in `src/lang/grammar.ts`. Every line of our programs has to match the grammar, and in essence:

- the `GRAMMAR` is formed by one `EXPRESSION`.
- an `EXPRESSION` is either a `NUMBER`, a `VARIABLE`, an `APPLICATION` or another `EXPRESSION`.
- every expression can be surrounded by spaces, like `___expr__`.
- every expression is then surrounded by parentheses, like `( expr )`.
- a `NUMBER` is a sequence of `DIGIT`s, that are any of the characters `0123456789`.
- a `VARIABLE` is a sequence of `LETTER`s, that are any of the characters of the alphabet.
- an `APPLICATION` is comprised of an `OPERATION` followed by zero or more `EXPRESSION`s.
- an `OPERATION` can be a primitive operation, a literal such as `+`, `-`, `if`..., or a user defined function that is a `VARIABLE`.

And this is all that is defined at a grammatical level. The parsed `Ast` is then cleaned to have the irritating parentheses and spaces wiped, the numbers and variables collapsed into single nodes and `OPERATION`s simplified to their `APPLICATION`. Every other syntax check is done at the time of interpretation or compilation of the language, for example the definition of new functions, that takes form like: `(defun sum (args a b) (+ a b))`.

A rule of the grammar can be associated to a class that extends `Evaluable`. The parameter `evaluableType: typeof Evaluable` is passed all the way to the corresponding node of the `Ast`, so the node can be _evaluated_ and _compiled_ in accordance with the behaviour defined in the relative `evaluableType` class.

For example, the `NUMBER` rule has the class `ENumber` associated to it:

```typescript
export const DIGIT = Rule.or(
 "digit",
 ..."1234567890".split("").map((x) => Rule.literal(x)),
);
export const NUMBER = Rule.oneOrMore("number", DIGIT).addEvaluable(ENumber);
```

And the `ENumber` class defines the behaviour of a lisp literal number at the time of interpretation or compilation:

```typescript
export class ENumber extends Evaluable {
 static evaluate(node: Ast): number {
  return Number.parseInt(node.literal || "");
 }

 static compile(node: Ast): string[] {
  let destination_register = COMPILER_ENV.get();
  return [`addi a${destination_register}, zero, ${Number.parseInt(node.literal || "")}`];
 }
}
```

The environment of the language includes:

- a _stack_ structure for variables, to isolate lexical scopes.
- a registry for functions, that holds their `FunctionDefinition`, which is comprised of the name, the parameters and the definition of the function.

Starting from the root node of the AST, expressions are evaluated or compiled, and so are their children and the children of them, recursively. This is done in a _depth first_ fashion.

### Interpreter

The interpreter associates every line of the lisp program to a result of type `number`. Function definitions return the number of arguments of the defined function. Here are three examples that demonstrate the capabilities of the interpreter:

Recursion is possible (and the only way to make loops):

```lisp
(defun times (args a b) (if (greater b 0) (+ a (times a (+ b (- 1))) ) (0) )) ;; = 2
(defun fact (args a) (if (greater a 0) (times a (fact (+ a (- 1))) ) (1) )) ;; = 1
(fact 4) ;; = 24
```

Functions can be passed as arguments:

```lisp
(defun plus (args a b) (+ a b)) ;; = 2
(defun apply (args a b c) (a b c)) ;; = 3
(apply plus 2 3) ;; = 3
```

Functions can define functions at runtime. Some kind of [currying](https://en.wikipedia.org/wiki/Currying) is possible:

```lisp
(defun create (args x) (defun created (args y) (+ x y)) ) ;; = 1
(create 50) ;; = 1, that is the number of argumet of the created function
(created 200) ;; = 250
```

### Compiler

The compiler works with an extended environment, that _keeps track of the registers_ to which the variables and literal numbers will be assigned. It doesn't support all the features of the interpreter: no passing functions as arguments and no function definition at runtime. To be fair, whatever else is supported is a bit buggy and couldn't cope with a program bigger than a trivial example.

The _application binary interface_ (ABI) that the compiler complies to is not very robust and certainly inefficient. Every one of its features is a weakness, for example:

- function definitions are surrounded by a label that indicates where the function starts and by a label that indicates there the function ends. Function definitions are inserted sequentially in the assembly and are skipped with a jump over the function end.
- registers `a0..a7` are used as arguments. They are saved to the stack even if they are not overwritten by the function. The maximum number of arguments that a function supports is 7. `a0` is the returned value and not the first argument (this is against the riscv calling convention).
- `+` and `-` are not inlined. A prologue is placed at the beginning of the program, before the `_start` label. The program can jump there to apply plus-_n_ and minus-_n_ operations, for n that goes from 1 to 7.
- the function call simply uses a `jalr` instruction that takes an unsigned 12 bit immediate to the location of the function. A jump longer than 1024 instructions wouldn't work. A temporary register should be used to extend the jump if needed.
- the argument registers of use during a [non-leaf](https://en.wikipedia.org/wiki/Leaf_routine) function call are saved to the stack and restored after the function of study calls every other function.

Here is an example of a [triangular number](https://en.wikipedia.org/wiki/Triangular_number) function:

```lisp
(defun triangular (args a) (if (a) (+ a (triangular (+ a (- 1) )) ) (0) ) )
(triangular 5)
```

And here is the assembly generated, with helpful indentation:

```assembly
            _start:
0x00000154:     jal zero, end-triangular
            triangular:
0x00000158:     addi sp, sp, -8
0x0000015c:     sw ra, 4(sp)
0x00000160:     sw a1, 0(sp)
0x00000164:     add t1, zero, a1
                    # (if a (+ a (triangular (+ a (- 1)))) 0)
0x00000168:             add a1, zero, t1
0x0000016c:             add a0, zero, t1
0x00000170:         bne a0, zero, if-true-1
0x00000174:         jal zero, if-false-1
                    # (+ a (triangular (+ a (- 1))))
            if-true-1:
0x00000178:             addi sp, sp, -8
                        # op (+ a (triangular (+ a (- 1))))
0x0000017c:                 addi sp, sp, -4
                            # op (triangular (+ a (- 1)))
                            # a: nested call
0x00000180:                     addi sp, sp, -8
                                # op (+ a (- 1))
                                    # op (- 1)
0x00000184:                           addi a1, zero, 1
0x00000188:                           addi a0, zero, 1
0x0000018c:                         jalr ra, minus-1(zero)
0x00000190:                         add a2, zero, a0
0x00000194:                     sw a2, 4(sp)
0x00000198:                       add a1, zero, t1
0x0000019c:                       add a0, zero, t1
0x000001a0:                     sw a1, 0(sp)
0x000001a4:                     lw a1, 0(sp)
0x000001a8:                     lw a2, 4(sp)
0x000001ac:                     jalr ra, plus-2(zero)
0x000001b0:                     add a1, zero, a0
0x000001b4:                     addi sp, sp, 8
0x000001b8:                 sw a1, 0(sp)
0x000001bc:                 sw t1, 0(sp)
0x000001c0:                 jalr ra, triangular(zero)
0x000001c4:                 lw t1, 0(sp)
0x000001c8:                 add a2, zero, a0
0x000001cc:                 addi sp, sp, 4
0x000001d0:             sw a2, 4(sp)
0x000001d4:               add a1, zero, t1
0x000001d8:               add a0, zero, t1
0x000001dc:             sw a1, 0(sp)
0x000001e0:             lw a1, 0(sp)
0x000001e4:             lw a2, 4(sp)
0x000001e8:             jalr ra, plus-2(zero)
0x000001ec:             add a1, zero, a0
0x000001f0:             addi sp, sp, 8
0x000001f4:         jal zero, if-end-1
                    # 0
            if-false-1:
0x000001f8:             addi a1, zero, 0
0x000001fc:             addi a0, zero, 0
            if-end-1:
0x00000200:     lw ra, 4(sp)
0x00000204:     lw a1, 0(sp)
0x00000208:     addi sp, sp, 8
0x0000020c:     jal ra, 0
            end-triangular:
0x00000210:     addi a0, zero, 1
                # op (triangular 5)
                # a: 5
0x00000214:       addi a1, zero, 5
0x00000218:       addi a0, zero, 5
0x0000021c:     jalr ra, triangular(zero)
0x00000220:     add a1, zero, a0
```

After execution the register `a0` will hold the decimal value `15`.

# Future extensions

This project was brought forwards for learning purposes. There is room for many improvements, such as:

- [ ] implementing an interactive web app with a code editor, the compiler and the simulator runner and inspector.
- [ ] the simulator should have ISA extensions, like M (multiplication and division), F (floating point), D (double precision).
- [ ] there should be an intermediate representation of the AST before compilation, in [A-normal form](https://en.wikipedia.org/wiki/A-normal_form).
- [ ] the compiled version of the language should support all the features of the interpreted version.
- [ ] the interpreter should have memory optimizations and [tail call recursion](https://en.wikipedia.org/wiki/Tail_call) to prevent stack overflows.
- [ ] the parser library should allow the programmer to easily specify _NOT_ rules.
- [ ] the code is already commented in part, but it should have some more clarifications and some parts should be refactored to the overall style.
- [ ] the compiled code should follow the official [ABI](https://riscv.org/wp-content/uploads/2024/12/riscv-calling.pdf).
- [ ] the compiler's weaknesses should be covered.

# References

- [Build your own lisp](https://buildyourownlisp.com/) by [Daniel Holden](https://github.com/orangeduck) - a web book that shows how to implement a lisp interpreter in C.
- [Digital design and computer architecture - riscv edition](https://pages.hmc.edu/harris/ddca/ddcarv.html) by Sarah L. Harris and David Harris - particularly helpful for its chapter 6, with focus on code translation from C to assembly, and assembly programming.
- [RISC-V RV32I Base Instruction Set](./notes/rv32i.pdf) - for referencing the instructions' bitwise representations.

# Considerations

I can say that this has been my first complex programming project for that it makes use of high level software engineering and low level knowledge of digital systems.

I have not received help by LLMs for the organization of code nor for implementing algorithms (and it shows). The algorithms used here are unoptimized and sometimes redundant by intention. What I've wanted to achieve with this project was exploring programming languages and computer architecture, and exemplifying them in a working program.

I have instead conversed with ChatGPT for research purposes. One of the most fruitful chats I'm attaching [here](./notes/lispv.pdf).

It took 100s of hours and 1000s of lines of code to get to the point, here is a rundown:

```bash
vale@think:~/sou+/ts/lispv(dev)$ cloc src test
56 text files.
56 unique files.
0 files ignored.

github.com/AlDanial/cloc v 2.04 T=0.06 s (1006.2 files/s, 86982.3 lines/s)
-------------------------------------------------------------------------------
Language                                               files blank comment code
-------------------------------------------------------------------------------
TypeScript                                                56  1094     245 3502
-------------------------------------------------------------------------------
SUM:                                                      56  1094     245 3502
-------------------------------------------------------------------------------
```

The following code, while it makes the interpreter explode for stack overflow, compiles to 195 lines of assembly, uses 141kB of stack memory for execution... but gives the correct result!!

```lisp
(defun times (args a b) (if (b) (+ a (times a (+ b (- 1))) ) (0) ))
(defun fact (args a) (if (a) (times a (fact (+ a (- 1))) ) (1) ))
(fact 8)
```
