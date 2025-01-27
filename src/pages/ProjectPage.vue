<script setup>
	import { provide, ref, useTemplateRef, onBeforeMount} from 'vue'
	import { useRouter } from 'vue-router'
	import ProjectForm from '@/components/Projects/ProjectForm.vue'
	import ProjectTop from '@/components/Projects/ProjectTop.vue'
	import { projectFieldsArr, projectGranteeFieldsArr } from '@/module/vars'
	import PageWrap from '@/components/PageWrap.vue'
	import { useProjectModule } from '@/module/projectModule'
	const fields = ref([
		[...projectFieldsArr],
		[...projectGranteeFieldsArr[0].data],
	])
	const router = useRouter()
	const projectForm = useTemplateRef('projectForm')
	const setFields = obj => {
		fields.value = obj
	}
	const closeProjectMod = () => {
		router.push('/projects')
	}
	onBeforeMount(() => {
		useProjectModule()
	})
	provide('closeProjectMod', closeProjectMod)
</script>
<template>
	<PageWrap>
		<section class="project-p project-p--main">
			<div class="container">
				<ProjectTop :fields="fields" :projectForm="projectForm" />
				<div class="project-p__body">
					<ProjectForm ref="projectForm" @setFields="setFields" />
				</div>
			</div>
		</section>
	</PageWrap>
</template>