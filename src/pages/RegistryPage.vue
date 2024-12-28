<script setup>
	import { useRouter } from 'vue-router'
	import { MaskInput } from 'vue-3-mask'
	import { authApi } from '@/api/api'
	import PageWrap from '@/components/PageWrap.vue'
	import LoginWrap from '@/components/Login/LoginWrap.vue'
	import InputPassword from '@/components/Common/InputPassword.vue'
	import { useAuthStore } from '@/store/auth'
	import { useFormModule } from '@/module/formModule'
	import { useForm } from 'vee-validate'
	const storeAuth = useAuthStore()
	const router = useRouter()
	const {
		formError,
		loginValidate,
		emailValidate,
		phoneValidate,
		passwordValidate,
		passwordConfirmValidate,
		agreeValidate,
	} = useFormModule()
	const schema = {
		name: val => loginValidate(val),
		phone: val => phoneValidate(val),
		email: val => emailValidate(val),
		password: val => passwordValidate(val),
		passwordConfirm: val => passwordConfirmValidate(val, password),
		agree: val => agreeValidate(val),
	}
	const { errors, handleSubmit, isSubmitting, defineField } = useForm({
		validationSchema: schema,
	})
	const [name, nameAttrs] = defineField('name')
	const [phone, phoneAttrs] = defineField('phone')
	const [email, emailAttrs] = defineField('email')
	const [password] = defineField('password')
	const [passwordConfirm] = defineField('passwordConfirm')
	const [agree, agreeAttrs] = defineField('agree')
	const onSubmit = handleSubmit(async values => {
		const user = {
			email: values.email,
			name: values.name,
			password: values.password,
			userRole: 'user',
			emailVerified: false,
			disable: false,
		}
		try {
			await authApi.createUser(user)
			storeAuth.logOut()
			router.push('/verify')
		} catch (err) {
			console.log(err)
			if (err.status === 401) {
				formError.value = 'Пользователь с таким email уже существует'
			}
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
						<input type="text" placeholder="ФИО" v-model="name" v-bind="nameAttrs" />
						<div data-error="">{{ errors.name }}</div>
					</div>
					<div class="item-form">
						<MaskInput placeholder="+7" v-model="phone" mask="+7 ###-###-##-##" v-bind="phoneAttrs" />
						<div data-error="">{{ errors.phone }}</div>
					</div>
					<div class="item-form">
						<input type="email" placeholder="E-mail" name="mail" v-model="email" v-bind="emailAttrs" />
						<div data-error="">{{ errors.email }}</div>
					</div>
					<InputPassword v-model="password" :error="errors.password" />
					<InputPassword v-model="passwordConfirm" :error="errors.passwordConfirm" placeholder="Повторите пароль" name="confirmPass" />
				</div>
				<div class="form__footer">
					<label class="item-checkbox">
						<input name="agree" type="checkbox" v-model="agree" v-bind="agreeAttrs" />
						<span>
							Нажимая кнопку, вы соглашаетесь на обработку персональных данный в соответствии с политикой обработки данных
							<svg>
								<path d="M2 6.15L4.4 8.6L10.1 3" />
							</svg>
						</span>
						<div data-error="">{{ errors.agree }}</div>
					</label>
					<div class="form__error" data-error="" v-if="formError">{{ formError }}</div>
					<div class="form__btns">
						<button class="btn main-btn" :class="isSubmitting && 'loading'" type="submit" :disabled="isSubmitting">
							<span>Зарегистрироваться</span>
						</button>
					</div>
				</div>
			</form>
		</LoginWrap>
	</PageWrap>
</template>
