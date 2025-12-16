import { Ast } from "../parser/ast";
import { COMPILER_ENV } from "./environment";
import { EExpression } from "./expressions/expression";
import { LispReader } from "./interpreter";
import { Traversal } from "./traversal";

export class Compiler extends LispReader {
	lines: string[];

	constructor(lines: string[] | string, cleanEnv = true) {
		super();
		if (cleanEnv)
			COMPILER_ENV.clean()
		this.lines = LispReader.lines(lines);

		LispReader.debug_reader && this.lines.forEach(x => console.log(x));
	}

	compile(): string[] {

		let asm: string[] = [];

		for (let i = 0; i < this.lines.length; i++) {

			let line = this.lines[i];

			let ast = Traversal.cleanAst(line)

			if (!ast)
				continue;

			const result = Traversal.explore(ast, EExpression.compile);

			if (result === undefined)
				throw new Error("impossible");

			asm = asm.concat(result);
		}

		return asm;
	}
}

