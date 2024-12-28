<script setup>
	import { useForm } from 'vee-validate'
	import { ref } from 'vue'
	import InputPassword from '@/components/Common/InputPassword.vue'
	import { useAuthStore } from '@/store/auth'
	import { authApi } from '@/api/api'
	import { useFormModule } from '@/module/formModule'
	import PageWrap from '@/components/PageWrap.vue'
	import { usersArr } from '@/module/vars'
	import SuccessMod from '@/components/Modals/SuccessMod.vue'
	import ErrorMod from '@/components/Modals/ErrorMod.vue'
	const storeAuth = useAuthStore()
	const { passwordValidate, passwordConfirmValidate } = useFormModule()
	const schema = {
		password: val => passwordValidate(val),
		passwordConfirm: val => passwordConfirmValidate(val, password),
	}
	const { errors, handleSubmit, isSubmitting, defineField, resetForm } = useForm({
		validationSchema: schema,
	})
	const [password] = defineField('password')
	const [passwordConfirm] = defineField('passwordConfirm')
	const onSuccess = ref(false)
	const onError = ref(false)
	const onSubmit = handleSubmit(async values => {
		try {
			await authApi.changePassword(storeAuth.userData.id, {
				password: values.password,
			})
			onSuccess.value = true
			resetForm()
		} catch (err) {
			console.log(err)
			onError.value = true
		}
	})
</script>
<template>
	<PageWrap>
		<section class="docs-p">
			<div class="container">
				<div class="sec-top">
					<h1>Учетная запись</h1>
				</div>
				<form class="form account-form" @submit.prevent="onSubmit" novalidate>
					<div class="form__items">
						<div class="item-form">
							<span class="item-form__inp">{{ storeAuth.userData.email }}</span>
						</div>
						<div class="item-form">
							<span class="item-form__inp">{{ storeAuth.userData.name }}</span>
						</div>
						<div class="item-form">
							<span class="item-form__inp">{{ usersArr.find(item => item.value === storeAuth.userData.userRole).name  }}</span>
						</div>
						<InputPassword v-model="password" :error="errors.password" placeholder="Новый пароль" />
						<InputPassword v-model="passwordConfirm" :error="errors.passwordConfirm" placeholder="Новый пароль еще раз" name="confirmPass" />
					</div>
					<div class="form__footer">
						<div class="form__btns">
							<button class="btn stroke-btn-primary" :class="isSubmitting && 'loading'" type="submit" :disabled="isSubmitting">
								<span>Сохранить</span>
							</button>
						</div>
					</div>
				</form>
			</div>
		</section>
		<Teleport to="body">
			<transition name="fadeUp">
				<SuccessMod v-if="onSuccess" @closeModal="() => onSuccess = false" title="Пароль успешно сохранен" />
			</transition>
		</Teleport>
		<Teleport to="body">
			<transition name="fadeUp">
				<ErrorMod v-if="onError" @closeModal="() => onError = false" />
			</transition>
		</Teleport>
	</PageWrap>
</template>