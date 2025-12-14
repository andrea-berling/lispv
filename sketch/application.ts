import { FunctionDefinition, GLOBAL_ENV } from "../src/lang/environment";
import { EApplication } from "../src/lang/expressions/application";
import { EExpression } from "../src/lang/expressions/expression";
import { ENumber } from "../src/lang/expressions/number";
import { EFunction } from "../src/lang/expressions/operations/function";
import { EPlus } from "../src/lang/expressions/operations/plus";
import { EVariable } from "../src/lang/expressions/variable";
import { Ast } from "../src/parser/ast";

export function main() {

	// setting the environment
	// (defun f (args a b) (+ a b))
	//          ^ this eexpression declares a, b as variables in the environment
	//                     ^ this eexpression has a, b as variables in the environment
	//

	{
		let definition = new Ast("expression");
		definition.evaluableType = EExpression;

		let application = new Ast("application");
		application.evaluableType = EApplication;

		let plus = new Ast("+");
		plus.evaluableType = EPlus;

		let a = new Ast("variable", "a");
		a.evaluableType = EVariable;

		let b = new Ast("variable", "b");
		b.evaluableType = EVariable;


		application.children = [
			plus,
			a,
			b
		]

		definition.children = [application];

		console.log(application)


		let f = new FunctionDefinition("f", ["a", "b"], definition)

		GLOBAL_ENV.functions.set("f", f);
	}

	console.log(GLOBAL_ENV)

	// once the environment is set, we can apply the function
	// (f 1 2)
	//  ^ this application will find the function name in the current environment
	//    ^ node.children.slice(1) will be used as arguments, and the variables will be substitued

	{
		let application = new Ast("application");
		application.evaluableType = EApplication;

		let f = new Ast("function", "f");
		f.evaluableType = EFunction;

		let n1 = new Ast("number", "1");
		n1.evaluableType = ENumber;

		let n2 = new Ast("variable", "2");
		n2.evaluableType = ENumber;

		let n3 = new Ast("variable", "3");
		n3.evaluableType = ENumber;

		application.children = [
			f,
			n1,
			n2,
			n3
		]

		console.log(application);

		let result = application.evaluableType.evaluate(application);

		console.log(result);

	}

}
