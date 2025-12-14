import { Ast } from "../parser/ast";
import { GLOBAL_ENV } from "./environment";
import { EExpression } from "./expressions/expression";
import { Traversal } from "./traversal";

export class Compiler {
	lines: string[];

	constructor(lines: string[], cleanEnv = true) {
		if (cleanEnv)
			GLOBAL_ENV.clean()
		this.lines = lines;
	}

	compile(): string[] {

		let asm: string[] = [];

		for (let i = 0; i < this.lines.length; i++) {

			let line = this.lines[i];

			let ast = Traversal.cleanAst(line)

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

