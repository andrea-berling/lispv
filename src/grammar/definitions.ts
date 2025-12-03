import { Rule, RuleMethod } from "../parser/rule";

// we define here a CFG (Context Free Grammar) for our language. it is a Chomsky-level-2 language.

export const digit = Rule.or(
	"digit",
	..."1234567890".split("").map((x) => Rule.literal(x)),
);
export const number = Rule.oneOrMore("number", digit);

export const space = Rule.literal(" ");
export const optional_spaces = Rule.zeroOrMore("optional_spaces", space);
export const spaces = Rule.zeroOrMore("spaces", space);

export const lbracket = Rule.literal("(");
export const rbracket = Rule.literal(")");

export const operation = Rule.or("operation", Rule.literal("+"), Rule.literal("-"));

export const expression = new Rule();
expression.name = "expression";

export const number_or_base_expression = Rule.or("", number, expression)

export const expression_and_optional_spaces = Rule.and("", number_or_base_expression, optional_spaces);

export const one_or_more_expressions = Rule.oneOrMore("", expression_and_optional_spaces);

// base expression definition
expression.method = RuleMethod.And;
expression.define([
	lbracket,
	spaces,
	operation,
	spaces,
	one_or_more_expressions,
	rbracket,
]);

export const grammar = new Rule();
grammar.name = "grammar";
grammar.define([number_or_base_expression]);