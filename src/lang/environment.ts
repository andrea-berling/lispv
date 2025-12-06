
export class Environment {
	variables: Map<string, number>;

	constructor() {
		this.variables = new Map<string, number>();
	}
}

export const GLOBAL_ENV = new Environment();
