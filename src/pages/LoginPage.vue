<script setup>
	import { onMounted, ref, watch } from 'vue'
	import { RouterLink, useRoute, useRouter } from 'vue-router'
	import { useForm } from 'vee-validate'
	import { authApi } from '@/api/api'
	import { useAuthStore } from '@/store/auth'
	import PageWrap from '@/components/PageWrap.vue'
	import InputPassword from '@/components/Common/InputPassword.vue'
	import LoginWrap from '@/components/Login/LoginWrap.vue'
	import { useFormModule } from '@/module/formModule'
	const route = useRoute()
	const router = useRouter()
	const storeAuth = useAuthStore()
	const formErrEmail = ref(null)
	const formErrCount = ref(0)
	const { formError, emailValidate, loginPasswordValidate } = useFormModule()
	const schema = {
		email: val => emailValidate(val),
		password: val => loginPasswordValidate(val),
	}
	const { errors, handleSubmit, isSubmitting, defineField } = useForm({
		validationSchema: schema,
		initialValues: {
			email: storeAuth.userData.email || '',
		},
	})
	const [email, emailAttrs] = defineField('email')
	const [password] = defineField('password')
	const onSubmit = handleSubmit(async values => {
		try {
			const { data } = await authApi.auth(values.email.toLocaleLowerCase(), values.password)
			storeAuth.auth(data)
			if (storeAuth.userData.emailVerified) {
				storeAuth.userData.disable
					? router.push('/forbidden')
					: router.push(route.query.redirect || '/projects')
			} else {
				router.push('/verify')
			}
		} catch (err) {
			console.log(err)
			if (err.status === 401) {
				formError.value = 'Неправильный email или пароль'
				if (formErrEmail.value === values.email) {
					formErrCount.value++
					if (formErrCount.value === 10) {
						await authApi.disableUser(values.email)
						router.push('/forbidden')
					}
				} else {
					formErrEmail.value = values.email
					formErrCount.value = 0
				}
			}
		}
	})
	watch(
		() => storeAuth.userData.email,
		() => {
			if (storeAuth.userData.email) {
				email.value = storeAuth.userData.email
			}
		},
		{ once: true }
	)
	onMounted(() => {
		if (storeAuth.isLogOutClicked) {
			storeAuth.logOut()
		}
	})
</script>
<template>
	<PageWrap>
		<LoginWrap class="log-p--log">
			<template #header>
				<h1>
					<RouterLink to="/registry">Регистрация</RouterLink>
					<span> / </span>
					<RouterLink to="/login">Вход</RouterLink>
				</h1>
			</template>
			<form class="form" @submit.prevent="onSubmit" novalidate>
				<div class="form__items">
					<div class="item-form">
						<input type="email" placeholder="E-mail" name="mail" v-model="email" v-bind="emailAttrs" />
						<div data-error="">{{ errors.email }}</div>
					</div>
					<InputPassword v-model="password" :error="errors.password" />
				</div>
				<div class="form__footer">
					<div v-if="formError" data-error="" class="form__error">{{ formError }}</div>
					<div class="form__btns">
						<button class="btn main-btn" :class="isSubmitting && 'loading'" type="submit" :disabled="isSubmitting">
							<span>Войти</span>
						</button>
						<RouterLink to="/forgot-password" class="btn text-btn">Забыли пароль?</RouterLink>
					</div>
				</div>
			</form>
		</LoginWrap>
	</PageWrap>
</template>
