<script setup>
	import { provide, ref, watch } from 'vue'
	import { useRouter } from 'vue-router'
	import { registerApi } from '@/api/api'
	import Search from '@/components/Common/Search.vue'
	import Status from '@/components/Common/Status.vue'
	import RegisterCard from '@/components/Register/RegisterCard.vue'
	import { useTableModule } from '@/module/tableModule'
	import RadioDropdown from '@/components/Common/RadioDropdown.vue'
	import PageWrap from '@/components/PageWrap.vue'
	import Pagination from '@/components/Common/Pagination.vue'
	import simplebar from 'simplebar-vue'
	import ArrTop from '@/components/Icons/ArrTop.vue'
	import ArrBottom from '@/components/Icons/ArrBottom.vue'
	const router = useRouter()
	const registerItems = ref([])
	const totalCount = ref(null)
	const loading = ref(false)
	const fetchItems = async () => {
		try {
			loading.value = true
			const { data } = await registerApi.getItems({
				...params.value,
			})
			registerItems.value = [...data.items]
			totalCount.value = data.meta.total_items
			if (isMounted.value) {
				router.push({ query: queryParams.value })
			}
		} catch (err) {
			console.log(err)
		} finally {
			setTimeout(() => {
				loading.value = false
			}, 100)
		}
		return registerItems.value.length
	}
	const {
		isMounted,
		filters,
		params,
		queryParams,
		locationSearch,
		filterStatusArr,
		filterDirectionArr,
		filterBooleanArr,
		setOrder,
		statusOnChange,
		directionOnChange,
		expertSeenOnChange,
		wgSeenOnChange,
		setPage,
		checkSortParam
	} = useTableModule(false, fetchItems)
	const addComment = async (id, data, reset, callback) => {
		try {
			await registerApi.editComment(id, data)
			fetchItems()
			reset()
		} catch (err) {
			console.log(err)
		} finally {
			callback()
		}
	}
	provide('addComment', addComment)
</script>
<template>
	<PageWrap>
		<section class="section register-p">
			<div class="container">
				<div class="sec-top">
					<h1>Реестр</h1>
				</div>
				<div v-if="isMounted && !locationSearch && totalCount === 0" class="register-p__empty">
					<p>Проектов не найдено</p>
				</div>
				<div class="register-p__wrapper" v-else>
					<div v-if="totalCount === null || loading" class="page-loading loading"></div>
					<simplebar v-else class="table-block table-block-register">
						<table>
							<thead>
								<tr>
									<td class="center pointer item-order" @click="setOrder('id')">
										<span>Id</span>
										<span>
											<ArrTop :class="checkSortParam('id') && 'active'" />
											<ArrBottom :class="checkSortParam('-id') && 'active'" />
										</span>
									</td>
									<td class="center pointer item-order" @click="setOrder('wave')">
										<span>Волна</span>
										<span>
											<ArrTop :class="checkSortParam('wave') && 'active'" />
											<ArrBottom :class="checkSortParam('-wave') && 'active'" />
										</span>
									</td>
									<td class="center">
										Дата<br>Модерации
									</td>
									<td class="center">
										Сроки<br>доработки
									</td>
									<td class="pointer item-order" @click="setOrder('status')">
										<span>Статус</span>
										<span>
											<ArrTop :class="checkSortParam('status') && 'active'" />
											<ArrBottom :class="checkSortParam('-status') && 'active'" />
										</span>
									</td>
									<td class="pointer item-order" @click="setOrder('direction')">
										<span>Направление</span>
										<span>
											<ArrTop :class="checkSortParam('direction') && 'active'" />
											<ArrBottom :class="checkSortParam('-direction') && 'active'" />
										</span>
									</td>
									<td class="pointer item-order" @click="setOrder('title')">
										<span>Наименование</span>
										<span>
											<ArrTop :class="checkSortParam('title') && 'active'" />
											<ArrBottom :class="checkSortParam('-title') && 'active'" />
										</span>
									</td>
									<td class="pointer item-order" @click="setOrder('author')">
										<span>Автор</span>
										<span>
											<ArrTop :class="checkSortParam('author') && 'active'" />
											<ArrBottom :class="checkSortParam('-author') && 'active'" />
										</span>
									</td>
									<td class="pointer item-order" @click="setOrder('sum')">
										<span>Сумма</span>
										<span>
											<ArrTop :class="checkSortParam('sum') && 'active'" />
											<ArrBottom :class="checkSortParam('-sum') && 'active'" />
										</span>
									</td>
									<td>Телефон</td>
									<td class="center">Рассмотрен<br>ЭК</td>
									<td class="center">Рассмотрен<br>РГ</td>
									<td>Комментарий</td>
								</tr>
								<tr>
									<td>
										<Search type="number" v-model="filters.id" />
									</td>
									<td>
										<Search type="number" v-model="filters.wave" />
									</td>
									<td></td>
									<td></td>
									<td>
										<Status :items="filterStatusArr" :selected="filters.status" @onChange="statusOnChange" :isMobModal="true" title="Статус" />
									</td>
									<td>
										<RadioDropdown :items="filterDirectionArr" :selected="filters.direction" @onChange="directionOnChange" :isMobModal="true" title="Направление">
											<span :class="filters.direction && 'selected'">{{ filters.direction ? filterDirectionArr.find(item => item.value === filters.direction).name : "Фильтр" }}</span>
										</RadioDropdown>
									</td>
									<td>
										<Search v-model="filters.title" />
									</td>
									<td>
										<Search v-model="filters.author" />
									</td>
									<td></td>
									<td></td>
									<td>
										<RadioDropdown :items="filterBooleanArr" :selected="filters.isExpertSeen" @onChange="expertSeenOnChange" :isMobModal="true" title="Рассмотрен экспертной комиссией" />
									</td>
									<td>
										<RadioDropdown :items="filterBooleanArr" :selected="filters.isWgSeen" @onChange="wgSeenOnChange" :isMobModal="true" title="Рассмотрен рабочей группой" />
									</td>
									<td></td>
								</tr>
							</thead>
							<tbody v-if="totalCount > 0">
								<RegisterCard v-for="item in registerItems" :key="item.id" :item="item" />
							</tbody>
						</table>
					</simplebar>
					<Pagination v-if="totalCount && !loading" :currPage="filters.page" :totalCount="totalCount" @setPage="setPage" />
				</div>
			</div>
		</section>
	</PageWrap>
</template>