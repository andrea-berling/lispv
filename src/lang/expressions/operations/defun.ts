import { Ast } from "../../../parser/ast";
import { CompilerEnvironment, FunctionDefinition, GLOBAL_ENV } from "../../environment";
import { Evaluable } from "../../evaluable";
import { EExpression } from "../expression";
import { ENumber } from "../number";
import { EOperation } from "../operation";
import { EVariable } from "../variable";

export class EDefun extends EOperation {

	static syntax: Evaluable[] = [
		EDefun,
		EVariable,
		EExpression,
		EExpression
	]

	static parameters(node: Ast): { function_name: string, args: string[], definition: Ast } {
		let { other_childs } = EExpression.parameters(node);

		if (other_childs?.length != this.syntax.length - 1)
			throw new Error("syntax: defun <name> (args <variable1 ... variablen>) (<expression>)");

		let function_name_node = other_childs.at(0);

		if (function_name_node?.evaluableType !== EVariable)
			throw new Error("syntax: defun <name> (args <variable1 ... variableN>) (<expression>)");

		let function_name = function_name_node.literal;

		if (!function_name)
			throw new Error("function must have a name");

		let args: string[] = [];

		let function_args_node = other_childs.at(1);

		if (!function_args_node)
			throw new Error("function must have arguments");

		if (!function_args_node.children)
			throw new Error("impossible");

		if (!function_args_node.children[0].children)
			throw new Error("impossible");

		let arg_nodes = function_args_node.children[0].children.slice(1);

		for (let node of arg_nodes) {
			if (!node.literal)
				throw new Error("argument must have a name");

			args.push(node.literal);
		}

		let definition = other_childs.at(2);

		if (!definition)
			throw new Error("function must have a definition");

		return { function_name, args, definition };
	}

	static evaluate(node: Ast): number {

		let { function_name, args, definition } = this.parameters(node);

		function explore(a: Ast) {

			if (a.evaluableType == EVariable) {
				let variable_name = a.literal as string;

				let found_value = GLOBAL_ENV.variables.find(variable_name)

				if (found_value) {
					a.evaluableType = ENumber;
					a.name = ENumber.tag as string;
					a.literal = found_value + "";
				}
			}

			for (let child of a.children || []) {
				explore(child);
			}
		}

		explore(definition);

		let func = new FunctionDefinition(function_name, args, definition);

		GLOBAL_ENV.functions.set(function_name, func);

		return args.length;
	}

	static compile(node: Ast): string[] {

		let { function_name, args, definition } = this.parameters(node);

		let lines: string[] = [];
		let argn = args.length + 1;

		if (argn > 8)
			throw new Error("cant have more than 8 arguments")

		// jump to end
		lines.push(`\tjal zero, end-${function_name}`)

		// label
		lines.push(`${function_name}:`)

		// saving
		let offset = argn * 4;
		lines.push(`\taddi sp, sp, -${offset}`);
		offset = offset - 4;
		lines.push(`\tsw ra, ${offset}(sp)`);
		offset = offset - 4;
		for (let i = 0; offset >= 0; offset -= 4, i++) {
			lines.push(`\tsw a${i}, ${offset}(sp)`);
		}

		// body

		CompilerEnvironment.env.reset();

		lines = lines.concat(EExpression.compile(definition));

		// restoring
		offset = 0;
		for (let i = argn - 2; i >= 1; offset += 4, i--) {
			lines.push(`\tlw a${i}, ${offset}(sp)`);
		}

		offset = offset + 4;
		lines.push(`\tlw ra, ${offset}(sp)`);
		offset = offset + 4;
		lines.push(`\taddi sp, sp, ${offset}`);

		// returning

		lines.push("\tjal ra, 0");

		lines.push(`end-${function_name}:`)

		let func = new FunctionDefinition(function_name, args, new Ast("body"));

		GLOBAL_ENV.functions.set(function_name, func);

		return lines;
	}

}
