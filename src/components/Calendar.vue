<template>
  <div class="calendar-container">
    <!-- Header do Calendário -->
    <div class="calendar-header flex items-center justify-between p-3 border-b border-[#292E33]">
      <!-- Botão Anterior -->
      <button
        @click="previousMonth"
        class="p-1 rounded-md hover:bg-[#292E33] transition-colors"
        :disabled="!canNavigatePrevious"
        :class="{ 'opacity-50 cursor-not-allowed': !canNavigatePrevious }"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <!-- Seletores de Mês e Ano -->
      <div class="flex items-center gap-2">
        <select
          v-model="currentMonth"
          @change="updateCalendar"
          class="bg-[#0F0F0F] border border-[#292E33] text-[#E5E8EB] rounded px-2 py-1 text-sm focus:border-2"
          :style="{ '--focus-border-color': primaryColor }"
        >
          <option v-for="(month, index) in monthNames" :key="index" :value="index">
            {{ month }}
          </option>
        </select>
        
        <select
          v-model="currentYear"
          @change="updateCalendar"
          class="bg-[#0F0F0F] border border-[#292E33] text-[#E5E8EB] rounded px-2 py-1 text-sm focus:border-2"
          :style="{ '--focus-border-color': primaryColor }"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- Botão Próximo -->
      <button
        @click="nextMonth"
        class="p-1 rounded-md hover:bg-[#292E33] transition-colors"
        :disabled="!canNavigateNext"
        :class="{ 'opacity-50 cursor-not-allowed': !canNavigateNext }"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>

    <!-- Grid do Calendário -->
    <div class="calendar-grid p-3">
      <!-- Cabeçalho dos dias da semana -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in dayNames"
          :key="day"
          class="text-center text-xs font-medium text-gray-400 py-1"
        >
          {{ day }}
        </div>
      </div>

      <!-- Dias do calendário -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="day in calendarDays"
          :key="`${day.date.getTime()}-${day.isCurrentMonth}`"
          @click="selectDate(day.date)"
          :disabled="!day.isCurrentMonth || !day.isSelectable"
          class="calendar-day relative w-8 h-8 text-xs rounded-md transition-all duration-200 flex items-center justify-center"
          :class="getDayClasses(day)"
          :style="getDayStyles(day)"
        >
          {{ day.date.getDate() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isStartDate: boolean
  isEndDate: boolean
  isInRange: boolean
  isSelectable: boolean
}

interface Props {
  modelValue?: Date | null
  startDate?: Date | null
  endDate?: Date | null
  primaryColor: string
  minDate?: Date
  maxDate?: Date
  isStartCalendar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isStartCalendar: true
})

const emits = defineEmits<{
  'update:modelValue': [value: Date | null]
  'dateSelect': [value: Date]
}>()

// Estado do calendário
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

// Nomes dos meses e dias
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

// Anos disponíveis (últimos 5 anos a partir do atual)
const availableYears = computed(() => {
  const currentYearValue = new Date().getFullYear()
  const years = []
  for (let i = currentYearValue - 4; i <= currentYearValue; i++) {
    years.push(i)
  }
  return years
})

// Verificar se pode navegar
const canNavigatePrevious = computed(() => {
  if (!props.minDate) return true
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  return firstDayOfMonth > props.minDate
})

const canNavigateNext = computed(() => {
  if (!props.maxDate) return true
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
  return lastDayOfMonth < props.maxDate
})

// Gerar dias do calendário
const calendarDays = computed((): CalendarDay[] => {
  const days: CalendarDay[] = []
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1)
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const today = new Date()

  // Dias do mês anterior para preencher a primeira semana
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(firstDayOfMonth)
    date.setDate(date.getDate() - i - 1)
    days.push(createCalendarDay(date, false, today))
  }

  // Dias do mês atual
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(currentYear.value, currentMonth.value, day)
    days.push(createCalendarDay(date, true, today))
  }

  // Dias do próximo mês para completar a última semana
  const remainingDays = 42 - days.length // 6 semanas x 7 dias
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(currentYear.value, currentMonth.value + 1, day)
    days.push(createCalendarDay(date, false, today))
  }

  return days
})

