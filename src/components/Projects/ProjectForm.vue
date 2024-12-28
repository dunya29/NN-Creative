<script setup>
	import { computed, onMounted, reactive, ref, useTemplateRef, watch } from 'vue'
	import Datepicker from 'vue3-datepicker'
	import { MaskInput } from 'vue-3-mask'
	import { projectFieldsArr, projectGranteeFieldsArr } from '@/module/vars'
	import Tiptap from '@/components/Wysiwyg/Tiptap.vue'
	import FileForm from '@/components/Common/FileForm.vue'
	import RadioDropdown from '@/components/Common/RadioDropdown.vue'
	import { useDateModule } from '@/module/dateModule'
	import { isEmail, isPhone, isValidURL } from '@/functions/validation'
	const props = defineProps({
		projectItem: Object,
	})
	const emit = defineEmits(['setFields'])
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
		console.log(name, value)
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
				if (['radio', 'select'].includes(item.type)) {
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
	defineExpose({ resetForm, onModerate, execTime })
	let initialValues
	const setInitVal = () => {
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
	onMounted(setInitVal)
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
</script>
<template>
	<div class="project-p__inner">
		<div class="mb-60 project-p__sec">
			<div class="project-p__info">
				<template v-for="(arr,i) in fields" :key="i">
					<div class="info-project" v-for="(item,idx) in arr" :key="idx" :data-name="item.translitName">
						<div class="info-project__col">
							<span class="h6 info-project__lbl">{{ item.name + ( item.required ? '*' : '' )}}:</span>
						</div>
						<div class="info-project__col">
							<div class="radio__items" v-if="item.type === 'radio'">
								<label class="item-checkbox" v-for="(el,index) in item.data" :key="index">
									<input type="radio" :value="el.value" :checked="el.value === selectedGrantee" @change="()=>granteeOnChange(idx,el.value)">
									<span>
										{{ el.name }}
										<svg>
											<path d="M2 6.15L4.4 8.6L10.1 3" />
										</svg>
									</span>
								</label>
							</div>
							<RadioDropdown v-else-if="item.type === 'select'" :name="item.translitName" :items="item.data" :selected="item.value" @onChange="selectOnChange">
								<span class="selected">{{ item.data.find(el => el.value === item.value).name }}</span>
							</RadioDropdown>
							<div class="info-project__file" v-else-if="['file', 'granteeFile', 'image'].includes(item.type)">
								<FileForm :class="`info-project__file--${item.type}`" :isMultiple="item.isMultiple" :name="item.translitName" :ref="item.type === 'granteeFile' ? 'granteeFileForm' : 'fileForm'" :types="item.validate?.types || file.types" :emptyError="item.error" :format="item.validate?.format || file.format" :maxSize="item.validate?.size || file.size" @setFileFieldValue="setFileValue" @fileFieldIsError="fileIsError" :initValue="item.type === 'granteeFile' ? initialValues && initialValues.grantee && initialValues.grantee[item.translitName] && initialValues.grantee[item.translitName] : initialValues && initialValues[item.translitName] && initialValues[item.translitName]" />
								<div class="info-project__file-info" v-if="item.type === 'image'">
									<p>Желательный размер не менее {{item.validate?.resolution}}&nbsp;px, не более {{ item.validate?.size / 1024 /1024}}&nbsp;Мб</p>
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
								<MaskInput v-else-if="item.type === 'tel'" placeholder="+7" v-model="item.value" mask="+7 ###-###-##-##" />
								<input v-else-if="item.type === 'number'" type="number" pattern="[0-9]*" inputmode="decimal" :placeholder="item.placeholder" v-model="item.value">
								<input v-else-if="item.type === 'link'" type="text" :placeholder="item.placeholder" v-model="item.value">
								<input :type="item.type || 'text'" :placeholder="item.placeholder" v-model="item.value" v-else>
								<span data-error="" v-if="item.error">{{ item.errorTxt }}</span>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>