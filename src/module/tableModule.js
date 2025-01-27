import { computed, onBeforeMount, ref, watch } from "vue"
import { useRoute } from "vue-router"
import { booleanArr } from "./vars"
import { projectsApi, wavesApi } from "@/api/api"
import { useCommonStore } from "@/store/common"

export const useTableModule = (userRole = false, fetchItems = false) => {
	const route = useRoute()
	const limit = 12
	const filters = ref({})
	const isMounted = ref(false)
	const count = ref(null)
	const storeCommon = useCommonStore()
	if (route.name === 'notifications') {
		filters.value = {
			page: 1
		}
	} else if (['projects', 'search'].includes(route.name) && userRole) {
		filters.value = { id: '', title: '' }
		if (route.name === 'search') {
			filters.value.query = ""
		}
		switch (userRole) {
			case 'expert':
			case 'expertSpecComp':
				filters.value = {
					...filters.value,
					wave: '',
					direction: '',
					page: 1,
					sortBy: '-id'
				}
				break
			case 'user':
				filters.value = {
					...filters.value,
					status: '',
					page: 1,
					sortBy: '-id'
				}
			case 'manager':
				filters.value = {
					...filters.value,
					wave: '',
					status: '',
					year: "",
					page: 1,
					sortBy: '-id'
				}
				break
			case 'workingGroup':
				filters.value = {
					...filters.value,
					page: 1,
					sortBy: '-id',
				}
				break
		}
	} else if (route.name === 'register') {
		filters.value = {
			id: "",
			title: "",
			status: "",
			wave: "",
			direction: "",
			author: "",
			isWgSeen: "",
			isExpertSeen: "",
			page: 1,
			sortBy: '-id'
		}
	}
	const searchAll = ['title', 'author', 'query']
	const queryParams = ref({})
	const locationSearch = ref(0)
	const params = computed(() => {
		let search = {}
		queryParams.value = {}
		locationSearch.value = 0
		Object.entries(filters.value).forEach(item => {
			if (String(item[1]).length) {
				if (!['year', 'query', 'page', 'sortBy'].includes(item[0])) {
					locationSearch.value++
				}
				queryParams.value[item[0]] = item[1]
				search[item[0]] = searchAll.includes(item[0])
					? '*' + item[1]
					: item[1]
			}
		})
		search.limit = limit
		queryParams.value.limit = limit
		return search
	})
	const waves = ref([])
	const years = ref([])
	const filterStatusArr = computed(() => [{ name: 'Все', value: '' }, ...storeCommon.statusArr])
	const filterDirectionArr = computed(() => [{ name: 'Все', value: '' }, ...storeCommon.directionArr])
	const filterBooleanArr = computed(() => [{ name: 'Все', value: '' }, ...booleanArr])
	const filterWavesArr = computed(() => [{ name: 'Все', value: '' }, ...(waves.value.length ? waves.value.map(item => ({ name: item.name, value: item.id })) : [])])
	const setQuery = (query) => {
		query.forEach(item => {
			let key = item[0]
			if (filters.value.hasOwnProperty(key)) {
				filters.value[key] = item[1]
				if (key === 'page') {
					filters.value[key] = !!parseInt(item[1]) ? parseInt(item[1]) : 1
				} else {
					filters.value[key] = item[1]
				}
			}
		})
	}
	const statusOnChange = value => {
		filters.value.status = value
		setPage(1)
	}
	const directionOnChange = (undefined, value) => {
		filters.value.direction = value
		setPage(1)
	}
	const expertSeenOnChange = (undefined, value) => {
		filters.value.isExpertSeen = value
		setPage(1)
	}
	const wgSeenOnChange = (undefined, value) => {
		filters.value.isWgSeen = value
		setPage(1)
	}
	const setOrder = value => {
		filters.value.sortBy.replace(/^-/, '') === value
			? filters.value.sortBy.startsWith('-')
				? (filters.value.sortBy = value)
				: (filters.value.sortBy = '-' + value)
			: (filters.value.sortBy = value)
		setPage(1)
	}
	const yearOnChange = value => {
		filters.value.year = value
		setPage(1)
	}
	const waveOnChange = (undefined, value) => {
		filters.value.wave = value
		setPage(1)
	}
	const fetchYears = async () => {
		try {
			const { data } = await projectsApi.getYears()
			years.value = [...data]
		} catch (err) {
			console.log(err)
		}
	}
	const fetchWaves = async () => {
		try {
			const { data } = await wavesApi.getItems()
			waves.value = [...data]
		} catch (err) {
			console.log(err)
		}
	}
	const setPage = val => {
		filters.value.page = val
	}
	const checkSortParam = param => {
		return filters.value.sortBy === param ? true : false
	}
	onBeforeMount(async () => {
		if (window.location.search && ['projects', 'search'].includes(route.name)) {
			let query = Object.entries(route.query)
			setQuery(query)
		}
		if (['projects'].includes(route.name) && userRole === 'manager') {
			await fetchYears()
			if (!filters.value.year && years.value.length) {
				filters.value.year = years.value[0].value
			}
		}
		if (['projects', 'search'].includes(route.name) && ['manager', 'expert', 'expertSpecComp'].includes(userRole) || ['register'].includes(route.name)) {
			fetchWaves()
		}
		count.value = await fetchItems()
		isMounted.value = true
	})
	watch(
		() => filters.value,
		() => {
			if (isMounted.value) {
				fetchItems()
			}
		},
		{ deep: true }
	)
	watch(() => count.value,
		() => {
			if (count.value === 0 && filters.value.page !== 1) {
				setPage(1)
			}
		},
		{ deep: true })
	return { isMounted, years, filters, params, queryParams, locationSearch, filterWavesArr, filterStatusArr, filterDirectionArr, filterBooleanArr, setQuery, statusOnChange, directionOnChange, setOrder, expertSeenOnChange, wgSeenOnChange, yearOnChange, waveOnChange, setPage, checkSortParam }
}