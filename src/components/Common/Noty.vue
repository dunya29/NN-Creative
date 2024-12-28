<script setup>
	import { onMounted, onUnmounted } from 'vue'
	const props = defineProps({
		txt: String,
		modelValue: Boolean
	})
	const emit = defineEmits(['update:modelValue'])
	let timeOut
	onMounted(() => {
		setTimeout(() => {
			emit('update:modelValue', false)
		}, 1000)
	})
	onUnmounted(() => {
		clearTimeout(timeOut)
	})
</script>
<template>
	<div class="js-lbl">
		<span class="js-lbl__txt">{{ txt }}</span>
	</div>
</template>