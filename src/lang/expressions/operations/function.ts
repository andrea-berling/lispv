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

		// functions are in a global environment. we dont make a distinction between closures.
		let func = GLOBAL_ENV.functions.get(name);

		if (!func)
			throw new Error(`function ${name} undefined`);

		let args_nodes = other_childs;

		// since we are applying a function, we should create an isolated environment for the new parameter-argument associations
		GLOBAL_ENV.variables.push();

		// here we match parameters with arguments. excess arguments are ignored
		for (let i = 0; i < args_nodes.length; i++) {
			// the function parameter, as defined in the signature
			let parameter_name = func.params[i];

			// the current argument, that can be evaluated
			let evt = args_nodes[i].evaluableType

			if (!evt)
				throw new Error(`cannot evaluate ${args_nodes[i].name}`)

			// if the parameter name is in the space of the defined functions
			if (!GLOBAL_ENV.functions.get(args_nodes[i].literal || "")) {
				let value = evt.evaluate(args_nodes[i]);

				// in the current scope we are assigning variables to their values
				GLOBAL_ENV.variables.set(parameter_name, value);

			}
		}

		let result = EExpression.evaluate(func.definition);

		// release the parameter-argument associations
		GLOBAL_ENV.variables.pop();

		return result;
	}
}