// Criar objeto de dia do calendário
const createCalendarDay = (date: Date, isCurrentMonth: boolean, today: Date): CalendarDay => {
  const isToday = isSameDay(date, today)
  const isSelected = props.modelValue ? isSameDay(date, props.modelValue) : false
  const isStartDate = props.startDate ? isSameDay(date, props.startDate) : false
  const isEndDate = props.endDate ? isSameDay(date, props.endDate) : false
  const isInRange = isDateInRange(date)
  const isSelectable = isDateSelectable(date)

  return {
    date,
    isCurrentMonth,
    isToday,
    isSelected,
    isStartDate,
    isEndDate,
    isInRange,
    isSelectable
  }
}

// Verificar se é o mesmo dia
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

// Verificar se a data está no range selecionado
const isDateInRange = (date: Date): boolean => {
  if (!props.startDate || !props.endDate) return false
  return date >= props.startDate && date <= props.endDate
}

// Verificar se a data é selecionável
const isDateSelectable = (date: Date): boolean => {
  if (props.minDate && date < props.minDate) return false
  if (props.maxDate && date > props.maxDate) return false
  return true
}

// Classes CSS para os dias
const getDayClasses = (day: CalendarDay): string => {
  const classes = []

  // Estados base
  if (!day.isCurrentMonth) {
    classes.push('text-gray-600')
  } else if (!day.isSelectable) {
    classes.push('text-gray-600', 'cursor-not-allowed', 'opacity-50')
  } else {
    classes.push('text-[#E5E8EB]', 'hover:bg-[#292E33]', 'cursor-pointer')
  }

  // Estados especiais
  if (day.isToday && day.isCurrentMonth) {
    classes.push('font-bold', 'ring-1', 'ring-gray-400')
  }

  if (day.isStartDate && day.isCurrentMonth) {
    classes.push('text-white', 'font-bold', 'ring-2')
  }

  if (day.isEndDate && day.isCurrentMonth) {
    classes.push('text-white', 'font-bold')
  }

  return classes.join(' ')
}

// Obter estilos inline para os dias
const getDayStyles = (day: CalendarDay) => {
  const styles: Record<string, string> = {}

  if (day.isStartDate && day.isCurrentMonth) {
    styles.backgroundColor = props.primaryColor
    styles.borderColor = props.primaryColor
  } else if (day.isEndDate && day.isCurrentMonth) {
    styles.backgroundColor = props.primaryColor
  } else if (day.isInRange && day.isCurrentMonth && day.isSelectable) {
    styles.backgroundColor = `${props.primaryColor}20`
  }

  return styles
}

// Métodos de navegação
const previousMonth = () => {
  if (!canNavigatePrevious.value) return
  
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (!canNavigateNext.value) return
  
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const updateCalendar = () => {
  // Método chamado quando mês/ano é alterado via select
}

// Selecionar data
const selectDate = (date: Date) => {
  if (!isDateSelectable(date)) return
  
  emits('update:modelValue', date)
  emits('dateSelect', date)
}

// Inicializar calendário baseado na data selecionada
const initializeCalendar = () => {
  const targetDate = props.modelValue || props.startDate || props.endDate || new Date()
  currentMonth.value = targetDate.getMonth()
  currentYear.value = targetDate.getFullYear()
}

// Watchers
watch(() => props.modelValue, () => {
  if (props.modelValue) {
    currentMonth.value = props.modelValue.getMonth()
    currentYear.value = props.modelValue.getFullYear()
  }
})

// Watcher para startDate - atualiza calendário quando a data inicial muda
watch(() => props.startDate, (newVal) => {
  if (newVal && props.isStartCalendar) {
    currentMonth.value = newVal.getMonth()
    currentYear.value = newVal.getFullYear()
  }
})

// Watcher para endDate - atualiza calendário quando a data final muda  
watch(() => props.endDate, (newVal) => {
  if (newVal && !props.isStartCalendar) {
    currentMonth.value = newVal.getMonth()
    currentYear.value = newVal.getFullYear()
  }
})

onMounted(() => {
  initializeCalendar()
})
</script>

<style scoped>
.calendar-day {
  min-height: 32px;
  min-width: 32px;
}

.calendar-day:disabled {
  cursor: not-allowed;
}

/* Estilo para datas selecionadas */
.calendar-day.selected {
  color: white !important;
  font-weight: bold;
}

/* Hover states */
.calendar-day:not(:disabled):hover {
  background-color: #292E33;
}
</style>
