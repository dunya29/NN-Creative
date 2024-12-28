<script setup>
	import { booleanArr, directionArr } from '@/module/vars'
	import { ref } from 'vue'
	import CommentMod from '../Modals/CommentMod.vue'
	import Plus from '../Icons/Plus.vue'
	import Eye from '../Icons/Eye.vue'
	import { useDateModule } from '@/module/dateModule'
	import { useCommonStore } from '@/store/common'
	const props = defineProps({
		item: Object,
	})
	const storeCommon = useCommonStore()
	const { formatDateValue } = useDateModule()
	const statusObj = storeCommon.statusArr.find(el => el.value === props.item.status)
	const commentModal = ref(false)
	const closeCommentModal = () => {
		commentModal.value = false
	}
</script>
<template>
	<tr>
		<td class="center">{{ item.id }}</td>
		<td class="center"> {{ item.wave }}</td>
		<td class="center">{{ item.moderateDate ? formatDateValue(item.moderateDate) : '-' }}</td>
		<td class="center">{{ item.deadline ? formatDateValue(item.deadline) : '-' }}</td>
		<td>
			<span class="status">
				<span class="status__bg" :style="`background-color: ${statusObj.color}`"></span>
				{{ statusObj.name }}</span>
		</td>
		<td>{{ directionArr.find(el => el.value === item.direction).name }}</td>
		<td>
			<h5>{{ item.title }}</h5>
		</td>
		<td>{{ item.author }}</td>
		<td class="center">{{ String(item.sum).replace(/\B(?=(\d{3})+(?!\d))/g, " ").trim() }}</td>
		<td class="center">{{ item.phone }}</td>
		<td class="center">{{ booleanArr.find(el => el.value === item.isExpertSeen).name }}</td>
		<td class="center">{{ booleanArr.find(el => el.value === item.isWgSeen).name }}</td>
		<td class="page-icons">
			<div class="page-icon" @click="() => commentModal = true" v-if="item.comment">
				<Eye />
			</div>
			<div class="page-icon" @click="() => commentModal = true" v-else>
				<Plus />
			</div>
		</td>
	</tr>
	<Teleport to="body">
		<transition name="fadeUp">
			<CommentMod v-if="commentModal" :id="item.id" :title="item.title" :comment="item.comment" @closeModal="closeCommentModal" />
		</transition>
	</Teleport>
</template>