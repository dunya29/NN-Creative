<script setup>
	import { onMounted, onUnmounted, ref } from 'vue'
	import Chat from '../Icons/Chat.vue'
	import MessagesView from './MessagesView.vue'
	import { useAuthStore } from '@/store/auth'
	import { useCommonStore } from '@/store/common'

	const props = defineProps({
		projectId: Number,
		showChat: Boolean
	})
	const emit = defineEmits(['setChat'])
	const storeAuth = useAuthStore()
	const storeCommon = useCommonStore()
	const messages = ref([])
	const unReadMessages = ref([])
	const messagesRef = ref(null)
	const getMessages = async () => {
		const items = [
			{
				id: 1734783643955,
				user_id: 3,
				timestamp: '2024-12-11T15:08:52.143Z',
				text: 'Добрый день! Спасибо за обратную связь, обязательно поправим)',
				isRead: true,
			},
			{
				id: 1734783643956,
				user_id: 3,
				timestamp: '2024-12-11T15:08:52.143Z',
				text: 'Добрый день! Спасибо за обратную связь, обязательно поправим)',
				isRead: true,
			},
			{
				id: 1734783643957,
				user_id: 1,
				timestamp: '2024-12-11T15:08:52.143Z',
				text: 'Добрый день! Фокус проекта сместился на проработку вопросов Веранды. Просим отразить данные изменения в заявке проекта',
				isRead: true,
			},
			{
				id: 1734783643958,
				user_id: 1,
				timestamp: '2024-12-11T15:08:52.143Z',
				text: 'Добрый день! Фокус проекта сместился на проработку вопросов Веранды. Просим отразить данные изменения в заявке проекта',
				isRead: true,
			},
			{
				id: 1734783643959,
				user_id: 3,
				timestamp: '2024-12-11T15:08:52.143Z',
				text: 'Добрый день! Спасибо за обратную связь, обязательно поправим)',
				isRead: false,
			},
		]
		messages.value = [...items]
		unReadMessages.value = messages.value.filter(
			item => item['user_id'] !== storeAuth.userData.id && !item.isRead
		)
	}
	const onRead = () => {
		if (unReadMessages.value.length > 0) {
			unReadMessages.value.forEach(async item => {
				console.log('onRead')
			})
		}
	}
	const sendMessage = async (message, callback) => {
		console.log(message)
		callback()
	}
	const handleClickOutside = event => {
		if (
			props.showChat &&
			messagesRef.value &&
			!messagesRef.value.contains(event.target)
		) {
			emit('setChat', false)
		}
	}
	onMounted(() => {
		getMessages()
		if (storeCommon.isNotyClicked) {
			emit('setChat', true)
			storeCommon.notyOnSeen()
		}
		window.addEventListener('click', handleClickOutside)
	})
	onUnmounted(() => {
		window.removeEventListener('click', handleClickOutside)
	})
</script>
<template>
	<div class="project-chat" ref="messagesRef">
		<button :class="['btn stroke-btn project-chat__btn btn--icon', unReadMessages.length > 0 && 'unread']" @click="() => emit('setChat', !showChat)">
			<span>Чат{{ unReadMessages.length ? unReadMessages.length > 99 ? ' 99+' : ` (${unReadMessages.length})` : ''}}</span>
			<Chat />
		</button>
		<transition name="fadeUp">
			<MessagesView v-if="showChat" :messages="messages" :userId="storeAuth.userData.id" @sendMessage="sendMessage" @onRead="onRead" />
		</transition>
	</div>
</template>