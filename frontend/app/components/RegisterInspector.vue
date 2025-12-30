<script setup lang="ts">

defineProps<{
	index: number
}>();

const simulatorStore = useSimulatorStore();

</script>

<template>
	<div v-bind:class = "(index == 10)?'answer':'other'">
		<div class="reg">
			<div class="name">
				i{{ index }}
			</div>
			<div class="value">
				0x{{ simulatorStore.registers.at(index)?.toString(16) }}
			</div>
			<div class="value">
				0d{{ simulatorStore.registers.at(index)?.toString(10) }}
			</div>
		</div>
	</div>
</template>

<style scoped>

.answer {
	color: red;
}

.other {
	color: black;
}

</style>
