<script setup>
	import { useAuthStore } from '@/store/auth'
	import {
		computed,
		inject,
		nextTick,
		onMounted,
		onUnmounted,
		ref,
		watch,
	} from 'vue'
	import Status from '../Common/Status.vue'
	import { useDateModule } from '@/module/dateModule'
	import Save from '../Icons/Save.vue'
	import Close from '../Icons/Close.vue'
	import CloseProjectMod from '../Modals/CloseProjectMod.vue'
	import { projectsApi } from '@/api/api'
	import DelProjectMod from '../Modals/DelProjectMod.vue'
	import DeadlineMod from '../Modals/DeadlineMod.vue'
	import ChangeStatusMod from '../Modals/ChangeStatusMod.vue'
	import Messages from '../Messages/Messages.vue'
	import { useCommonStore } from '@/store/common'
	import { modalScrollPos, scrollPos } from '@/functions/scroll'
	import Eye from '../Icons/Eye.vue'
	import Edit from '../Icons/Edit.vue'
	import Star from '../Icons/Star.vue'
	import ErrorMod from '../Modals/ErrorMod.vue'
	const props = defineProps({
		id: Number,
		projectItem: Object,
		tabs: String,
		fields: Array,
		projectForm: null | Object,
		archiveExpertRates: Array,
	})
	const storeAuth = useAuthStore()
	const storeCommon = useCommonStore()
	const { formatDateValue } = useDateModule()
	const closeProjectMod = inject('closeProjectMod')
	const emit = defineEmits(['statusOnChange'])
	let setTab
	if (props.tabs) {
		setTab = inject('setTab')
	}
	const showChat = ref(false)
	const errorMod = ref(false)
	const editAllowStatus = ['1', '2', '9']
	const loadingDraft = ref(false)
	const loadingModerate = ref(false)
	const loadingSave = ref(false)
	const closeProjectNotyMod = ref(false)
	const delProjectMod = ref(false)
	const delLoading = ref(false)
	const newStatus = ref(
		props.projectItem && props.projectItem.status
			? props.projectItem.status
			: null
	)
	const statusChangeMod = ref(false)
	const statusChangeLoading = ref(false)
	const deadlineMod = ref(false)
	const errorsTotal = computed(() => {
		let error = 0
		props.fields.forEach(arr => {
			arr.forEach(item => {
				if (item.error) {
					error++
				}
			})
		})
		return error
	})
	const projectTopRef = ref(null)
	const isHeaderScrolled = ref(false)
	const isHeaderHidden = ref(false)
	let lastScroll = 0
	function modHeaderShow() {
		if (props.tabs) {
			if (modalScrollPos() > 1) {
				isHeaderScrolled.value = true
				if (
					modalScrollPos() > lastScroll &&
					modalScrollPos() > 50 &&
					!isHeaderHidden.value
				) {
					isHeaderHidden.value = true
					setChat(false)
				} else if (modalScrollPos() < lastScroll && isHeaderHidden.value) {
					isHeaderHidden.value = false
				}
			} else {
				isHeaderScrolled.value = false
				isHeaderHidden.value = false
			}
			lastScroll = modalScrollPos()
		} else {
			if (scrollPos() > 1) {
				isHeaderScrolled.value = true
				if (
					scrollPos() > lastScroll &&
					scrollPos() > 50 &&
					!isHeaderHidden.value
				) {
					isHeaderHidden.value = true
					setChat(false)
				} else if (scrollPos() < lastScroll && isHeaderHidden.value) {
					isHeaderHidden.value = false
				}
			} else {
				isHeaderScrolled.value = false
				isHeaderHidden.value = false
			}
			lastScroll = scrollPos()
		}
	}
	const setChat = val => {
		showChat.value = val
	}
	const errorBtnOnClick = () => {
		let mergeArr = []
		props.fields.forEach(arr => {
			mergeArr.push(...arr)
		})
		let findErr = mergeArr.find(item => item.error)
		const el = document.querySelector(`[data-name=${findErr.translitName}]`)
		let elTop = el.getBoundingClientRect().top
		if (
			document.querySelector('.project-mod') &&
			document.querySelector('.project-mod .simplebar-content-wrapper')
		) {
			const top = modalScrollPos() + elTop - 10
			let headerH =
				top < lastScroll && projectTopRef.value
					? projectTopRef.value.clientHeight
					: 0
			document
				.querySelector('.project-mod .simplebar-content-wrapper')
				.scrollTo({
					top: top - headerH,
					left: 0,
					behavior: 'smooth',
				})
		} else if (
			document.querySelector('.page-scroll .simplebar-content-wrapper')
		) {
			const top = scrollPos() + elTop - 10
			let headerH =
				top < lastScroll && projectTopRef.value
					? projectTopRef.value.clientHeight
					: 0
			document
				.querySelector('.page-scroll .simplebar-content-wrapper')
				.scrollTo({
					top: top - headerH,
					left: 0,
					behavior: 'smooth',
				})
		}
	}
	const setProject = async action => {
		let obj = {}
		props.fields[0].forEach(item => {
			switch (item.translitName) {
				case 'grantee':
					let granteeObj = {}
					granteeObj.value = item.value
					props.fields[1].forEach(el => {
						granteeObj[el.translitName] = el.value
					})
					obj.grantee = granteeObj
					break
				case 'execTime':
					let start = props.projectForm.execTime.start
						? formatDateValue(props.projectForm.execTime.start)
						: ''
					let end = props.projectForm.execTime.end
						? formatDateValue(props.projectForm.execTime.end)
						: ''
					obj.execTime = start + '-' + end
					break
				case 'social':
					obj.social = item.data.map(item => item.value)
					break
				default:
					obj[item.translitName] = item.value
			}
		})
		if (action === 'draft') {
			obj.status = '9'
			loadingDraft.value = true
		} else {
			if (
				!props.id ||
				(props.projectItem &&
					props.projectItem.status &&
					editAllowStatus.includes(props.projectItem.status) &&
					action === 'moderate')
			) {
				obj.status = '3'
			} else {
				obj.status = props.projectItem.status
			}
			if (action === 'save') {
				loadingSave.value = true
			} else {
				loadingModerate.value = true
			}			
		}
		if (!props.id) {
			obj.user_id = storeAuth.userData.id
			obj.author = storeAuth.userData.name
			obj.year = new Date().getFullYear()
			obj.isExpertSeen = false
			obj.isWgSeen = false
			obj.comment = ''
			obj.moderateDate = ''
			obj.deadline = ''
		}
		try {
			if (!props.id) {
				await projectsApi.postItem(
					obj,
					storeAuth.userData.userRole,
					storeAuth.userData.id
				)
				onClose()
			} else {
				await projectsApi.editItem(
					props.id,
					obj,
					storeAuth.userData.userRole,
					storeAuth.userData.id
				)
				onClose()
			}
		} catch (err) {
			console.log(err)
			errorMod.value = true
		} finally {
			loadingDraft.value = false
			loadingModerate.value = false
			loadingSave.value = false
		}
	}
	const onModerate = async action => {
		if (action === 'moderate' || storeAuth.userData.userRole === 'manager') {
			props.projectForm.onModerate()
			await nextTick()
			if (errorsTotal.value === 0) {
				setProject(action)
			}
		} else {
			props.projectForm.onDraft()
			await nextTick()
			if (errorsTotal.value === 0) {
				setProject(action)
			}
		}
	}
	const onDraft = async () => {
		props.projectForm.onDraft()
		await nextTick()
		if (errorsTotal.value === 0) {
			setProject('draft')
		}
	}
	const onClose = () => {
		if (props.projectForm) {
			props.projectForm.resetForm()
		}
		closeProjectMod()
	}
	const delProject = async () => {
		delLoading.value = true
		try {
			await projectsApi.delItem(
				props.id,
				storeAuth.userData.userRole,
				storeAuth.userData.id
			)
			closeProjectMod()
		} catch (err) {
			console.log(err)
			errorMod.value = true
		} finally {
			delLoading.value = false
		}
	}
	const showDelProjectMod = () => {
		delProjectMod.value = true
	}
	const setStatus = val => {
		newStatus.value = val
		statusChangeMod.value = true
	}
	const statusOnChange = () => {
		if (['1', '2'].includes(newStatus.value)) {
			statusChangeMod.value = false
			deadlineMod.value = true
		} else {
			statusChangeLoading.value = true
			emit(
				'statusOnChange',
				{ status: newStatus.value },
				() => {
					statusChangeLoading.value = false
					statusChangeMod.value = false
				},
				() => {
					statusChangeLoading.value = false
					errorMod.value = true
				}
			)
		}
	}
	const setDeadline = async date => {
		statusChangeLoading.value = true
		emit(
			'statusOnChange',
			{ status: newStatus.value, deadline: date },
			() => {
				statusChangeLoading.value = false
				deadlineMod.value = false
			},
			() => {
				statusChangeLoading.value = false
				errorMod.value = true
			}
		)
	}
	const closeBtnOnClick = () => {
		if (!showChat.value) {
			if (
				['expert', 'expertSpecComp'].includes(
					storeAuth.userData.userRole
				) ||
				(!props.tabs && storeAuth.userData.userRole === 'user') ||
				(props.tabs === 'edit' &&
					(storeAuth.userData.userRole === 'manager' ||
						(storeAuth.userData.userRole === 'user' &&
							editAllowStatus.includes(props.projectItem.status))))
			) {
				closeProjectNotyMod.value = true
			} else {
				onClose()
			}
		}
	}
	onMounted(() => {
		if (
			props.tabs &&
			document.querySelector('.project-mod .simplebar-content-wrapper')
		) {
			document
				.querySelector('.project-mod .simplebar-content-wrapper')
				.addEventListener('scroll', modHeaderShow)
		} else if (
			!props.tabs &&
			document.querySelector('.page-scroll .simplebar-content-wrapper')
		) {
			document
				.querySelector('.page-scroll .simplebar-content-wrapper')
				.addEventListener('scroll', modHeaderShow)
		}
	})
	onUnmounted(() => {
		if (
			props.tabs &&
			document.querySelector('.project-mod .simplebar-content-wrapper')
		) {
			document
				.querySelector('.project-mod .simplebar-content-wrapper')
				.removeEventListener('scroll', modHeaderShow)
		} else if (
			!props.tabs &&
			document.querySelector('.page-scroll .simplebar-content-wrapper')
		) {
			document
				.querySelector('.page-scroll .simplebar-content-wrapper')
				.removeEventListener('scroll', modHeaderShow)
		}
	})
	watch(
		() => props.projectItem,
		() => {
			if (props.projectItem.status) {
				newStatus.value = props.projectItem.status
			}
		},
		{ deep: true }
	)
