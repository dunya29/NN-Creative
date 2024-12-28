<script setup>
	import Modal from '../Common/Modal.vue'

	const props = defineProps({
		title: String,
		errorText: String
	})
	const emit = defineEmits(['closeModal'])
</script>
<template>
	<Modal class="error-mod" @closeModal="emit('closeModal')">
		<template #header>
			<h2>{{ title || "Что-то пошло не так :(" }}</h2>
		</template>
		<p v-if="errorText">{{ errorText }}</p>
		<button class="btn main-btn" @click="emit('closeModal')"><span>Закрыть</span></button>
	</Modal>
</template>