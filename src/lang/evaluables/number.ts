import { Ast } from "../../parser/ast";
import { Evaluable } from "../evaluable";

export class ENumber extends Evaluable {

	value: number

	constructor(value: number){
		super();
		this.value = value;
	}

	static evaluate(node: Ast): ENumber {
		let value = Number.parseInt(node.literal || "");
		console.log("evalueated", value);
		return new ENumber(value);
	}

}
