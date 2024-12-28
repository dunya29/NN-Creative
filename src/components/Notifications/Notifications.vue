<script setup>
	import { onMounted, onUnmounted, ref, watch } from 'vue'
	import { RouterLink } from 'vue-router'
	import NotificationsIcon from '../Icons/NotificationsIcon.vue'
	import NotificationCard from './NotificationCard.vue'

	const props = defineProps({
		isHeaderHidden: Boolean,
	})
	const showNotifications = ref(false)
	const readNotifications = ref([])
	const unReadNotifications = ref([])
	const notificationsRef = ref(null)
	const getNotifications = async () => {
		const items = [
			{
				id: 1734783643968,
				timestamp: '2024-12-11T15:08:52.143Z',
				project_id: 2,
				title: 'Минин и Пожарский спасают Нижний Новгород',
				imageURL: [
					{
						name: 'doc-preview.jpg',
						url: 'projects/project.jpg',
					},
				],
				isRead: false,
			},
			{
				id: 1734783643967,
				timestamp: '2024-12-11T15:08:52.143Z',
				project_id: 2,
				title: 'Минин и Пожарский спасают Нижний Новгород',
				imageURL: [
					{
						name: 'doc-preview.jpg',
						url: 'projects/project.jpg',
					},
				],
				isRead: false,
			},
			{
				id: 1734783643966,
				timestamp: '2024-12-11T15:08:52.143Z',
				project_id: 1,
				title: 'Минин и Пожарский спасают Нижний Новгород',
				imageURL: [
					{
						name: 'doc-preview.jpg',
						url: 'projects/project.jpg',
					},
				],
				isRead: true,
			},
			{
				id: 1734783643965,
				timestamp: '2024-12-11T15:08:52.143Z',
				project_id: 2,
				title: 'Минин и Пожарский спасают Нижний Новгород',
				imageURL: [
					{
						name: 'doc-preview.jpg',
						url: 'projects/project.jpg',
					},
				],
				isRead: true,
			},
		]
		readNotifications.value = items.filter(item => item.isRead)
		unReadNotifications.value = items.filter(item => !item.isRead)
	}
	const onRead = async id => {
		console.log('onRead')
	}
	const handleClickOutside = event => {
		if (
			showNotifications.value &&
			notificationsRef.value &&
			!notificationsRef.value.contains(event.target)
		) {
			showNotifications.value = false
		}
	}
	onMounted(async () => {
		getNotifications()
		window.addEventListener('click', handleClickOutside)
	})
	onUnmounted(() => {
		window.removeEventListener('click', handleClickOutside)
	})
	watch(
		() => props.isHeaderHidden,
		() => {
			showNotifications.value = false
		}
	)
</script>
<template>
	<div class="header-notifications" ref="notificationsRef">
		<button :class="['header-notifications__btn',unReadNotifications.length && 'unread']" @click="() => showNotifications = !showNotifications">
			<NotificationsIcon />
		</button>
		<transition name="fadeUp">
			<div class="notifications" v-if="showNotifications">
				<div class="notifications__top">
					<NotificationsIcon />
					<span>Уведомления</span>
				</div>
				<p class="notifications__empty" v-if="!readNotifications.length && !unReadNotifications.length">У вас нет пока уведомлений</p>
				<div class="notifications__items" v-else>
					<div class="custom-scroll">
						<NotificationCard v-for="(item,idx) in unReadNotifications" :key="idx" :item="item" @onRead="onRead" />
						<template v-if="readNotifications.length">
							<p class="notifications__lbl">Просмотренные</p>
							<NotificationCard v-for="(item,idx) in readNotifications" :key="idx" :item="item" @onRead="onRead" />
						</template>
					</div>
				</div>
				<div class="notifications__footer" v-if="readNotifications.length || unReadNotifications.length">
					<RouterLink to="/notifications" class="btn main-btn" @click="() => showNotifications = false"><span>Посмотреть все</span></RouterLink>
				</div>
			</div>
		</transition>
	</div>
</template>