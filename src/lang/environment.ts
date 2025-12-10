import { Ast } from "../parser/ast";

export class FunctionDefinition {
	name: string;
	params: string[];
	definition: Ast;

	constructor(name: string, args: string[], definition: Ast) {
		this.name = name;
		this.params = args;
		this.definition = definition;
	}
}

export class Stack {
	levels: Map<string, number>[];
	current: number;

	constructor() {
		this.levels = [
			new Map<string, number>()
		];
		this.current = 0;
	}

	set(name: string, value: number) {
		this.levels[this.current].set(name, value);
	}

	get(name: string) {
		return this.levels[this.current].get(name);
	}

	find(name: string) {
		for (let l = this.current; l >= 0; l--) {
			let level = this.levels[l];
			if (level.has(name))
				return level.get(name)
		}
		return undefined;
	}


	push() {
		this.current++;
		this.levels[this.current] = new Map<string, number>();
	}

	pop() {
		this.current--;
	}
}

export class Environment {
	functions: Map<string, FunctionDefinition>;
	variables: Stack;

	constructor() {
		this.variables = new Stack();
		this.functions = new Map<string, FunctionDefinition>();
	}
}

export const GLOBAL_ENV = new Environment();
