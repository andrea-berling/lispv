import { EApplication } from "../src/lang/expressions/application";
import { EExpression } from "../src/lang/expressions/expression";
import { EArgs } from "../src/lang/expressions/operations/args";
import { EDefun } from "../src/lang/expressions/operations/defun";
import { EVariable } from "../src/lang/expressions/variable";

import "../src/lang/grammar";
import { EPlus } from "../src/lang/expressions/operations/plus";
import { ENumber } from "../src/lang/expressions/number";
import { Traversal } from "../src/lang/traversal";
import { INTERPRETER_ENV } from "../src/lang/environment";
import { EFunction } from "../src/lang/expressions/operations/function";

export function main() {

	let e1 = EExpression.createAst().addChildren([
		EApplication.createAst().addChildren([
			EDefun.createAst(),
			EVariable.createAst("f"),
			EExpression.createAst().addChildren([
				EApplication.createAst().addChildren([
					EArgs.createAst(),
					EVariable.createAst("a"),
				])
			]),
			EExpression.createAst().addChildren([
				EApplication.createAst().addChildren([
					EPlus.createAst(),
					EVariable.createAst("a"),
					ENumber.createAst("1")
				])
			])
		])
	])

	console.log(e1);

	let e2 = EExpression.createAst().addChildren([
		EApplication.createAst().addChildren([
			EFunction.createAst("f"),
			ENumber.createAst("10")
		])
	])

	let t: Traversal;

	t = new Traversal(e1);
	console.log(t.start())

	t = new Traversal(e2);
	console.log(t.start())

	console.log(INTERPRETER_ENV)

}
