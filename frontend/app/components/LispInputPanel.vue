<script setup lang="ts">

import { Interpreter } from "../../../src/lang/interpreter"
import { Compiler } from "../../../src/lang/compiler"

let interpreter: Interpreter;
let compiler: Compiler;

let text = ref<string>("");
let result = ref<number>();
let assemblyStore = useAssemblyStore();

function run() {
	interpreter = new Interpreter(text.value);
	result.value = interpreter.run();
}

function compile() {
	compiler = new Compiler(text.value);
	assemblyStore.setAssembly(compiler.compile())
}

</script>

<template>
	<textarea rows="10" cols="60" name="text" placeholder="Enter text" v-model="text"></textarea>
	<button @click="run">run</button>
	<button @click="compile">compile</button>
	<div>{{result}}</div>
</template>

<style scoped></style>
