<script setup lang="ts">
</script>

<template>
	<table class="registers">
		<ProgramCounterInspector></ProgramCounterInspector>
		<tr v-for="row in 4" :key="row">
			<td v-for="col in 8" :key="col">
				<RegisterInspector :index="(row - 1) * 8 + (col - 1)"></RegisterInspector>
			</td>
		</tr>
	</table>
</template>
