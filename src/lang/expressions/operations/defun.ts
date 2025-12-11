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
			throw new Error("syntax: defun <name> (args <variable1 ... variablen>) (<expression>)");

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

		// valutare valore variabile se non presente negli argomenti
		
		func = new FunctionDefinition(function_name, args, definition);

		GLOBAL_ENV.functions.set(function_name, func);

		function try_to_evaluate_names_not_passed_as_arguments(d: Ast) {
			if (d.evaluableType == EVariable) {
				let variable_node = d;
				let variable_name = d.literal || "";

				// variable not present in definition:
				// understand if it is not a function and a variable thats not a parameter to the funciton
				if (!GLOBAL_ENV.functions.get(variable_name) && args.indexOf(variable_name) == -1) {
					let number_value = EVariable.evaluate(variable_node);
					variable_node.name = "number"
					variable_node.literal = number_value + "";
					variable_node.evaluableType = ENumber;
				}
			}

			for (let child of d.children?.slice(1) || []) {
				try_to_evaluate_names_not_passed_as_arguments(child);
			}
		}

		try_to_evaluate_names_not_passed_as_arguments(definition);
		// console.log(definition);


		return args.length;
	}

}
