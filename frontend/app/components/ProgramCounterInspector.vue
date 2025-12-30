<script setup lang="ts">
import { hex } from "../../../src/riscv/utils";
const simulatorStore = useSimulatorStore();
</script>

<template>
	<div>
		pc: {{ hex(simulatorStore.pc) }}
	</div>
</template>

<style scoped></style>
