<script setup>
	import { onBeforeMount, ref } from 'vue'
	import Header from './components/Header/Header.vue'
	import { useAuthStore } from './store/auth'
	import { useCommonStore } from './store/common'
	import Preloader from './components/Common/Preloader.vue'
	import { checkBrowser } from './functions/checkBrowser'
	import simplebar from 'simplebar-vue'
	const storeAuth = useAuthStore()
	const storeCommon = useCommonStore()
	onBeforeMount(async () => {
		if (!storeAuth.isAuthorized) {
			try {
				await storeAuth.authMe()
			} catch (err) {
				console.log(err)
			}
		}
		if (checkBrowser()) {
			document.body.classList.add('isFirefox')
		}
	})
</script>

<template>
	<simplebar class="page-scroll">
		<Header v-if="storeCommon.hasHeader" />
		<RouterView v-slot="{ Component, route }">
			<transition :name="route.meta.transition || 'fadeUp'" mode="out-in">
				<component :is="Component" :key="route.path" />
			</transition>
		</RouterView>
		<transition name="preloader-fade">
			<Preloader v-if="!storeCommon.isMounted" />
		</transition>
	</simplebar>
</template>