import { ENumber } from "./evaluables/number";
import { EOperation } from "./evaluables/operation";
import { EPlus } from "./evaluables/operations/plus";
import { EExpression } from "./evaluables/expression";

import { Rule, RuleMethod } from "../parser/rule";
import { EVariable } from "./evaluables/variable";
import { EMinus } from "./evaluables/operations/minus";
import { EIf } from "./evaluables/operations/if";
import { EDef } from "./evaluables/operations/def";
import { EDefun } from "./evaluables/operations/defun";
import { EFunction } from "./evaluables/operations/function";
import { EArgs } from "./evaluables/operations/args";

// we define here a CFG (Context Free Grammar) for our language. it is a Chomsky-level-2 language.

// white spaces
export const SPACE = Rule.literal(" ");
export const ZERO_OR_MORE_SPACES = Rule.zeroOrMore("optional_spaces", SPACE);
export const ONE_OR_MORE_SPACES = Rule.oneOrMore("spaces", SPACE);

// digits
export const DIGIT = Rule.or(
	"digit",
	..."1234567890".split("").map((x) => Rule.literal(x)),
);
export const NUMBER = Rule.oneOrMore("number", DIGIT).addEvaluable(ENumber);

// brackets
export const LBRACKET = Rule.literal("(");
export const RBRACKET = Rule.literal(")");

// primitive operations
export const PLUS = Rule.literal("+").addEvaluable(EPlus);

export const MINUS = Rule.literal("-").addEvaluable(EMinus);

export const IF = Rule.literal("if").addEvaluable(EIf);

export const DEFUN = Rule.literal("defun").addEvaluable(EDefun);

export const DEF = Rule.literal("def").addEvaluable(EDef);

export const ARGS = Rule.literal("args").addEvaluable(EArgs);

// custom one-words
export const LETTER = Rule.or("letter", ..."abcdefghijklmnopqrstuvz".split("").map((x) => Rule.literal(x)));

export const FUNCTION = Rule.oneOrMore("function", LETTER).addEvaluable(EFunction);

// definition of the allowed operations
export const OPERATION = Rule.or("operation").addEvaluable(EOperation);

// we need to be careful to have FUNCTION being the last rule that gets checked, cause it can have arbitrary characters. Also DEFUN must come before DEF because it would be ignored otherwise.
OPERATION.define([
	PLUS,
	MINUS,
	IF,
	DEFUN,
	DEF,
	ARGS,
	FUNCTION
]);

// apart from custom operations we need to parse variable names, so we give it a different rule, for different positions in the grammar and a different role in the phase of evaluation.
export const VARIABLE = Rule.oneOrMore("variable", LETTER).addEvaluable(EVariable);

// expressions are of different kinds, and recursively defined
export const EXPRESSION = new Rule().addEvaluable(EExpression);
EXPRESSION.name = "expression";

// expressions can themselves be numbers or variables
export const NUMBER_OR_CUSTOM_OR_EXPRESSION = Rule.or("", NUMBER, VARIABLE, EXPRESSION)

// expressions can be surrounded by optional spaces
export const EXPRESSION_AND_OPTIONAL_SPACES = Rule.and("", ZERO_OR_MORE_SPACES, NUMBER_OR_CUSTOM_OR_EXPRESSION, ZERO_OR_MORE_SPACES);

export const ZERO_OR_MORE_EXPRESSIONS = Rule.zeroOrMore("", EXPRESSION_AND_OPTIONAL_SPACES);

// ultimately, the expression is defined as a parenthesized application of one operation to zero or more expressions
EXPRESSION.method = RuleMethod.And;
EXPRESSION.define([
	LBRACKET,
	ZERO_OR_MORE_SPACES,
	OPERATION,
	ONE_OR_MORE_SPACES,
	ZERO_OR_MORE_EXPRESSIONS,
	RBRACKET,
]);

// the grammar consists of just an expression. it is in the time of the traversal of the ast that we decide if the operations have been applied with care
export const GRAMMAR = new Rule();
GRAMMAR.name = "grammar";
GRAMMAR.define([EXPRESSION]);
