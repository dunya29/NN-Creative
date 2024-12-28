<script setup>
	import { useRouter } from 'vue-router'
	import { useForm } from 'vee-validate'
	import { authApi } from '@/api/api'
	import { isEmail } from '@/functions/validation'
	import LoginWrap from '@/components/Login/LoginWrap.vue'
	import PageWrap from '@/components/PageWrap.vue'

	const schema = {
		email: async val => {
			if (val) {
				if (isEmail(val)) {
					return true
				} else {
					return 'Некорректный E-mail'
				}
			} else {
				return 'Заполните поле'
			}
		},
	}
	const { errors, handleSubmit, isSubmitting, defineField } = useForm({
		validationSchema: schema,
	})
	const [email, emailAttrs] = defineField('email')

	const router = useRouter()
	const onSubmit = handleSubmit(async values => {
		try {
			await authApi.forgotPassword(values.email)
			router.push('/recovery')
		} catch (err) {
			console.log(err)
		}
	})
</script>
<template>
	<PageWrap>
		<LoginWrap>
			<template #header>
				<h1>Сброс пароля</h1>
				<p>Для сброса вашего пароля необходимо ввести ваш e-mail ниже, и мы вышлем ссылку для сброса пароля</p>
			</template>
			<form class="form" @submit.prevent="onSubmit" novalidate>
				<div class="form__items">
					<div class="item-form">
						<input type="email" placeholder="E-mail" name="mail" v-model="email" v-bind="emailAttrs" />
						<div data-error="">{{ errors.email }}</div>
					</div>
				</div>
				<div class="form__footer">
					<div class="form__btns">
						<button class="btn main-btn" :class="isSubmitting && 'loading'" type="submit" :disabled="isSubmitting">
							<span>Сбросить пароль</span>
						</button>
					</div>
				</div>
			</form>
		</LoginWrap>
	</PageWrap>
</template>