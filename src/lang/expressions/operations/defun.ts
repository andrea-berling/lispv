import { Ast } from "../../../parser/ast";
import { FunctionDefinition, GLOBAL_ENV } from "../../environment";
import { Evaluable } from "../../evaluable";
import { EExpression } from "../expression";
import { ENumber } from "../number";
import { EOperation } from "../operation";
import { EVariable } from "../variable";
import { EArgs } from "./args";

export class EDefun extends EOperation {

	static syntax: Evaluable[] = [
		EDefun,
		EVariable,
		EExpression,
		EExpression
	]

	static evaluate(node: Ast): number {
		let { first_child, first_child_type, other_childs } = EExpression.parameters(node);
		let func: FunctionDefinition;

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

		function explore(a: Ast) {

			if (a.evaluableType == EVariable) {
				let variable_name = a.literal as string;

				let found_value = GLOBAL_ENV.variables.find(variable_name)

				if (found_value){
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

		func = new FunctionDefinition(function_name, args, definition);

		GLOBAL_ENV.functions.set(function_name, func);

		return args.length;
	}

}
