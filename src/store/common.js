import { defineStore } from 'pinia'

export const useCommonStore = defineStore('common', {
    state: () => ({
        hasHeader: false,
        isMounted: false,
        isFirefox: false,
        statusArr: [],
        directionArr: [],
        granteeArr: [],
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
        setDirection(data) {
            this.directionArr = [...data]
        },
        setGrantee(data) {
            this.granteeArr = [...data]
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