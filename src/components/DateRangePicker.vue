<template>
  <div class="relative" ref="datePickerRef">
    <!-- Input Principal -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        @focus="handleButtonFocus"
        @blur="handleButtonBlur"
        class="w-full bg-[#0F0F0F] border border-[#292E33] text-[#727980] rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:border-2 appearance-none text-sm text-left"
        :style="{ 
          '--focus-ring-color': primaryColor,
          '--focus-border-color': primaryColor 
        }"
        style="outline: none;"
      >
        {{ displayText }}
      </button>
      <svg 
        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    </div>

    <!-- Dropdown -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-8 bg-black bg-opacity-50"
    >
      <!-- Layout Principal com Períodos à Esquerda e Calendário à Direita -->
      <div class="bg-[#1A1E22] border border-[#292E33] rounded-lg shadow-2xl overflow-hidden w-full md:w-[92vw] md:max-w-[92vw] max-h-[85vh] md:max-h-[80vh] md:mx-auto flex flex-col relative">
        <!-- Botão X de Fechar -->
        <button
          @click="closeCalendar"
          class="absolute top-4 right-4 z-10 p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#292E33] transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- Container com scroll para conteúdo principal -->
        <div class="flex flex-col md:flex-row flex-1 min-h-0 overflow-y-auto">
          <!-- Coluna da Esquerda - Períodos Rápidos -->
          <div class="w-full md:w-auto md:flex-shrink-0 bg-[#161A1E] border-b md:border-b-0 md:border-r border-[#292E33]">
            <!-- Períodos Rápidos -->
            <div class="p-4 md:w-48">
              <!-- Layout horizontal em mobile, vertical em desktop -->
              <div class="flex md:flex-col gap-2 md:space-y-2 md:gap-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                <button
                  v-for="option in allOptions"
                  :key="option.value"
                  @click="selectQuickOption(option)"
                  class="flex-shrink-0 md:w-full px-3 py-2 text-sm rounded-lg border transition-all duration-200 text-center md:text-left group hover:scale-[1.02] whitespace-nowrap md:whitespace-normal"
                  :class="{
                    'border-[#292E33] bg-[#0F0F0F] text-[#727980] hover:border-gray-500 hover:bg-[#1A1E22]': selectedOption !== option.value,
                    'text-white border-2 shadow-lg': selectedOption === option.value
                  }"
                  :style="selectedOption === option.value ? { 
                    borderColor: primaryColor, 
                    backgroundColor: `${primaryColor}15`,
                    boxShadow: `0 0 0 1px ${primaryColor}30`
                  } : {}"
                >
                  <div class="flex items-center justify-center md:justify-between">
                    <span class="font-medium">{{ option.label }}</span>
                    <svg 
                      v-if="selectedOption === option.value" 
                      class="w-4 h-4 flex-shrink-0 ml-2 md:ml-0"
                      :style="{ color: primaryColor }"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Campos Personalizados (quando "Personalizado" está selecionado) -->
            <div v-if="selectedOption === 'custom'" class="px-4 pb-4 md:w-48">
              <div class="border-t border-[#292E33] pt-4">
                <!-- Inputs de Data - Horizontal em mobile, vertical em desktop -->
                <div class="flex md:flex-col gap-3 md:space-y-3 md:gap-0">
                  <div class="flex-1 md:flex-none">
                    <label for="start-date-input" class="block text-xs text-gray-400 mb-1">Data Inicial</label>
                    <input
                      id="start-date-input"
                      type="date"
                      v-model="startDateInput"
                      @change="updateCustomRange"
                      @focus="handleInputFocus"
                      @blur="handleInputBlur"
                      class="w-full bg-[#0F0F0F] border border-[#292E33] text-[#727980] rounded-md px-3 py-2 text-xs focus:border-2 transition-colors"
                      :style="{ '--focus-border-color': primaryColor }"
                    />
                  </div>
                  <div class="flex-1 md:flex-none">
                    <label for="end-date-input" class="block text-xs text-gray-400 mb-1">Data Final</label>
                    <input
                      id="end-date-input"
                      type="date"
                      v-model="endDateInput"
                      @change="updateCustomRange"
                      @focus="handleInputFocus"
                      @blur="handleInputBlur"
                      class="w-full bg-[#0F0F0F] border border-[#292E33] text-[#727980] rounded-md px-3 py-2 text-xs focus:border-2 transition-colors"
                      :style="{ '--focus-border-color': primaryColor }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Coluna da Direita - Calendário -->
          <div class="flex-1 min-w-0 flex flex-col overflow-hidden">
            <!-- Informações do Range Selecionado - Oculto em mobile -->
            <div v-if="startDateModel && endDateModel" class="hidden md:block p-4 border-b border-[#292E33] flex-shrink-0">
              <div class="flex items-center justify-start">
                <div class="text-sm text-[#E5E8EB] font-medium">
                  {{ formatDateRange(startDateModel, endDateModel) }} • {{ calculateDaysDifference(startDateModel, endDateModel) }} dias
                </div>
              </div>
            </div>

            <!-- Calendário -->
            <div class="flex-1 p-4 overflow-auto">
              <DateRangeCalendar
                :start-date="startDateModel"
                :end-date="endDateModel"
                :primary-color="primaryColor"
                :hide-presets="true"
                :hide-actions="true"
                @apply="handleCalendarApply"
                @date-select="handleDateSelect"
                class="w-full"
              />
            </div>
          </div>
        </div>

        <!-- Footer com Botões de Ação - Sempre Visível -->
        <div class="border-t border-[#292E33] p-4 bg-[#161A1E] flex-shrink-0 sticky bottom-0">
          <div class="flex flex-row gap-2 justify-between items-center">
            <div class="flex gap-2 flex-1">
              <button
                @click="clearFilter"
                class="px-3 py-2 text-sm rounded-md border border-[#292E33] text-[#727980] hover:border-gray-500 transition-colors flex-shrink-0"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Resetar
              </button>
              <button
                @click="closeCalendar"
                class="px-3 py-2 text-sm rounded-md border border-[#292E33] text-[#727980] hover:border-gray-500 transition-colors flex-shrink-0"
              >
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Cancelar
              </button>
            </div>
            
            <button
              @click="applyFilter"
              :disabled="!canApply"
              class="px-4 py-2 text-sm rounded-md text-white font-medium transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 flex-shrink-0"
              :style="{ backgroundColor: primaryColor }"
              :class="{ 'opacity-50 cursor-not-allowed': !canApply }"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Aplicar Período
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import DateRangeCalendar from './DateRangeCalendar.vue'

