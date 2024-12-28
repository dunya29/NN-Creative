import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
    state: () => ({
        hasHeader: false,
        isMounted: false,
        isFirefox: false,
        statusArr: [],
        isNotyClicked: false
    }),
    actions: {
        showHeader() {
            this.hasHeader = true
        },
        unshowHeader() {
            this.hasHeader = false
        },
        pageOnMounted() {
            this.isMounted = true
        },
        pageOnUnMounted() {
            this.isMounted = false
        },
        setStatus(data) {
            this.statusArr = [...data]
        },
        setFirefox(val) {
            this.isFirefox = val
        },
        notyOnClick() {
            this.isNotyClicked = true
        },
        notyOnSeen() {
            this.isNotyClicked = false
        }
    }
})