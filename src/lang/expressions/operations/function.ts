import { Ast } from "../../../parser/ast";
import { CompilerEnvironment, FunctionDefinition, GLOBAL_ENV } from "../../environment";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EFunction extends EOperation {

	static parameters(node: Ast): { func: FunctionDefinition, args_nodes: Ast[] } {

		let { first_child, other_childs } = EExpression.parameters(node);

		let function_name = first_child.literal;

		if (!function_name)
			throw new Error("<function> must have a name");

		// functions are in a global environment. we dont make a distinction between closures.
		let func = GLOBAL_ENV.functions.get(function_name);

		if (!func)
			throw new Error(`function ${function_name} undefined`);

		let args_nodes = other_childs;


		return { func, args_nodes };
	}

	static evaluate(node: Ast): number {

		let { func, args_nodes } = this.parameters(node);

		// since we are applying a function, we should create an isolated environment for the new parameter-argument associations
		GLOBAL_ENV.variables.push();

		// here we match parameters with arguments. excess arguments are ignored
		for (let i = 0; i < args_nodes.length; i++) {
			// the function parameter, as defined in the signature
			let parameter_name = func.params[i];

			// if the parameter name is in the space of the defined functions
			if (!GLOBAL_ENV.functions.get(args_nodes[i].literal || "")) {
				let value = EExpression.evaluate(args_nodes[i]);

				// in the current scope we are assigning variables to their values
				GLOBAL_ENV.variables.set(parameter_name, value);
			} else {
				let new_name = args_nodes[i].literal || "";
				let updated_func = (GLOBAL_ENV.functions.get(new_name) as FunctionDefinition);
				updated_func.name = func.params[i];
				GLOBAL_ENV.functions.set(func.params[i], updated_func);
			}
		}

		let result = EExpression.evaluate(func.definition);

		// release the parameter-argument associations
		GLOBAL_ENV.variables.pop();

		return result;
	}

	static compile(node: Ast): string[] {
		let asm: string[] = [];

		let { func, args_nodes } = this.parameters(node);

		CompilerEnvironment.env.reset();

		for (let i = 0; i < args_nodes.length; i++) {
			let node = args_nodes[i];

			asm = asm.concat(EExpression.compile(node));

			if (i == 0) {
				asm.push(`\tadd t1, zero, a0`)
			}
			else {
				asm.push(`\tadd a${CompilerEnvironment.env.index}, zero, a0`)
			}

			CompilerEnvironment.env.increase();
		}

		if (args_nodes.length >= 1)
			asm.push(`\tadd a0, t1, zero`);

		asm.push(`\tjalr ra, ${func.name}(zero)`);

		return asm;
	}
}

