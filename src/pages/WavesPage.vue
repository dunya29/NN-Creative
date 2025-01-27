<script setup>
	import { onBeforeMount, ref } from 'vue'
	import simplebar from 'simplebar-vue'
	import { wavesApi } from '@/api/api'
	import Plus from '@/components/Icons/Plus.vue'
	import AddEditWaveMod from '@/components/Modals/AddEditWaveMod.vue'
	import ErrorMod from '@/components/Modals/ErrorMod.vue'
	import SuccessMod from '@/components/Modals/SuccessMod.vue'
	import PageWrap from '@/components/PageWrap.vue'
	import WavesCard from '@/components/Waves/WavesCard.vue'
	const waves = ref([])
	const success = ref(false)
	const successTitle = ref('')
	const error = ref(false)
	const errorTitle = ref('')
	const fetchItems = async () => {
		try {
			const { data } = await wavesApi.getItems()
			waves.value = [...data]
		} catch (err) {
			console.log(err)
		}
	}
	const addWaveModal = ref(false)
	const addWave = async (data, callback) => {
		try {
			await wavesApi.postItem(data)
			fetchItems()
			success.value = true
			successTitle.value = 'Новая волна успешно добавлена'
			addWaveModal.value = false
		} catch (err) {
			console.log(err)
			error.value = true
			errorTitle.value = 'Что-то пошло не так'
		} finally {
			callback()
		}
	}
	const delWave = async (id, callback) => {
		try {
			await wavesApi.delItem(id)
			fetchItems()
		} catch (err) {
			console.log(err)
		} finally {
			callback()
		}
	}
	const editWave = async (id, data, callback) => {
		try {
			await wavesApi.editItem(id, data)
			fetchItems()
		} catch (err) {
			console.log(err)
		} finally {
			callback()
		}
	}
	onBeforeMount(fetchItems)
</script>
<template>
	<PageWrap>
		<section class="section waves">
			<div class="container">
				<div class="sec-top">
					<h1>Волны</h1>
					<button class="btn main-btn" @click="()=> addWaveModal = true">
						<span>Добавить волну</span>
						<Plus />
					</button>
				</div>
				<simplebar class="table-block table-block-waves">
					<table>
						<thead>
							<tr>
								<td>Название волны</td>
								<td>Начало</td>
								<td>Конец</td>
								<td></td>
							</tr>
						</thead>
						<tbody v-if="waves">
							<WavesCard v-for="item in waves" :key="item.id" :disabledDates="waves.filter(el => el.id !== item.id)" :id="item.id" :name="item.name" :start="item.start" :end="item.end" @delWave="delWave" @editWave="editWave" />
						</tbody>
					</table>
				</simplebar>
			</div>
			<Teleport to="body">
				<transition name="fadeUp">
					<AddEditWaveMod v-if="addWaveModal" title="Добавление волны" :waves="waves" @editWave="addWave" @closeModal="()=>addWaveModal = false" />
				</transition>
			</Teleport>
			<Teleport to="body">
				<transition name="fadeUp">
					<SuccessMod v-if="success" @closeModal="()=>success = false" :title="successTitle" />
				</transition>
			</Teleport>
			<Teleport to="body">
				<transition name="fadeUp">
					<ErrorMod v-if="error" @closeModal="()=>error = false" :title="errorTitle" />
				</transition>
			</Teleport>
		</section>
	</PageWrap>
</template>