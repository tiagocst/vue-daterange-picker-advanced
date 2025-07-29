import { defineNuxtPlugin } from '#app'
import VueDateRangePickerAdvanced from 'vue-daterange-picker-advanced'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDateRangePickerAdvanced)
})
