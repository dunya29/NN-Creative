<script setup>
	import { onMounted, ref } from 'vue'
	import { RouterLink, useRouter } from 'vue-router'
	import { authApi } from '@/api/api'
	import LoginWrap from '@/components/Login/LoginWrap.vue'
	import { useAuthStore } from '@/store/auth'
	import PageWrap from '@/components/PageWrap.vue'
	const router = useRouter()
	const storeAuth = useAuthStore()
	const loading = ref(false)
	const resendVerificationLink = async () => {
		loading.value = true
		try {
			await authApi.emailVerify(storeAuth.userData.email)
			router.push('/login')
		} catch (err) {
			console.log(err)
		} finally {
			loading.value = false
		}
	}
	const logOut = () => {
		storeAuth.logOut()
		router.push("/login")
	}
	onMounted(() => {
		if (storeAuth.userData.emailVerified) {
			router.push('/projects')
		}
	})
</script>
<template>
	<PageWrap>
		<LoginWrap>
			<template #header>
				<h1>Подтвердите почту</h1>
				<p>Прежде чем продолжить, пожалуйста, подтвердите свой адрес электронной почты, перейдя по ссылке, которую мы только что отправили вам по электронной почте. Если вы не получили письмо, мы с удовольствием отправим его повторно.</p>
			</template>
			<div class="log-p__btns">
				<button :class="['btn main-btn', loading && 'loading']" @click="() => resendVerificationLink()" :disabled="loading"><span>Отправить повторно</span></button>
				<button class="btn stroke-btn" @click="() => logOut()"><span>Выйти</span></button>
			</div>
		</LoginWrap>
	</PageWrap>
</template>