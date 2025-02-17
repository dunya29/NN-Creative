<script setup>
	import { onMounted, onUnmounted } from 'vue'
	const props = defineProps({
		modelValue: Boolean
	})
	const emit = defineEmits(['update:modelValue'])
	let timeOut
	onMounted(() => {
		setTimeout(() => {
			emit('update:modelValue', false)
		}, 10000)
	})
	onUnmounted(() => {
		clearTimeout(timeOut)
	})
</script>
<template>
	<div class="js-lbl maintenance">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
			<path d="M96 64c0-17.7-14.3-32-32-32S32 46.3 32 64l0 256c0 17.7 14.3 32 32 32s32-14.3 32-32L96 64zM64 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
		</svg>
		<div class="js-lbl__text">
            <slot></slot>
		</div>
	</div>
</template>