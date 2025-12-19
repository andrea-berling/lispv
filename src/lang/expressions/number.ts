import { Ast } from "../../parser/ast";
import { Answer, AnswerType } from "../answer";
import { COMPILER_ENV } from "../environment";
import { Evaluable } from "../evaluable";

export class ENumber extends Answer {

	type: AnswerType = AnswerType.NUMBER;

	static evaluate(node: Ast): number {
		let value = Number.parseInt(node.literal || "");
		return value;
	}

	static compile(node: Ast): string[] {
		let asm: string[] = [
			`\taddi a${COMPILER_ENV.get()}, zero, ${Number.parseInt(node.literal || "")}`
		];
		return asm;
	}

}
