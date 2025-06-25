import { Rule, Method } from "./index"

const adjective = new Rule();
adjective.method = Method.Or;
adjective.define([new Rule("wow"), new Rule("many"), new Rule("so"), new Rule("such")]);

const noun = new Rule();
noun.method = Method.Or;
noun.define([new Rule("lisp"), new Rule("language"), new Rule("book"), new Rule("build"), new Rule("c")]);

const spaces = new Rule();
spaces.method = Method.OneOrMore;
spaces.define([new Rule(" ")]);

const phrase = new Rule();
phrase.method = Method.And;
phrase.define([adjective, spaces, noun]);

const doge = new Rule();
doge.method = Method.ZeroOrMore;
doge.define([phrase, spaces]);