<script setup lang="ts">
import { Pipeline } from "../../../src/riscv/pipeline";
import { ProgramCounter } from "../../../src/riscv/programCounter";
import { Registers } from "../../../src/riscv/register";

const assemblyStore = useAssemblyStore();

const assembly = computed<string>({
	get() {
		return assemblyStore.lines.join("\n")
	},
	set(value: string) {
		assemblyStore.lines = value.split("\n")
	},
})

const simulatorStore = useSimulatorStore();

function execute() {
	Registers.clean();
	ProgramCounter.reset();
	Pipeline.run();
	simulatorStore.update();
}

function step() {
	Pipeline.run(1);
	simulatorStore.update();
}

</script>

<template>
	<textarea rows="10" cols="60" name="text" placeholder="Enter assembly" v-model="assembly"></textarea>
	<button @click="execute">execute</button>
	<button @click="step">step</button>
</template>

<style scoped></style>
