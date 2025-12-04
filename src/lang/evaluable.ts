import { Ast } from "../parser/ast";

export abstract class Evaluable {
	abstract evaluate(node: Ast): void;
}