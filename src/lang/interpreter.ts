import { debug } from "console";
import { Parser } from "../parser/parser";
import { APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION, FUNCTION, GRAMMAR, LBRACKET, NUMBER, ONE_OR_MORE_SPACES, OPERATION, RBRACKET, VARIABLE, ZERO_OR_MORE_SPACES } from "./grammar";
import { Traversal } from "./traversal";
import { DEBUG, DEBUG_INTERPRETER } from "../flags";

export class Interpreter {
	lines: string[];
	debug = DEBUG || DEBUG_INTERPRETER;

	constructor(lines: string[]) {
		this.lines = lines;
	}

	run(): Map<number, number> {

		let m = new Map<number, number>();

		for (let i = 0; i < this.lines.length; i++) {

			let line = this.lines[i];

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