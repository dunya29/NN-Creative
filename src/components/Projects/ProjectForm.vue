<script setup>
	import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
	import Datepicker from 'vue3-datepicker'
	import { projectFieldsArr, projectGranteeFieldsArr } from '@/module/vars'
	import Tiptap from '@/components/Wysiwyg/Tiptap.vue'
	import FileForm from '@/components/Common/FileForm.vue'
	import RadioDropdown from '@/components/Common/RadioDropdown.vue'
	import { useDateModule } from '@/module/dateModule'
	import { isEmail, isPhone, isValidURL } from '@/functions/validation'
	import { useCommonStore } from '@/store/common'
	import { projectsApi } from '@/api/api'
	import Tippy from '../Icons/Tippy.vue'
	const props = defineProps({
		projectItem: Object,
	})
	const emit = defineEmits(['setFields'])
	const storeCommon = useCommonStore()
	const phoneMask = (event, item) => {
		let value =
			event.target.value[0] === '+'
				? event.target.value.replace(/\D/g, '').substring(1)
				: event.target.value.replace(/\D/g, '')
		if (value.length > 0) {
			value =
				'+7 ' +
				value.substring(0, 3) +
				(value.length > 3 ? '-' : '') +
				value.substring(3, 6) +
				(value.length > 6 ? '-' : '') +
				value.substring(6, 8) +
				(value.length > 8 ? '-' : '') +
				value.substring(8, 10)
		}
		if (value.length === 0) {
			value = ''
		}
		event.target.value = value.substring(0, 16)
		item.value = value.substring(0, 16)
	}
	const file = {
		types: ['application/pdf'],
		format: '.pdf',
		size: 5 * 1024 * 1024,
	}
	const fileForm = useTemplateRef('fileForm')
	const granteeFileForm = useTemplateRef('granteeFileForm')
	const selectedGrantee = ref('1')
	const execTime = reactive({
		start: null,
		end: null,
	})
	const { locale, format, placeholder, setEndLowerLimit, parseDateValue } =
		useDateModule()
	const endLowerLimit = computed(() => setEndLowerLimit(execTime.start))
	const onStartDateChange = () => {
		if (execTime.end && new Date(execTime.start) >= new Date(execTime.end)) {
			execTime.end = endLowerLimit.value
		}
	}
	const fields = ref([
		[...projectFieldsArr],
		[
			...projectGranteeFieldsArr.find(
				item => item.value === selectedGrantee.value
			).data,
		],
	])
	const granteeOnChange = (idx, value) => {
		granteeFileForm.value.forEach(item => {
			item.resetForm()
			item.abort()
		})
		selectedGrantee.value = value
		fields.value[0][idx].value = value
		fields.value[1] = [
			...projectGranteeFieldsArr
				.find(item => item.value === selectedGrantee.value)
				.data.map(item => ({
					...item,
					value: item.type === 'granteeFile' ? [] : '',
					error: false,
				})),
		]
	}
	const setFileValue = (name, value) => {
		fields.value.forEach(arr => {
			arr.forEach(item => {
				if (item.translitName === name) {
					item.value = value.length > 0 ? [...value] : []
				}
			})
		})
	}
	const fileIsError = (name, value) => {
		fields.value.forEach(arr => {
			arr.forEach(item => {
				if (item.translitName === name && item.required) {
					item.error = value
				}
			})
		})
	}
	const selectOnChange = (name, value) => {
		fields.value.forEach(arr => {
			arr.forEach(item => {
				if (item.translitName === name) {
					item.value = value
				}
			})
		})
	}
	const resetForm = () => {
		selectedGrantee.value = '1'
		execTime.start = null
		execTime.end = null
		fileForm.value.forEach(item => {
			item.resetForm()
			item.abort()
		})
		granteeFileForm.value.forEach(item => {
			item.resetForm()
			item.abort()
		})
		fields.value.forEach(arr => {
			arr.forEach(item => {
				if (item.translitName === 'direction') {
					setInitDirectionVal()
				} else if (['radio'].includes(item.type)) {
					item.value = '1'
				} else if (['image', 'file', 'granteeFile'].includes(item.type)) {
					item.value = []
				} else {
					item.value = ''
					if (item.data) {
						item.data.forEach(el => {
							if (
								['image', 'file', 'granteeFile'].includes(el.type)
							) {
								el.value = []
							} else {
								el.value = ''
							}
						})
					}
				}
				item.error = false
			})
		})
	}
	const onModerate = () => {
		fields.value.forEach(arr => {
			arr.forEach(item => {
				if (item.required) {
					if (item.type === 'email' && !isEmail(item.value)) {
						item.errorTxt = item.value
							? 'Некорректный email'
							: 'Заполните поле'
						item.error = true
					} else if (item.type === 'tel' && !isPhone(item.value)) {
						item.error = true
					} else if (item.type === 'link' && !isValidURL(item.value)) {
						item.errorTxt = item.value
							? 'Некорректная ссылка'
							: 'Заполните поле'
						item.error = true
					} else {
						item.error =
							item.value > 0 || item.value.length > 0 ? false : true
					}
				}
			})
		})
	}
	const onDraft = () => {
		fields.value.forEach(arr => {
			arr.forEach(item => {
				if (item.required) {
					if (item.translitName === 'title') {
						item.error =
							item.value > 0 || item.value.length > 0 ? false : true
					} else {
						item.error = false
					}
				}
			})
		})
	}
	defineExpose({ resetForm, onModerate, onDraft, execTime })
	const setInitDirectionVal = () => {
		fields.value.forEach(arr => {
			arr.forEach(item => {
				if (item.translitName === 'direction') {
					item.value = storeCommon.directionArr.length
						? storeCommon.directionArr[0].value
						: ''
				}
			})
		})
	}
	let initialValues
	const setInitVal = () => {
		setInitDirectionVal()
		if (props.projectItem) {
			fields.value.forEach(arr => {
				arr.forEach((item, idx) => {
					let key = item.translitName
					if (props.projectItem.hasOwnProperty(key)) {
						switch (key) {
							case 'grantee':
								granteeOnChange(idx, props.projectItem[key].value)
								setTimeout(() => {
									fields.value[1].forEach(el => {
										let elKey = el.translitName
										if (
											props.projectItem[key].hasOwnProperty(
												elKey
											)
										) {
											el.value = props.projectItem[key][elKey]
										}
									})
								}, 0)
								break
							case 'execTime':
								let execTimeArr = props.projectItem[key].split('-')
								execTime.start = execTimeArr[0]
									? parseDateValue(execTimeArr[0])
									: null
								execTime.end = execTimeArr[1]
									? parseDateValue(execTimeArr[1])
									: null
								break
							case 'social':
								props.projectItem[key].forEach((el, i) => {
									item.data[i].value = el
								})
								break
							default:
								item.value = props.projectItem[key]
						}
						initialValues = props.projectItem
					}
				})
			})
		}
	}
	const fieldTemplates = ref([])
	onMounted(async () => {
		setInitVal()
		try {
			const { data } = await projectsApi.getFileTemplates()
			fieldTemplates.value = [...data]
		} catch (err) {
			console.log(err)
		}
	})
	watch(
		() => fields.value,
		() => {
			fields.value.forEach(arr => {
				arr.forEach(item => {
					if (item.error && (item.value > 0 || item.value.length > 0)) {
						if (item.type === 'email') {
							if (isEmail(item.value)) {
								item.error = false
							}
						} else if (item.type === 'tel') {
							if (isPhone(item.value)) {
								item.error = false
							}
						} else if (item.type === 'link') {
							if (isValidURL(item.value)) {
								item.error = false
							}
						} else {
							item.error = false
						}
					}
				})
			})
			emit('setFields', fields.value)
		},
		{ deep: true }
	)
	watch(
		() => props.projectItem,
		() => setInitVal()
	)
	watch(
		() => storeCommon.directionArr,
		() => setInitDirectionVal
	)
