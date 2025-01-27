<script setup>
	import { onMounted, onUnmounted, ref } from 'vue'
	import Chat from '../Icons/Chat.vue'
	import MessagesView from './MessagesView.vue'
	import { useAuthStore } from '@/store/auth'
	import { useCommonStore } from '@/store/common'
	import { messagesApi } from '@/api/api'

	const props = defineProps({
		projectId: Number,
		showChat: Boolean,
	})
	const emit = defineEmits(['setChat'])
	const storeAuth = useAuthStore()
	const storeCommon = useCommonStore()
	const mounted = ref(false)
	const messages = ref([])
	const unReadMessages = ref([])
	const messagesRef = ref(null)
	const getMessages = async () => {
		try {
			const { data } = await messagesApi.getItems({
				project_id: props.projectId,
			})
			messages.value = [...data]
			unReadMessages.value = messages.value.filter(
				item => Number(item['user_id']) !== Number(storeAuth.userData.id) && !item.isRead
			)
		} catch (err) {
			console.log(err)
		} finally {
			if (mounted.value) {
				getMessages()
			}
		}
	}
	const onRead = async () => {
		await getMessages()
		try {
			if (unReadMessages.value.length > 0) {
				let isReadArr = unReadMessages.value.map(item => ({
					id: item.id,
					isRead: true,
				}))
				await messagesApi.editItem({
					isRead: {
						user_id: storeAuth.userData.id,
						project_id: props.projectId,
						isReadArr,
					},
				})
			}
		} catch (err) {
			console.log(err)
		}
	}
	const sendMessage = async (message, onSuccess, callback) => {
		try {
			let messageObj = {
				project_id: props.projectId,
				message: {
					user_id: storeAuth.userData.id,
					text: message,
					isRead: false,
				},
			}
			await messagesApi.postItem(messageObj)
			await getMessages()
			onSuccess()
		} catch (err) {
			console.log(err)
		} finally {
			callback()
		}
		
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
		mounted.value = true
		getMessages()
		if (storeCommon.isNotyClicked) {
			emit('setChat', true)
			storeCommon.notyOnSeen()
		}
		window.addEventListener('click', handleClickOutside)
	})
	onUnmounted(() => {
		mounted.value = false
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