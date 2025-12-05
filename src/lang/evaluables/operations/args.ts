import { Ast } from "../../../parser/ast";
import { GLOBAL_ENV } from "../../environment";
import { Evaluable } from "../../evaluable";
import { EOperation } from "../operation";
import { EVariable } from "../variable";

export class EArgs extends EOperation {

	evaluate(node: Ast): EVariable[] {
		let name: string;
		let expression: Ast;
		let funct: Ast;

		if (!node.literal)
			throw new Error("variable name cannot be empty");

		name = node.literal;

		if (!node.parent)
			throw new Error("cannot have arguments as first level expression");

		expression = node.parent;

		let local_parameters_nodes = expression.children?.slice(1);

		if (!local_parameters_nodes)
			throw new Error("impossible")

		let local_parameters: EVariable[] = [];

		for (let node of local_parameters_nodes) {
			if (!node.evaluableType)
				throw new Error("must have parameters after args")

			if (node.evaluableType !== (EVariable as unknown as typeof Evaluable)) {
				throw new Error("parameters must be variables");
			}

			let parameter = new (node.evaluableType as any) as EVariable;
			local_parameters.push(parameter.evaluate(node));
		}

		console.log("arg with", local_parameters);

		return local_parameters;
	}


}