interface QuickOption {
  value: string
  label: string
  startDate: Date
  endDate: Date
  description?: string
}

interface Props {
  modelValue: string
  primaryColor: string
}

const props = defineProps<Props>()

const emits = defineEmits<{
  'update:modelValue': [value: string]
  'apply': [value: { periodo: string, startDate?: string, endDate?: string }]
}>()

// Refs
const datePickerRef = ref<HTMLElement>()
const isOpen = ref(false)
const selectedOption = ref(props.modelValue || 'ultimo-mes')
const startDateInput = ref('')
const endDateInput = ref('')

// Models para o calendário
const startDateModel = computed(() => {
  if (!startDateInput.value) return null
  // Cria data usando ano, mês e dia locais para evitar problemas de fuso horário
  const [year, month, day] = startDateInput.value.split('-').map(Number)
  return new Date(year, month - 1, day)
})

const endDateModel = computed(() => {
  if (!endDateInput.value) return null
  // Cria data usando ano, mês e dia locais para evitar problemas de fuso horário
  const [year, month, day] = endDateInput.value.split('-').map(Number)
  return new Date(year, month - 1, day)
})

// Opções rápidas de período
const quickOptions: QuickOption[] = [
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
    value: 'ultimos-7-dias',
    label: 'Últimos 7 dias',
    startDate: (() => {
      const hoje = new Date()
      const seteDiasAtras = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 7)
      return seteDiasAtras
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
  }
]

// Opção personalizada
const customOption: QuickOption = {
  value: 'custom',
  label: 'Personalizado',
  startDate: new Date(),
  endDate: new Date()
}

// Todas as opções incluindo personalizado
const allOptions = computed(() => {
  return [
    ...quickOptions,
    {
      ...customOption
    }
  ]
})

// Computed
const displayText = computed(() => {
  const selected = quickOptions.find(opt => opt.value === selectedOption.value)
  if (selected) {
    return selected.label
  }
  
  if (startDateInput.value && endDateInput.value) {
    const start = formatDate(startDateInput.value)
    const end = formatDate(endDateInput.value)
    return `${start} - ${end}`
  }
  
  return 'Selecione um período'
})

const canApply = computed(() => {
  return selectedOption.value !== '' && 
         (quickOptions.some(opt => opt.value === selectedOption.value) || 
          (startDateInput.value && endDateInput.value))
})

