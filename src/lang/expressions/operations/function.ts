import { Ast } from "../../../parser/ast";
import { FunctionDefinition, GLOBAL_ENV } from "../../environment";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EFunction extends EOperation {
	static evaluate(node: Ast): number {
		let { first_child, other_childs } = EExpression.parameters(node);

		let name = first_child.literal;

		if (!name)
			throw new Error("<function> must have a name");

		let func = GLOBAL_ENV.functions.get(name);

		if (!func)
			throw new Error(`function ${name} undefined`);

		let args_nodes = other_childs;

		// here we match parameters with arguments. excess arguments are ignored
		for (let i = 0; i < args_nodes.length; i++) {
			let name = func.args[i];

			let evt = args_nodes[i].evaluableType
			if (!evt)
				throw new Error(`cannot evaluate ${args_nodes[i].name}`)

			if (!GLOBAL_ENV.functions.get(args_nodes[i].literal || "")) {
				let value = evt.evaluate(args_nodes[i]);

				// in the current scope we are assigning variables to their values

				GLOBAL_ENV.variables.set(name, value);
			} else {
				let new_name = args_nodes[i].literal || "";
				let updated_func = (GLOBAL_ENV.functions.get(new_name) as FunctionDefinition);
				updated_func.name = func.args[i];
				GLOBAL_ENV.functions.set(func.args[i], updated_func);
			}

		}
		return EExpression.evaluate(func.definition);
	}
}

