import { Rule, RuleMethod } from "./rule"
import { Parser } from "./parser";

import "../riscv/instructions/btype"
import "../riscv/instructions/itype"
import "../riscv/instructions/jtype"
import "../riscv/instructions/rtype"
import "../riscv/instructions/stype"
import "../riscv/instructions/utype"
import { InstructionRegistry } from "../riscv/instructionRegistry";

let ins = Array.from(InstructionRegistry.tagRegistry.keys());
let range = function (start: number, x: number) { let result: number[] = []; for (let i = x; i >= start; i--) result.push(i); return result }

// assuming every instruction is of type R, so it is of the form
// instr i<x>, i<y>, i<z>
// where x, y, z are integers from 0 to 31

const instruction = Rule.or("instruction", ...ins.map(x => Rule.literal(x)));
const spaces = Rule.zeroOrMore("spaces", Rule.literal(" "));
const comma = Rule.literal(",");
const index = Rule.or("index", ...range(0, 31).map(x => Rule.literal("" + x)));

const register = Rule.and("register", Rule.literal("i"), index);

console.log((index as any).definition);

const p = new Parser(index);
p.debug = true;

console.log(p.parse("13"))