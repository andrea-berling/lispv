import { Ast } from "../parser/ast";

export class FunctionDefinition {
	name: string;
	args: string[];
	definition: Ast;

	constructor(name: string, args: string[], definition: Ast) {
		this.name = name;
		this.args = args;
		this.definition = definition;
	}
}

export class Environment {
	variables: Map<string, number>;
	functions: Map<string, FunctionDefinition>;

	constructor() {
		this.variables = new Map<string, number>();
		this.functions = new Map<string, FunctionDefinition>();
	}
}

export const GLOBAL_ENV = new Environment();
