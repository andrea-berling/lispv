import { Parser } from "../src/parser/parser";
import { NUMBER, GRAMMAR, LBRACKET, RBRACKET, OPERATION, ZERO_OR_MORE_SPACES } from "../src/lang/grammar"

const p = new Parser(GRAMMAR);
const text = "(+ 1 2 (- 3 4 5) 34)";

let result = p.parse(text);

if (result.parsed) {
	let be = result.parsed.copyAsAst();
	console.log(be.getText())

	let ast = be.wipe(LBRACKET, RBRACKET, ZERO_OR_MORE_SPACES);

	ast = ast.simplify(GRAMMAR);

	ast = ast.collapse(NUMBER, OPERATION);

	console.log(ast);

	console.log(JSON.stringify(ast));
}