</script>
<template>
	<div class="project-p__inner">
		<div class="mb-60 project-p__sec">
			<div class="project-p__info">
				<template v-for="(arr,i) in fields" :key="i">
					<div class="info-project" v-for="(item,idx) in arr" :key="idx" :data-name="item.translitName">
						<div class="info-project__col">
							<span class="h6 info-project__lbl">{{ item.name + (item.label ? ` (${item.label})` : '') + ( item.required ? '*' : '' )}}:
								<template v-if="fieldTemplates.length">
									<template v-for="(temp,idx) in fieldTemplates" :key="idx">
										<template v-if="temp.paramName === item.translitName">
											<a v-if="item.translitName === 'budget'" :href="temp.url" download>Шаблон сметы проекта</a>
											<a v-else-if="item.translitName === 'calendarPlan'" :href="temp.url" download>Шаблон календарного плана</a>
										</template>
									</template>
								</template>
							</span>
						</div>
						<div class="info-project__col">
							<template v-if="item.translitName === 'grantee'">
								<div class="radio__items" v-if="storeCommon.granteeArr.length">
									<label class="item-checkbox" v-for="(el,index) in storeCommon.granteeArr" :key="index">
										<input type="radio" :value="el.value" :checked="el.value === selectedGrantee" @change="()=>granteeOnChange(idx,el.value)">
										<span>
											{{ el.name }}
											<svg>
												<path d="M2 6.15L4.4 8.6L10.1 3" />
											</svg>
										</span>
									</label>
								</div>
							</template>
							<template v-else-if="item.translitName === 'direction'">
								<RadioDropdown v-if="storeCommon.directionArr.length" :name="item.translitName" :items="storeCommon.directionArr" :selected="item.value" @onChange="selectOnChange">
									<span class="selected">{{ storeCommon.directionArr.find(el => el.value === item.value) ? storeCommon.directionArr.find(el => el.value === item.value).name : storeCommon.directionArr[0].name }}</span>
								</RadioDropdown>
								<span data-error="" v-if="item.error">{{ item.errorTxt }}</span>
							</template>
							<div class="info-project__file" v-else-if="['file', 'granteeFile', 'image'].includes(item.type)">
								<FileForm :class="`info-project__file--${item.type}`" :maxWidth="item.validate?.width ? Number(item.validate.width) : null" :maxHeight="item.validate?.height ? Number(item.validate.height) : null" :isMultiple="item.isMultiple" :name="item.translitName" :ref="item.type === 'granteeFile' ? 'granteeFileForm' : 'fileForm'" :types="item.validate?.types || file.types" :emptyError="item.error" :format="item.validate?.format || file.format" :maxSize="item.validate?.size || file.size" @setFileFieldValue="setFileValue" @fileFieldIsError="fileIsError" :initValue="item.type === 'granteeFile' ? initialValues && initialValues.grantee && initialValues.grantee[item.translitName] && initialValues.grantee[item.translitName] : initialValues && initialValues[item.translitName] && initialValues[item.translitName]" />
								<div class="info-project__file-info" v-if="item.type === 'image'">
									<p>Желательный размер не менее {{ item.validate?.width }}x{{ item.validate?.height }}&nbsp;px, не более {{ item.validate?.size / 1024 /1024}}&nbsp;Мб</p>
									<p>Допустимые форматы изображения: {{String(item.validate?.format).split(", ").map(ext => ext.replace(/^\./, "")).join(", ").toUpperCase()}}</p>
									<p>Важно! На фото не должно быть надписей и водяных знаков</p>
								</div>
								<div class="info-project__file-info" v-else>
									<p>Допустимые форматы: {{ String(item.validate?.format || file.format).split(", ").map(ext => ext.replace(/^\./, "")).join(", ").toUpperCase() }}</p>
									<p>Размер файла не более {{ (item.validate?.size || file.size) / 1024 / 1024}}&nbsp;мб</p>
								</div>
							</div>
							<div class="info-project__grid" v-else-if="item.type === 'date'">
								<div :class="['item-form item-form--date',item.error && !!execTime.start && 'error']">
									<Datepicker v-model="execTime.start" :locale="locale" :inputFormat="format" :placeholder="placeholder" :lowerLimit="new Date()" @closed="onStartDateChange" />
									<div data-error="" v-if="!!execTime.start && item.error">{{ item.errorTxt }}</div>
								</div>
								<div :class="['item-form item-form--date',item.error && !!execTime.end && 'error']">
									<Datepicker v-model="execTime.end" :locale="locale" :inputFormat="format" :placeholder="placeholder" :lowerLimit="endLowerLimit" />
									<div data-error="" v-if="!!execTime.end && item.error">{{ item.errorTxt }}</div>
								</div>
							</div>
							<div class="info-project__grid" v-else-if="item.type === 'social'">
								<div :class="['item-form item-form--social', `item-form--${el.translitName}`]" v-for="(el,index) in item.data" :key="index">
									<input type="text" :placeholder="el.placeholder" v-model="el.value">
								</div>
							</div>
							<div :class="['item-form', item.error && 'error']" v-else>
								<Tiptap v-if="item.type === 'html'" v-model="item.value" />
								<input v-else-if="item.type === 'tel'" type="text" placeholder="+7" :value="item.value" @input="e=>phoneMask(e,item)" maxlength="16" />
								<input v-else-if="item.type === 'number'" type="number" pattern="[0-9]*" inputmode="decimal" :placeholder="item.placeholder" v-model="item.value">
								<input v-else-if="item.type === 'link'" type="text" :placeholder="item.placeholder" v-model="item.value">
								<input :type="item.type || 'text'" :placeholder="item.placeholder" v-model="item.value" v-else>
								<span data-error="" v-if="item.error">{{ item.errorTxt }}</span>
							</div>
							<div v-if="item.notyTxt" class="info-project__noty">
								<Tippy />
								<p>{{ item.notyTxt }}</p>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>