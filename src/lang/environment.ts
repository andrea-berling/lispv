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

export class Stack<T> {
	levels: Map<string, T>[];
	current: number;

	constructor() {
		this.levels = [
			new Map<string, T>()
		];
		this.current = 0;
	}

	set(name: string, value: T) {
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
		this.levels[this.current] = new Map<string, T>();
	}

	pop() {
		this.current--;
	}
}

export class Environment {
	variables: Stack<number>;
	functions: Stack<FunctionDefinition>;

	constructor() {
		this.variables = new Stack();
		this.functions = new Stack();
	}
}

export const GLOBAL_ENV = new Environment();
