<script setup>
	import { useCommonStore } from '@/store/common'
	import { onMounted } from 'vue'
	import { useRoute } from 'vue-router'
	const route = useRoute()
	const storeCommon = useCommonStore()
	onMounted(() => {
		;[
			'home',
			'registry',
			'login',
			'forbidden',
			'forgot-password',
			'recovery',
			'recovery-success',
			'verify',
			'access-denied',
			'project',
		].includes(route.name)
			? storeCommon.unshowHeader()
			: storeCommon.showHeader()
	})
	onMounted(() => {
		if (!storeCommon.isMounted) {
			storeCommon.pageOnMounted()
		}	
	})
</script>

<template>
	<main class="main">
		<slot></slot>
	</main>
</template>
