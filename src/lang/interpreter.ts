import { debug } from "console";
import { Parser } from "../parser/parser";
import { APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION, FUNCTION, GRAMMAR, LBRACKET, NUMBER, ONE_OR_MORE_SPACES, OPERATION, RBRACKET, VARIABLE, ZERO_OR_MORE_SPACES } from "./grammar";
import { Traversal } from "./traversal";
import { DEBUG, DEBUG_INTERPRETER } from "../flags";
import { GLOBAL_ENV } from "./environment";
import { Ast } from "../parser/ast";
import { EExpression } from "./expressions/expression";
import { EDefun } from "./expressions/operations/defun";

export abstract class LispEngine {
	static cleanAst(line: string) {

		const p = new Parser(GRAMMAR);

		let result = p.parse(line);

		if (result.parsed) {
			let ast = result.parsed.copyAsAst();

			// wipe rules that were added for parsing purposes
			ast.wipe(ONE_OR_MORE_SPACES, LBRACKET, RBRACKET, ZERO_OR_MORE_SPACES)

			// remove picked grammar patterns that are not of use
			ast.simplify(GRAMMAR, OPERATION, APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION);

			// collapse the digits of a number in a node of name number, 
			ast.collapse(NUMBER, VARIABLE, FUNCTION);

			return ast;
		}
	}

}

export class Compiler extends LispEngine {
	lines: string[];

	constructor(lines: string[], cleanEnv = true) {
		super();
		if (cleanEnv)
			GLOBAL_ENV.clean()
		this.lines = lines;
	}

	compile(): string[] {

		let asm: string[] = [];

		for (let i = 0; i < this.lines.length; i++) {

			let line = this.lines[i];

			let ast = Compiler.cleanAst(line)

			if (!ast)
				continue;

			function explore(node: Ast): string[] | undefined {
				if (node.evaluableType === EExpression) {
					return EExpression.compile(node);
				}

				for (const child of node.children || []) {
					const res = explore(child);
					if (res !== undefined) return res;
				}

				return undefined;
			}

			const result = explore(ast);

			if (result === undefined)
				throw new Error("no defun found");

			asm = asm.concat(result);
		}

		return asm;
	}
}

export class Interpreter extends LispEngine {
	lines: string[];
	debug = DEBUG || DEBUG_INTERPRETER;

	constructor(lines: string[], cleanEnv = true) {
		super();
		if (cleanEnv)
			GLOBAL_ENV.clean()
		this.lines = lines;
	}

	run(): Map<number, number> {

		let m = new Map<number, number>();

		for (let i = 0; i < this.lines.length; i++) {

			let ast = Interpreter.cleanAst(this.lines[i]);

			if (ast) {
				this.debug && console.log(ast);

				let traversal = new Traversal(ast);

				let answer = traversal.start();

				m.set(i, answer)
			}
		}

		return m;
	}


	runAndGetAnswerFromLine(line: string) {
		let index = this.lines.findIndex(x => x == line.trim());

		if (!index)
			throw new Error(`line ${line} was not in source`);

		return this.run().get(index);
	}


	log(options?: { includeLines?: boolean, includeIndexes?: boolean }): void {

		let m = this.run();

		for (let i of m.keys()) {
			if (options?.includeIndexes) {
				if (options.includeLines) {
					console.log(i, this.lines.at(i) + ":", m.get(i))
				}
				else {
					console.log(i, ":", m.get(i))
				}
			}
			else {
				if (options?.includeLines) {
					console.log(this.lines.at(i) + ":", m.get(i))
				}
				else if (!options?.includeLines) {
					console.log(m.get(i))
				}
			}
		}

	}

}