</script> 
<template>
	<div :class="['project-p__top', `project-p__top--${storeAuth.userData.userRole}`, (tabs === 'view' && storeAuth.userData.userRole === 'manager') && 'isStatus',isHeaderHidden && 'unshow']">
		<div :class="['project-p__sticky', isHeaderScrolled && 'scroll', isHeaderHidden && 'unshow']" ref="projectTopRef">
			<div class="project-p__inner">
				<div class="project-p__actions">
					<button v-if="!tabs && storeAuth.userData.userRole === 'user'" :class="['btn stroke-btn-primary btn--icon', loadingDraft && 'loading']" @click="() => onDraft()" :disabled="loadingDraft">
						<span>Сохранить черновик и выйти</span>
						<Save />
					</button>
					<button v-if="tabs && storeAuth.userData.userRole === 'manager' || (id && storeAuth.userData.userRole === 'user' && editAllowStatus.includes(projectItem.status))" :class="['btn btn--icon', (tabs === 'view') && 'main-btn disabled' || 'stroke-btn']" @click="() => setTab('view')">
						<span>Просмотр</span>
						<Eye />
					</button>
					<button v-if="tabs && storeAuth.userData.userRole === 'manager' || (id && storeAuth.userData.userRole === 'user' && editAllowStatus.includes(projectItem.status))" :class="['btn btn--icon', (tabs === 'edit') ? 'main-btn disabled' : 'stroke-btn']" @click="() => setTab('edit')">
						<span>Редактировать</span>
						<Edit />
					</button>
					<button v-if="tabs && storeAuth.userData.userRole === 'manager'" :class="['btn btn--icon', (tabs === 'rating') ? 'main-btn disabled' : 'stroke-btn']" @click="() => setTab('rating')">
						<span>Оценка</span>
						<Star />
					</button>
				</div>
				<div class="project-p__actions">
					<button v-if="errorsTotal && (!tabs || tabs === 'edit')" class="btn main-btn error" @click="() => errorBtnOnClick()"><span>Ошибки ({{ errorsTotal }})</span></button>
					<button v-if="!errorsTotal && (storeAuth.userData.userRole === 'user' && (!tabs || (tabs === 'edit' && projectItem.status && editAllowStatus.includes(projectItem.status))))" :class="['btn main-btn btn--moderate', loadingModerate && 'loading']" @click="() => onModerate('moderate')" :disabled="loadingModerate">
						<span>Отправить <span>на модерацию</span></span>
					</button>
					<Status v-if="tabs === 'view' && storeAuth.userData.userRole === 'manager'" :projectDelete="true" :items="storeCommon.statusArr" :selected="projectItem.status" @onChange="setStatus" @showDelProjectMod="showDelProjectMod" :isHeaderHidden="isHeaderHidden" />
					<button v-if="tabs === 'edit' && projectItem.status && projectItem.status === '9'" :class="['btn stroke-btn-primary btn--icon', loadingDraft && 'loading']" @click="() => onDraft()" :disabled="loadingDraft">
						<span>Сохранить черновик</span>
						<Save />
					</button>
					<button v-if="tabs === 'edit' && projectItem.status && projectItem.status !== '9'" :class="['btn stroke-btn-primary btn--icon', loadingSave && 'loading']" @click="() => onModerate('save')" :disabled="loadingSave">
						<span>Сохранить</span>
						<Save />
					</button>
					<Messages v-if="tabs === 'view' && ['user', 'manager'].includes(storeAuth.userData.userRole) && projectItem.status && projectItem.status !== '9'" :projectId="id" :showChat="showChat" @setChat="setChat" />
					<button class="btn stroke-btn btn--icon" @click="() => closeBtnOnClick()">
						<span>Закрыть</span>
						<Close />
					</button>
				</div>
				<Teleport to="body">
					<transition name="fadeUp">
						<ChangeStatusMod v-if="statusChangeMod" :loading="statusChangeLoading" @setStatus="statusOnChange" @closeModal="() => statusChangeMod = false">
							<template #header>
								<h2>{{storeCommon.statusArr.find(item => item.value === newStatus)?.name}}</h2>
							</template>
							<p class="h6" v-if="(newStatus) === '1'">Оценки экспертов будут сброшены</p>
						</ChangeStatusMod>
					</transition>
				</Teleport>
				<Teleport to="body">
					<transition name="fadeUp">
						<DeadlineMod v-if="deadlineMod" :loading="statusChangeLoading" @setDeadline="setDeadline" @closeModal="() => deadlineMod = false" />
					</transition>
				</Teleport>
				<Teleport to="body">
					<transition name="fadeUp">
						<CloseProjectMod v-if="closeProjectNotyMod" @closeProject="onClose" @closeModal="() => closeProjectNotyMod = false" />
					</transition>
				</Teleport>
				<Teleport to="body">
					<transition name="fadeUp">
						<DelProjectMod v-if="delProjectMod" :loading="delLoading" @delProject="delProject" @closeModal="() => delProjectMod = false" />
					</transition>
				</Teleport>
				<Teleport to="body">
					<transition name="fadeUp">
						<ErrorMod v-if="errorMod" @closeModal="()=>errorMod = false" />
					</transition>
				</Teleport>
			</div>
		</div>
	</div>

</template>