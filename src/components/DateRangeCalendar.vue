<template>
  <div class="date-range-calendar bg-[#1A1E22] border border-[#292E33] rounded-lg shadow-lg overflow-hidden">
    <!-- Calendários Duplos -->
    <div class="flex flex-col md:flex-row gap-4 md:gap-0">
      <!-- Calendário Esquerdo (Data Inicial) -->
      <div class="flex-1 md:border-r border-[#292E33]">
        <div class="px-4 py-2 border-b border-[#292E33] bg-[#0F0F0F]">
          <h4 class="text-xs font-medium text-[#E5E8EB] text-center">Data Inicial</h4>
        </div>
        <Calendar
          v-model="startCalendarCurrentDate"
          :start-date="startDateModel"
          :end-date="endDateModel"
          :primary-color="primaryColor"
          :min-date="minDate"
          :max-date="maxDateForStart"
          :is-start-calendar="true"
          @date-select="handleStartDateSelect"
          class="w-full"
        />
      </div>

      <!-- Calendário Direito (Data Final) -->
      <div class="flex-1">
        <div class="px-4 py-2 border-b border-[#292E33] bg-[#0F0F0F]">
          <h4 class="text-xs font-medium text-[#E5E8EB] text-center">Data Final</h4>
        </div>
        <Calendar
          v-model="endCalendarCurrentDate"
          :start-date="startDateModel"
          :end-date="endDateModel"
          :primary-color="primaryColor"
          :min-date="minDateForEnd"
          :max-date="maxDate"
          :is-start-calendar="false"
          @date-select="handleEndDateSelect"
          class="w-full"
        />
      </div>
    </div>

    <!-- Footer com Inputs e Botões -->
    <div v-if="!hideActions" class="p-4 border-t border-[#292E33] bg-[#0F0F0F]">
      <!-- Inputs de Data -->
      <div class="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label for="start-date-calendar" class="block text-xs text-gray-400 mb-1">Data Inicial</label>
          <input
            id="start-date-calendar"
            type="date"
            :value="startDateInput"
            @change="handleStartInputChange"
            class="w-full bg-[#1A1E22] border border-[#292E33] text-[#E5E8EB] rounded px-3 py-2 text-xs focus:border-2"
            :style="{ '--focus-border-color': primaryColor }"
          />
        </div>
        <div>
          <label for="end-date-calendar" class="block text-xs text-gray-400 mb-1">Data Final</label>
          <input
            id="end-date-calendar"
            type="date"
            :value="endDateInput"
            @change="handleEndInputChange"
            class="w-full bg-[#1A1E22] border border-[#292E33] text-[#E5E8EB] rounded px-3 py-2 text-xs focus:border-2"
            :style="{ '--focus-border-color': primaryColor }"
          />
        </div>
      </div>

      <!-- Presets Rápidos -->
      <div v-if="!hidePresets" class="mb-4">
        <div class="text-xs text-gray-400 mb-2">Períodos Rápidos:</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in quickPresets"
            :key="preset.value"
            @click="applyPreset(preset)"
            class="px-3 py-1 text-xs rounded border transition-colors"
            :class="{
              'border-[#292E33] text-gray-400 hover:border-gray-500': !isPresetActive(preset),
              'text-white border-2': isPresetActive(preset)
            }"
            :style="isPresetActive(preset) ? { borderColor: primaryColor, backgroundColor: `${primaryColor}10` } : {}"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>

      <!-- Informações do Range -->
      <div v-if="startDateModel && endDateModel" class="mb-4 p-3 bg-[#1A1E22] rounded border border-[#292E33]">
        <div class="text-xs text-gray-400 mb-1">Período Selecionado:</div>
        <div class="text-sm text-[#E5E8EB] font-medium">
          {{ formatDateRange(startDateModel, endDateModel) }}
        </div>
        <div class="text-xs text-gray-400 mt-1">
          {{ calculateDaysDifference(startDateModel, endDateModel) }} dias
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="flex gap-2">
        <button
          @click="applyRange"
          :disabled="!canApplyRange"
          class="flex-1 px-4 py-2 text-sm rounded-md text-white font-medium transition-colors"
          :style="{ backgroundColor: primaryColor }"
          :class="{ 'opacity-50 cursor-not-allowed': !canApplyRange }"
        >
          Aplicar Período
        </button>
        <button
          @click="clearRange"
          class="px-4 py-2 text-sm rounded-md border border-[#292E33] text-[#727980] hover:border-gray-500 transition-colors"
        >
          Limpar
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm rounded-md border border-[#292E33] text-[#727980] hover:border-gray-500 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Calendar from './Calendar.vue'

interface QuickPreset {
  value: string
  label: string
  startDate: Date
  endDate: Date
}

interface Props {
  startDate?: Date | null
  endDate?: Date | null
  primaryColor: string
  minDate?: Date
  maxDate?: Date
  hidePresets?: boolean
  hideActions?: boolean
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'apply': [value: { startDate: Date, endDate: Date, periodo: string }]
  'close': []
  'date-select': [value: { startDate: Date, endDate: Date }]
}>()

// Estados internos
const startDateModel = ref<Date | null>(props.startDate || null)
const endDateModel = ref<Date | null>(props.endDate || null)

// Datas para navegação dos calendários
const today = new Date()
const startCalendarCurrentDate = ref(props.startDate || today)
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)
const endCalendarCurrentDate = ref(props.endDate || props.startDate || nextMonth)

