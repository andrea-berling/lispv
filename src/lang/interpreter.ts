import { debug } from "console";
import { Parser } from "../parser/parser";
import { APPLICATION_OR_VARIABLE_OR_NUMBER_OR_EXPRESSION, FUNCTION, GRAMMAR, LBRACKET, NUMBER, ONE_OR_MORE_SPACES, OPERATION, RBRACKET, VARIABLE, ZERO_OR_MORE_SPACES } from "./grammar";
import { Traversal } from "./traversal";
import { DEBUG, DEBUG_INTERPRETER } from "../flags";

export interface LineAndAnswer {
	line: string,
	answer: number
}

export class Interpreter {
	lines: string[];
	debug = DEBUG || DEBUG_INTERPRETER;

	constructor(lines: string[]) {
		this.lines = lines;
	}

	run(): LineAndAnswer[] {

		let lines_and_answers: LineAndAnswer[] = [];

		for (let line of this.lines) {

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

				let traversal_result = traversal.start();

				lines_and_answers.push(
					{ line, answer: traversal_result }
				)
			}
		}

		return lines_and_answers;
	}

	log(): void {

	}

}