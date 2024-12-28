<script setup>
	import { inject, onMounted, ref, useTemplateRef } from 'vue'
	import ProjectForm from '../Projects/ProjectForm.vue'
	import { projectsApi, ratingApi, ratingArchiveApi } from '@/api/api'
	import ProjectTop from '../Projects/ProjectTop.vue'
	import ProjectView from '../Projects/ProjectView.vue'
	import { useAuthStore } from '@/store/auth'
	import { projectFieldsArr, projectGranteeFieldsArr } from '@/module/vars'
	import RateView from '../Projects/RateView.vue'
	import Modal from '../Common/Modal.vue'
	import RateForm from '../Projects/RateForm.vue'
	import ProjectNoty from './ProjectNoty.vue'
	import SuccessMod from './SuccessMod.vue'
	const props = defineProps({
		id: Number,
		tabs: String,
	})
	const closeProjectMod = inject('closeProjectMod')
	const projectForm = useTemplateRef('projectForm')
	const storeAuth = useAuthStore()
	const fields = ref([
		[...projectFieldsArr],
		[...projectGranteeFieldsArr[0].data],
	])
	const rates = ref([])
	const archiveRates = ref([])
	const expertRates = ref({})
	const archiveExpertRates = ref([])
	const rateSuccess = ref(false)
	const rateSuccessTitle = ref('Оценки сохранены')
	const setFields = obj => {
		fields.value = obj
	}
	const projectItem = ref({})
	const fetchProject = async () => {
		try {
			const { data } = await projectsApi.getItem(
				storeAuth.userData.userRole,
				storeAuth.userData.id,
				props.id
			)
			projectItem.value = data
		} catch (err) {
			console.log(err)
			closeProjectMod()
		}
	}
	const fetchRates = async () => {
		if (['manager', 'expert', 'expertSpecComp'].includes(storeAuth.userData.userRole)) {
			try {
				if (storeAuth.userData.userRole === 'manager') {
					const { data } = await ratingApi.getItems(props.id)
					rates.value = data
				} else {
					const { data } = await ratingApi.getItem(
						props.id,
						storeAuth.userData.id
					)
					expertRates.value = data[0]
				}
			} catch (err) {
				console.log(err)
			}
			try {
				if (storeAuth.userData.userRole === 'manager') {
					const { data } = await ratingArchiveApi.getItems(props.id)
					archiveRates.value = data
				} else {
					const { data } = await ratingArchiveApi.getItem(
						props.id,
						storeAuth.userData.id
					)
					archiveExpertRates.value = data
				}
			} catch (err) {
				console.log(err)
			}
		}
	}
	const statusOnChange = async (val, callback) => {
		try {
			await projectsApi.editItem(
				props.id,
				val,
				storeAuth.userData.userRole,
				storeAuth.userData.id
			)
			fetchProject()
		} catch (err) {
			console.log(err)
		} finally {
			callback()
		}
	}
	const sendRate = async (obj, callback) => {
		try {
			if (!expertRates.value) {
				await ratingApi.postItem(props.id, obj)
			} else {
				await ratingApi.editItem(props.id, expertRates.value.id, obj)
			}
			rateSuccess.value = true
		} catch (err) {
			console.log(err)
		} finally {
			callback()
		}
	}
	onMounted(async () => {
		fetchProject()
		fetchRates()
		if (
			props.id &&
			['expert', 'expertSpecComp'].includes(storeAuth.userData.userRole) &&
			projectItem.id &&
			!projectItem.isExpertSeen
		) {
			try {
				await projectsApi.editItem(props.id, { isExpertSeen: true })
			} catch (err) {
				console.log(err)
			}
		}
		if (
			props.id &&
			storeAuth.userData.userRole === 'workingGroup' &&
			projectItem.id &&
			!projectItem.isWgSeen
		) {
			try {
				await projectsApi.editItem(props.id, { isWgSeen: true })
			} catch (err) {
				console.log(err)
			}
		}
	})
</script>
<template>
	<Modal :clickOutside="false" class="project-mod project-p">
		<ProjectTop :id="id" :fields="fields" :projectForm="projectForm" :projectItem="projectItem" :tabs="tabs" :archiveExpertRates="archiveExpertRates" @statusOnChange="statusOnChange" />
		<ProjectNoty v-if="['expert', 'expertSpecComp'].includes(storeAuth.userData.userRole) && archiveExpertRates.length" :title="projectItem.title" :userRole="storeAuth.userData.userRole" :rates="archiveExpertRates" />
		<div class="project-p__body">
			<ProjectView v-if="tabs === 'view'" :projectItem="projectItem" :userRole="storeAuth.userData.userRole" />
			<ProjectForm v-if="tabs === 'edit'" ref="projectForm" :projectItem="projectItem" @setFields="setFields" />
			<RateView v-if="tabs === 'rating' && (rates || archiveRates)" :title="projectItem.title" :rates="rates" :archiveRates="archiveRates" :userRole="storeAuth.userData.userRole" />
		</div>
		<RateForm v-if="['expert', 'expertSpecComp'].includes(storeAuth.userData.userRole)" :expertRates="expertRates" @sendRate="sendRate" />
		<Teleport to="body">
			<transition name="fadeUp">
				<SuccessMod v-if="rateSuccess" @closeModal="closeProjectMod" :title="rateSuccessTitle" />
			</transition>
		</Teleport>
	</Modal>
</template>