// Métodos
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatDateToISO = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  
  if (typeof window !== 'undefined') {
    if (isOpen.value && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}

const selectQuickOption = (option: QuickOption) => {
  selectedOption.value = option.value
  
  if (option.value === 'custom') {
    if (!startDateInput.value) startDateInput.value = formatDateToISO(new Date())
    if (!endDateInput.value) endDateInput.value = formatDateToISO(new Date())
  } else {
    startDateInput.value = formatDateToISO(option.startDate)
    endDateInput.value = formatDateToISO(option.endDate)
  }
}

const updateCustomRange = () => {
  if (startDateInput.value && endDateInput.value) {
    selectedOption.value = 'custom'
    
    const start = new Date(startDateInput.value)
    const end = new Date(endDateInput.value)
    
    if (start > end) {
      const temp = startDateInput.value
      startDateInput.value = endDateInput.value
      endDateInput.value = temp
    }
  }
}

const formatDateRange = (start: Date, end: Date) => {
  const startStr = start.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  const endStr = end.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
  return `${startStr} - ${endStr}`
}

const calculateDaysDifference = (start: Date, end: Date) => {
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const handleDateSelect = (data: { startDate: Date, endDate: Date }) => {
  startDateInput.value = formatDateToISO(data.startDate)
  endDateInput.value = formatDateToISO(data.endDate)
  
  if (selectedOption.value !== 'custom') {
    selectedOption.value = 'custom'
  }
}

const applyFilter = () => {
  if (!canApply.value) return
  
  emits('update:modelValue', selectedOption.value)
  
  const emitData: { periodo: string, startDate?: string, endDate?: string } = {
    periodo: selectedOption.value
  }
  
  if (startDateInput.value && endDateInput.value) {
    emitData.startDate = startDateInput.value
    emitData.endDate = endDateInput.value
  }
  
  emits('apply', emitData)
  isOpen.value = false
}

const clearFilter = () => {
  selectedOption.value = 'ultimo-mes'
  const defaultOption = quickOptions.find(opt => opt.value === 'ultimo-mes')!
  startDateInput.value = formatDateToISO(defaultOption.startDate)
  endDateInput.value = formatDateToISO(defaultOption.endDate)
  applyFilter()
}

const handleInputFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement
  if (target) {
    target.style.borderColor = props.primaryColor
  }
}

const handleInputBlur = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement
  if (target) {
    target.style.borderColor = '#292E33'
  }
}

const handleButtonFocus = (event: FocusEvent) => {
  const target = event.target as HTMLButtonElement
  if (target) {
    target.style.borderColor = props.primaryColor
    target.style.boxShadow = `0 0 0 2px ${props.primaryColor}40`
  }
}

const handleButtonBlur = (event: FocusEvent) => {
  const target = event.target as HTMLButtonElement
  if (target) {
    target.style.borderColor = '#292E33'
    target.style.boxShadow = 'none'
  }
}

const closeCalendar = () => {
  isOpen.value = false
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

const handleCalendarApply = (data: { startDate: Date, endDate: Date, periodo: string }) => {
  startDateInput.value = formatDateToISO(data.startDate)
  endDateInput.value = formatDateToISO(data.endDate)
  selectedOption.value = data.periodo
  
  emits('update:modelValue', data.periodo)
  emits('apply', {
    periodo: data.periodo,
    startDate: startDateInput.value,
    endDate: endDateInput.value
  })
  
  isOpen.value = false
  
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== selectedOption.value) {
    selectedOption.value = newValue
    const option = quickOptions.find(opt => opt.value === newValue)
    if (option) {
      startDateInput.value = formatDateToISO(option.startDate)
      endDateInput.value = formatDateToISO(option.endDate)
    }
  }
}, { immediate: true })

onMounted(async () => {
  if (!selectedOption.value || selectedOption.value === '') {
    selectedOption.value = 'ultimo-mes'
  }
  
  const option = quickOptions.find(opt => opt.value === selectedOption.value)
  if (option) {
    startDateInput.value = formatDateToISO(option.startDate)
    endDateInput.value = formatDateToISO(option.endDate)
    
    setTimeout(() => {
      emits('update:modelValue', selectedOption.value)
      emits('apply', {
        periodo: selectedOption.value,
        startDate: startDateInput.value,
        endDate: endDateInput.value
      })
    }, 0)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>
