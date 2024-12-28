import { ref } from "vue"
import ru from 'date-fns/locale/ru'
import { formatDate, parse } from 'date-fns'

export const useDateModule = () => {
	const locale = ref({
		...ru,
	})
	const format = 'dd.MM.yyyy'
	const placeholder = 'ДД.ММ.ГГГГ'
	const setEndLowerLimit = (startDate) => {
		let start = startDate
			? new Date(startDate)
			: new Date()
		start.setDate(start.getDate() + 1)
		return start
	}
	const formatDateValue = (value) => {
		return formatDate(value, format)
	}
	const parseDateValue = (value) => {
		return parse(value, format, new Date())
	}
	function formatUTCDate(isoString) {
		const date = new Date(isoString);
		if (isNaN(date)) {
			return "Invalid date format";
		}
		const year = date.getFullYear();
		const month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1
		const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
		const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
		const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

		return `${year}-${month}-${day} в ${hours}:${minutes}`;
	}
	return { locale, format, placeholder, setEndLowerLimit, formatDateValue, parseDateValue, formatUTCDate }
}