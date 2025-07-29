import DateRangePicker from './src/components/DateRangePicker.vue'
import DateRangeCalendar from './src/components/DateRangeCalendar.vue'
import Calendar from './src/components/Calendar.vue'

// Plugin install function
const install = (app, options = {}) => {
  // Registrar componentes globalmente
  app.component('DateRangePicker', DateRangePicker)
  app.component('DateRangeCalendar', DateRangeCalendar)
  app.component('Calendar', Calendar)
  
  // Configurações globais opcionais
  app.config.globalProperties.$dateRangeOptions = {
    primaryColor: '#40c1ad',
    ...options
  }
}

// Exportações
export default {
  install
}

export {
  DateRangePicker,
  DateRangeCalendar,
  Calendar,
  install
}

// Auto-install quando usado via script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use({ install })
}
