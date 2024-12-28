<script setup>
	import {
		directionArr,
		granteeArr,
		projectFieldsArr,
		projectGranteeFieldsArr,
	} from '@/module/vars'
	import Download from '../Icons/Download.vue'
	import { getFileURL, getImageURL } from '@/functions/getURL'
	import { computed } from 'vue'
	const props = defineProps({
		projectItem: Object,
		userRole: String,
	})
	const projectFields = projectFieldsArr.filter(
		item => item.translitName != 'title'
	)
	const projectFileFields = [
		...projectFieldsArr.filter(item => item.type === 'file'),
	]
	const granteeFields = computed(() =>
		projectGranteeFieldsArr.find(
			item =>
				props.projectItem.grantee &&
				item.value === props.projectItem.grantee.value
		)
	)
	const projectAllFileFields = computed(() => {
		if (props.projectItem.grantee) {
			let granteeFiles = granteeFields.value.data.filter(
				item => item.type === 'granteeFile'
			)
			let allFiles = []
			projectFileFields.forEach(item => {
				if (props.projectItem[item.translitName].length > 0) {
					allFiles.push(...props.projectItem[item.translitName])
				}
			})
			granteeFiles.forEach(item => {
				if (props.projectItem.grantee[item.translitName].length > 0) {
					allFiles.push(...props.projectItem.grantee[item.translitName])
				}
			})
			return allFiles
		} else {
			return []
		}
	})
	const downloadFiles = () => {
		projectAllFileFields.value.forEach(el => {
			const a = document.createElement('a')
			a.href = getFileURL(el.url)
			a.style.display = 'none'
			a.download = el.name
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
		})
	}
</script>
<template>
	<div class="project-p__inner">
		<section class="mb-60 project-p__sec">
			<div class="sec-top">
				<h2 class="h1">{{ projectItem.title }}</h2>
				<button class="btn main-btn" v-if="userRole === 'manager' && projectAllFileFields.length > 0" @click="()=>downloadFiles()">
					<span>Скачать все файлы</span>
					<Download />
				</button>
			</div>
			<div class="project-p__info">
				<div class="info-project" v-if="userRole !== 'manager'">
					<div class="info-project__col">
						<span class="h6 info-project__lbl">Документы</span>
					</div>
					<div class="info-project__col">
						<div class="info-project__files">
							<template v-for="(item,idx) in projectFileFields" :key="idx">
								<template v-if="projectItem[item.translitName] && projectItem[item.translitName].length">
									<a class="btn main-btn" download :href="getFileURL(el.url)" v-for="(el,idx) in projectItem[item.translitName]" :key="idx">
										<span>{{item.name}}</span>
										<Download />
									</a>
								</template>
							</template>
						</div>
					</div>
				</div>
				<div class="info-project" v-if="userRole !== 'user'">
					<div class="info-project__col">
						<span class="h6 info-project__lbl">Автор:</span>
					</div>
					<div class="info-project__col">
						<div class="page-conten">
							<p>{{ projectItem.author }}</p>
						</div>
					</div>
				</div>
				<div class="info-project" v-for="(item,idx) in projectFields" :key="idx">
					<div class="info-project__col">
						<span class="h6 info-project__lbl">{{ item.name}}:</span>
					</div>
					<div class="info-project__col">
						<div class="info-project__image" v-if="item.type === 'image'">
							<div :class="['media-cover', projectItem[item.translitName] && !projectItem[item.translitName].length && 'no-photo']">
								<img v-if="projectItem[item.translitName] && projectItem[item.translitName].length" :src="getImageURL(projectItem[item.translitName][0].url,870)" :alt="projectItem.title" loading="lazy">
							</div>
						</div>
						<div v-else-if="item.type === 'radio'">
							<p v-if="item.translitName === 'grantee' && projectItem['grantee']">{{ granteeArr.find(item => item.value === projectItem['grantee'].value).name }}</p>
						</div>
						<div v-else-if="item.type === 'file'">
							<div class="info-project__files" v-if="projectItem[item.translitName] && projectItem[item.translitName].length">
								<a class="btn main-btn" download :href="getFileURL(el.url)" v-for="(el,idx) in projectItem[item.translitName]" :key="idx">
									<span>Скачать</span>
									<Download />
								</a>
							</div>
						</div>
						<div class="info-project__soc" v-else-if="item.type === 'social'">
							<div :class="['info-project__soc-item', `info-project__soc-item--${el.translitName}`]" v-for="(el,index) in item.data" :key="index">
								<a :href="projectItem[item.translitName][index]" target="_blank" v-if="projectItem[item.translitName] && projectItem[item.translitName][index]">{{ projectItem[item.translitName][index] }}</a>

							</div>
						</div>
						<div class="page-content" v-else-if="item.type === 'html'" v-html="projectItem[item.translitName]"></div>
						<div class="page-content" v-else>
							<p v-if="item.translitName === 'direction'">{{ directionArr.find(item => item.value === projectItem.direction)?.name }}</p>
							<p v-else-if="item.translitName === 'sum'">{{ projectItem[item.translitName] ? String(projectItem[item.translitName]).replace(/\B(?=(\d{3})+(?!\d))/g, " ").trim() : 0}} руб.</p>
							<p v-else-if="item.translitName === 'phone'"><a :href="'tel:'+ projectItem[item.translitName]">{{ projectItem[item.translitName] }}</a></p>
							<p v-else-if="item.translitName === 'email'"><a :href="'mailto:'+ projectItem[item.translitName]">{{ projectItem[item.translitName] }}</a></p>
							<p v-else-if="item.type === 'link'"><a :href="projectItem[item.translitName]" target="_blank">{{ projectItem[item.translitName] }}</a></p>
							<p v-else>{{ projectItem[item.translitName] }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="mb-60 project-p__sec" v-if="projectItem['grantee']">
			<div class="sec-top">
				<h2>Грантополучатель</h2>
			</div>
			<div class="project-p__info">
				<template v-for="(item,idx) in granteeFields.data" :key="idx">
					<div class="info-project" v-if="projectItem.grantee[item.translitName]">
						<div class="info-project__col">
							<span class="h6 info-project__lbl">{{ item.name}}:</span>
						</div>
						<div class="info-project__col">
							<div class="info-project__files" v-if="item.type === 'granteeFile' && projectItem.grantee[item.translitName].length">
								<a class="btn main-btn" download :href="getFileURL(el.url)" v-for="(el,idx) in projectItem.grantee[item.translitName]" :key="idx">
									<span>Скачать</span>
									<Download />
								</a>
							</div>
							<div class="page-content" v-else-if="item.type === 'html'" v-html="projectItem.grantee[item.translitName]"></div>
							<div class="page-content" v-else-if="!['granteeFile', 'html'].includes(item.type)">
								<p>{{ projectItem.grantee[item.translitName] }}</p>
							</div>
						</div>
					</div>
				</template>
			</div>
		</section>
	</div>
</template>