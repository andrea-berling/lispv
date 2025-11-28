import { hex } from "./utils";

export class Labels {
	static labels: Map<string, number> = new Map<string, number>();

	static set(label: string, address: number) {
		return Labels.labels.set(label, address);
	}

	static get(label: string) {
		return Labels.labels.get(label);
	}

	static show() {
		// show memory addresses sorted
		for (let cell of Array.from(Labels.labels.entries()).sort((a, b) => a[1] - b[1])) {
			let name = cell[0];
			let addr = cell[1];

			console.log(`${name}: ${hex(addr)}`);
		}
	}
}