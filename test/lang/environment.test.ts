import { EExpression } from "../../src/lang/expressions/expression"
import { EApplication } from "../../src/lang/expressions/application";
import { INTERPRETER_ENV } from "../../src/lang/environment";
import { ENumber } from "../../src/lang/expressions/number";
import { EArgs } from "../../src/lang/expressions/operations/args";
import { EDefun } from "../../src/lang/expressions/operations/defun";
import { EFunction } from "../../src/lang/expressions/operations/function";
import { EPlus } from "../../src/lang/expressions/operations/plus";
import { EVariable } from "../../src/lang/expressions/variable";
import { Traversal } from "../../src/lang/traversal";

// side effect import
import "../../src/lang/grammar";

describe("environment", () => {
	test("lexical scope", () => {
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

		let e2 = EExpression.createAst().addChildren([
			EApplication.createAst().addChildren([
				EFunction.createAst("f"),
				ENumber.createAst("10")
			])
		])

		let t: Traversal;

		t = new Traversal(e1);
		t.start();

		t = new Traversal(e2);
		t.start();

		expect(INTERPRETER_ENV.variables.levels.at(1)?.get("a")).toBe(10);
	})
})
