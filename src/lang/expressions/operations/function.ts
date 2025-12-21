import { Ast } from "../../../parser/ast";
import { COMPILER_ENV, Environment, FunctionDefinition, INTERPRETER_ENV } from "../../environment";
import { EExpression } from "../expression";
import { EOperation } from "../operation";

export class EFunction extends EOperation {

	static parameters(node: Ast, env: Environment): { func: FunctionDefinition, args_nodes: Ast[] } {

		let { first_child, other_childs } = EExpression.parameters(node);

		let function_name = first_child.literal;

		if (!function_name)
			throw new Error("<function> must have a name");

		// functions are in a global environment. we dont make a distinction between closures.
		let func = env.functions.get(function_name);

		if (!func)
			throw new Error(`function ${function_name} undefined`);

		let args_nodes = other_childs;


		return { func, args_nodes };
	}

	static evaluate(node: Ast): number {

		let { func, args_nodes } = this.parameters(node, INTERPRETER_ENV);

		// since we are applying a function, we should create an isolated environment for the new parameter-argument associations
		INTERPRETER_ENV.variables.push();

		// here we match parameters with arguments. excess arguments are ignored
		for (let i = 0; i < args_nodes.length; i++) {
			// the function parameter, as defined in the signature
			let parameter_name = func.params[i];

			// if the parameter name is in the space of the defined functions
			if (!INTERPRETER_ENV.functions.get(args_nodes[i].literal || "")) {
				let value = EExpression.evaluate(args_nodes[i]);

				// in the current scope we are assigning variables to their values
				INTERPRETER_ENV.variables.set(parameter_name, value);
			} else {
				let new_name = args_nodes[i].literal || "";
				let updated_func = (INTERPRETER_ENV.functions.get(new_name) as FunctionDefinition);
				updated_func.name = func.params[i];
				INTERPRETER_ENV.functions.set(func.params[i], updated_func);
			}
		}

		let result = EExpression.evaluate(func.definition);

		// release the parameter-argument associations
		INTERPRETER_ENV.variables.pop();

		return result;
	}

	static compile(node: Ast): string[] {
		let asm: string[] = [];

		let { func, args_nodes } = this.parameters(node, COMPILER_ENV);

		let argn = args_nodes.length;

		COMPILER_ENV.push(argn);

		// go through arguments backwards

		for (let i = argn - 1; i >= 0; i--) {
			// the function parameter, as defined in the signature
			let parameter_name = func.params[i];

			// if the parameter name is in the space of the defined functions
			let arg = args_nodes[i].literal;

			if (!COMPILER_ENV.functions.get(arg || "")) {

				asm.push(`\t# ${parameter_name}: ${arg || "nested call"}`)

				asm = asm.concat(EExpression.compile(args_nodes[i]));

				COMPILER_ENV.decrease();

			} else {
				// TODO passing functions
			}
		}

		COMPILER_ENV.pop();

		asm.push(`\tjalr ra, ${func.name}(zero)`);

		let destination_register = COMPILER_ENV.get();

		if (destination_register != 0)
			asm.push(`\tadd a${destination_register}, zero, a0`);

		if (COMPILER_ENV.inDefinition) {
			// restore t-registers, please

			let n = 7;

			let defining_function = COMPILER_ENV.definingFunction;

			if (defining_function)
				n = defining_function.params.length;

			for (let i = 1; i < n; i++)
				asm.push(`\tlw t${i}, ${(i - 1) * 4}(sp)`)

		}

		return asm;
	}
}

