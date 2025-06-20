"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
var Method;
(function (Method) {
    Method[Method["ZeroOrMore"] = 0] = "ZeroOrMore";
    Method[Method["OneOrMore"] = 1] = "OneOrMore";
    Method[Method["And"] = 2] = "And";
    Method[Method["Or"] = 3] = "Or";
})(Method || (exports.Method = Method = {}));
var Parser = /** @class */ (function () {
    function Parser(rule) {
        this.rule = rule;
    }
    Parser.prototype.parse = function (text) {
        var dfs = function (rule, level) {
            if (level === void 0) { level = 1; }
            var i = 0;
            if (rule.literal) {
                var match = rule.match(text);
                text = match.text;
                return match.matched;
            }
            if (rule.method == Method.OneOrMore || rule.method == Method.ZeroOrMore) {
                var running = false;
                while (running) {
                    for (var _i = 0, _a = rule.definition; _i < _a.length; _i++) {
                        var subrule = _a[_i];
                        running = dfs(subrule);
                    }
                }
            }
            else {
                for (var _b = 0, _c = rule.definition; _b < _c.length; _b++) {
                    var subrule = _c[_b];
                    dfs(subrule);
                }
            }
            return (text == "");
        };
        dfs(this.rule);
        console.log("parsed: ", text == "");
    };
    return Parser;
}());
var Rule = /** @class */ (function () {
    function Rule(literal) {
        if (literal === void 0) { literal = ""; }
        this.parent = this;
        this.definition = [];
        this.caught = [];
        this.literal = "";
        this.method = Method.Or;
        this.literal = literal;
    }
    Rule.prototype.define = function (rules) {
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            rule.parent = this;
        }
        this.definition = rules;
    };
    Rule.prototype.match = function (text) {
        if (this.literal) {
            // if we can find the match as the first subword of the text, lets trim the 
            if (text.indexOf(this.literal) == 0) {
                return { matched: true, text: text.replace(this.literal, "") };
            }
        }
        return { matched: false, text: text };
    };
    return Rule;
}());
var adjective = new Rule();
adjective.method = Method.Or;
adjective.define([new Rule("wow"), new Rule("many"), new Rule("so"), new Rule("such")]);
var noun = new Rule();
noun.method = Method.Or;
noun.define([new Rule("lisp"), new Rule("language"), new Rule("book"), new Rule("build"), new Rule("c")]);
var spaces = new Rule();
spaces.method = Method.ZeroOrMore;
spaces.define([new Rule(" ")]);
var phrase = new Rule();
phrase.method = Method.And;
phrase.define([adjective, spaces, noun]);
var doge = new Rule();
doge.method = Method.OneOrMore;
doge.define([phrase]);
var p = new Parser(phrase); // TODO
var text = "such    book";
p.parse(text);
console.log(p);
