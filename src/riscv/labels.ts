export class Labels {
	static labels: Map<string, number> = new Map<string, number>();

	static set(label: string, address: number) {
		return Labels.labels.set(label, address);
	}

	static get(label: string) {
		return Labels.labels.get(label);
	}

}