// Presets rápidos
const quickPresets: QuickPreset[] = [
  {
    value: 'ultimo-mes',
    label: 'Último mês',
    startDate: (() => {
      const hoje = new Date()
      const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate())
      return mesPassado
    })(),
    endDate: new Date()
  },
  {
    value: 'ultimos-3-meses', 
    label: 'Últimos 3 meses',
    startDate: (() => {
      const hoje = new Date()
      const tresMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 3, hoje.getDate())
      return tresMesesAtras
    })(),
    endDate: new Date()
  },
  {
    value: 'ultimo-ano',
    label: 'Último ano', 
    startDate: (() => {
      const hoje = new Date()
      const umAnoAtras = new Date(hoje.getFullYear() - 1, hoje.getMonth(), hoje.getDate())
      return umAnoAtras
    })(),
    endDate: new Date()
  },
  {
    value: 'todo-periodo',
    label: 'Todo período',
    startDate: new Date(2022, 0, 1),
    endDate: new Date()
  },
  {
    value: 'ultimos-7-dias',
    label: 'Últimos 7 dias',
    startDate: (() => {
      const hoje = new Date()
      const seteDiasAtras = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 7)
      return seteDiasAtras
    })(),
    endDate: new Date()
  }
]

// Computed properties
const startDateInput = computed(() => {
  return startDateModel.value ? formatDateToISO(startDateModel.value) : ''
})

const endDateInput = computed(() => {
  return endDateModel.value ? formatDateToISO(endDateModel.value) : ''
})

const canApplyRange = computed(() => {
  return startDateModel.value && endDateModel.value && startDateModel.value <= endDateModel.value
})

const maxDateForStart = computed(() => {
  return endDateModel.value || props.maxDate
})

const minDateForEnd = computed(() => {
  return startDateModel.value || props.minDate
})

// Métodos de formatação
const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateRange = (start: Date, end: Date): string => {
  const startFormatted = start.toLocaleDateString('pt-BR')
  const endFormatted = end.toLocaleDateString('pt-BR')
  return `${startFormatted} - ${endFormatted}`
}

const calculateDaysDifference = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
}

// Handlers de seleção de data
const handleStartDateSelect = (date: Date) => {
  startDateModel.value = date
  startCalendarCurrentDate.value = date
  
  // Se não há data final ou a data final é anterior à nova data inicial, ajustar
  if (!endDateModel.value || endDateModel.value < date) {
    endDateModel.value = new Date(date)
  }
  
  // Emitir evento de seleção se ambas as datas estão definidas
  if (startDateModel.value && endDateModel.value) {
    emits('date-select', {
      startDate: startDateModel.value,
      endDate: endDateModel.value
    })
  }
}

const handleEndDateSelect = (date: Date) => {
  endDateModel.value = date
  endCalendarCurrentDate.value = date
  
  // Se não há data inicial ou a data inicial é posterior à nova data final, ajustar
  if (!startDateModel.value || startDateModel.value > date) {
    startDateModel.value = new Date(date)
    startCalendarCurrentDate.value = new Date(date)
  }
  
  // Emitir evento de seleção se ambas as datas estão definidas
  if (startDateModel.value && endDateModel.value) {
    emits('date-select', {
      startDate: startDateModel.value,
      endDate: endDateModel.value
    })
  }
}

// Handlers dos inputs de data
const handleStartInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value) {
    const [year, month, day] = target.value.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    handleStartDateSelect(date)
  }
}

const handleEndInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value) {
    const [year, month, day] = target.value.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    handleEndDateSelect(date)
  }
}

// Aplicar preset
const applyPreset = (preset: QuickPreset) => {
  startDateModel.value = new Date(preset.startDate)
  endDateModel.value = new Date(preset.endDate)
  
  // Atualizar as datas de navegação dos calendários
  startCalendarCurrentDate.value = new Date(preset.startDate)
  endCalendarCurrentDate.value = new Date(preset.endDate)
  
  // Se as datas são do mesmo mês/ano, avançar o calendário direito um mês
  if (preset.startDate.getMonth() === preset.endDate.getMonth() && 
      preset.startDate.getFullYear() === preset.endDate.getFullYear()) {
    endCalendarCurrentDate.value = new Date(preset.endDate.getFullYear(), preset.endDate.getMonth() + 1, 1)
  }
}

// Verificar se preset está ativo
const isPresetActive = (preset: QuickPreset): boolean => {
  if (!startDateModel.value || !endDateModel.value) return false
  
  return isSameDay(startDateModel.value, preset.startDate) &&
         isSameDay(endDateModel.value, preset.endDate)
}

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

// Aplicar range
const applyRange = () => {
  if (!canApplyRange.value) return
  
  emits('apply', {
    startDate: startDateModel.value!,
    endDate: endDateModel.value!,
    periodo: 'custom'
  })
}

// Limpar range
const clearRange = () => {
  startDateModel.value = null
  endDateModel.value = null
}

// Watchers para sincronizar com props
watch(() => props.startDate, (newVal) => {
  startDateModel.value = newVal || null
  // Atualizar a navegação do calendário quando a data inicial muda
  if (newVal) {
    startCalendarCurrentDate.value = new Date(newVal)
  }
})

watch(() => props.endDate, (newVal) => {
  endDateModel.value = newVal || null
  // Atualizar a navegação do calendário quando a data final muda
  if (newVal) {
    endCalendarCurrentDate.value = new Date(newVal)
    
    // Se as datas são do mesmo mês/ano, avançar o calendário direito um mês
    if (startDateModel.value && 
        newVal.getMonth() === startDateModel.value.getMonth() && 
        newVal.getFullYear() === startDateModel.value.getFullYear()) {
      endCalendarCurrentDate.value = new Date(newVal.getFullYear(), newVal.getMonth() + 1, 1)
    }
  }
})
</script>
