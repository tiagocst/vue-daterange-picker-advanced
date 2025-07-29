# Vue DateRange Picker Advanced

Um componente Vue 3 avançado para seleção de períodos com design responsivo, layout sidebar e funcionalidades profissionais.

## ✨ Características

- 🎨 **Design Responsivo** - Layout adaptativo para mobile e desktop
- 📅 **Períodos Predefinidos** - Último mês, últimos 7 dias, etc.
- 🎯 **Seleção Personalizada** - Campos de data específicos
- 🌍 **Timezone Safe** - Manipulação correta de datas
- 🎪 **Tema Customizável** - Cores e estilos personalizáveis
- 📱 **Layout Sidebar** - Períodos em coluna lateral (desktop) ou horizontal (mobile)
- 🔒 **Controle Preciso** - Fechamento apenas por ações específicas

## 📦 Instalação

```bash
npm install @tiagocst/vue-daterange-picker-advanced
```

```bash
pnpm add @tiagocst/vue-daterange-picker-advanced
```

```bash
yarn add @tiagocst/vue-daterange-picker-advanced
```

## 🚀 Uso

### Instalação Global (Vue 3)

```javascript
import { createApp } from 'vue'
import VueDateRangePickerAdvanced from '@tiagocst/vue-daterange-picker-advanced'
import '@tiagocst/vue-daterange-picker-advanced/dist/vue-daterange-picker-advanced.css'

const app = createApp({})
app.use(VueDateRangePickerAdvanced)
```

### Uso com Nuxt 3

Crie um plugin em `plugins/vue-daterange-picker-advanced.client.js`:

```javascript
import VueDateRangePickerAdvanced from '@tiagocst/vue-daterange-picker-advanced'
import '@tiagocst/vue-daterange-picker-advanced/dist/vue-daterange-picker-advanced.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDateRangePickerAdvanced)
})
```

**Importante**: Use `<client-only>` para compatibilidade SSR:

```vue
<template>
  <client-only>
    <DateRangePicker v-model="selectedRange" />
  </client-only>
</template>
```

### Uso no Componente

```vue
<template>
  <div>
    <DateRangePicker
      v-model="selectedPeriod"
      primary-color="#40c1ad"
      @apply="handlePeriodApply"
    />
    
    <p>Período selecionado: {{ selectedPeriod }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DateRangePicker } from '@tiagocst/vue-daterange-picker-advanced'

const selectedPeriod = ref('ultimo-mes')

const handlePeriodApply = (data) => {
  console.log('Período aplicado:', data)
  // data = { periodo: 'ultimo-mes', startDate: '2024-06-29', endDate: '2024-07-29' }
}
</script>
```

### Uso Individual dos Componentes

```vue
<template>
  <div>
    <!-- Apenas o DateRangePicker principal -->
    <DateRangePicker
      v-model="period"
      primary-color="#3B82F6"
      @apply="handleApply"
    />
    
    <!-- Ou apenas o calendário duplo -->
    <DateRangeCalendar
      :start-date="startDate"
      :end-date="endDate"
      primary-color="#10B981"
      @date-select="handleDateSelect"
    />
    
    <!-- Ou calendário individual -->
    <Calendar
      v-model="singleDate"
      primary-color="#8B5CF6"
      @date-select="handleSingleDateSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { DateRangePicker, DateRangeCalendar, Calendar } from '@tiagocst/vue-daterange-picker-advanced'

const period = ref('ultimo-mes')
const startDate = ref(new Date())
const endDate = ref(new Date())
const singleDate = ref(new Date())

// Handlers dos eventos...
</script>
```

## 📋 API

### DateRangePicker (Componente Principal)

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `v-model` | `string` | `''` | Período selecionado |
| `primary-color` | `string` | - | Cor primária do tema |

#### Eventos

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `@apply` | `{periodo, startDate?, endDate?}` | Período aplicado |
| `@update:modelValue` | `string` | Valor do v-model atualizado |

#### Valores de Período

- `'ultimo-mes'` - Do mesmo dia do mês anterior até hoje
- `'ultimos-7-dias'` - Dos últimos 7 dias até hoje
- `'ultimos-3-meses'` - Dos últimos 3 meses até hoje
- `'ultimo-ano'` - Do mesmo dia do ano anterior até hoje
- `'todo-periodo'` - De 1º de janeiro de 2022 até hoje
- `'custom'` - Período personalizado

### DateRangeCalendar

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `start-date` | `Date` | `null` | Data inicial |
| `end-date` | `Date` | `null` | Data final |
| `primary-color` | `string` | - | Cor primária |
| `hide-presets` | `boolean` | `false` | Ocultar períodos rápidos |
| `hide-actions` | `boolean` | `false` | Ocultar botões de ação |

#### Eventos

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `@date-select` | `{startDate, endDate}` | Datas selecionadas |
| `@apply` | `{startDate, endDate, periodo}` | Período aplicado |

### Calendar

#### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `v-model` | `Date` | `null` | Data selecionada |
| `start-date` | `Date` | `null` | Data de início do range |
| `end-date` | `Date` | `null` | Data de fim do range |
| `primary-color` | `string` | - | Cor primária |
| `min-date` | `Date` | `null` | Data mínima selecionável |
| `max-date` | `Date` | `null` | Data máxima selecionável |

## 🎨 Responsividade

O componente se adapta automaticamente:

- **Desktop (≥768px)**: Layout sidebar com períodos à esquerda e calendário à direita
- **Mobile (<768px)**: Layout vertical com períodos horizontais no topo e calendário abaixo

## 🔧 Compatibilidade

- ✅ Vue 3
- ✅ Nuxt 3
- ✅ TypeScript
- ✅ TailwindCSS
- ✅ Vite
- ✅ Webpack

## 🎯 Recursos Avançados

### Timezone Safety
Manipulação correta de datas sem problemas de fuso horário usando métodos de data local.

### Controle de Fechamento
Modal fecha apenas por ações específicas (botões X, Cancelar, Aplicar) - sem click outside.

### Navegação Inteligente
Calendários navegam automaticamente para os meses corretos quando períodos são selecionados.

### Validação Automática
Período personalizado é validado automaticamente, incluindo correção de ordem das datas.

## 🛠️ Desenvolvimento

```bash
# Clonar o repositório
git clone https://github.com/tiagocst/vue-daterange-picker-advanced.git
cd vue-daterange-picker-advanced

# Instalar dependências
npm install
# ou
pnpm install

# Build
npm run build
# ou
pnpm run build
```

## 📄 Licença

MIT License

## 🤝 Contribuições

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma [issue](https://github.com/tiagocst/vue-daterange-picker-advanced/issues)
- Consulte a documentação completa
