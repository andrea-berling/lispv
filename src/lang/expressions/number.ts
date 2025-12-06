import { Ast } from "../../parser/ast";
import { Answer, AnswerType } from "../answer";
import { Evaluable } from "../evaluable";

export class ENumber extends Answer {

	type: AnswerType = AnswerType.NUMBER;

	static evaluate(node: Ast): number {
		let value = Number.parseInt(node.literal || "");
		return value;
	}

}
