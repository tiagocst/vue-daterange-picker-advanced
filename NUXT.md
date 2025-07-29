# Vue DateRange Picker Advanced - Configuração Nuxt

## Instalação Rápida para Nuxt 3

### 1. Instalar o pacote
```bash
npm install @tiagocst/vue-daterange-picker-advanced
# ou
pnpm add @tiagocst/vue-daterange-picker-advanced
```

### 2. Criar Plugin
Crie o arquivo `plugins/vue-daterange-picker-advanced.client.js`:

```javascript
import VueDateRangePickerAdvanced from '@tiagocst/vue-daterange-picker-advanced'
import '@tiagocst/vue-daterange-picker-advanced/dist/vue-daterange-picker-advanced.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDateRangePickerAdvanced)
})
```

### 3. Usar no Componente
```vue
<template>
  <div class="p-4">
    <h1>Minha Aplicação Nuxt</h1>
    
    <!-- Sempre usar client-only para SSR -->
    <client-only>
      <DateRangePicker
        v-model="selectedRange"
        primary-color="#00DC82"
        placeholder="Selecione o período..."
        @update:model-value="onDateChange"
      />
      
      <!-- Fallback durante SSR -->
      <template #fallback>
        <div class="bg-gray-200 animate-pulse h-10 rounded"></div>
      </template>
    </client-only>
    
    <div v-if="selectedRange" class="mt-4 p-4 bg-green-50 rounded">
      <p>Período selecionado: {{ formatRange(selectedRange) }}</p>
    </div>
  </div>
</template>

<script setup>
const selectedRange = ref(null)

const onDateChange = (range) => {
  console.log('Range atualizado:', range)
}

const formatRange = (range) => {
  if (!range?.start || !range?.end) return 'Nenhum período'
  
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  }
  
  const start = new Date(range.start).toLocaleDateString('pt-BR', options)
  const end = new Date(range.end).toLocaleDateString('pt-BR', options)
  
  return `${start} - ${end}`
}

// SEO/Meta
useHead({
  title: 'DateRange Picker | Minha App',
  meta: [
    { name: 'description', content: 'Seletor de período avançado' }
  ]
})
</script>
```

### 4. Configurações Opcionais no nuxt.config.ts

```typescript
export default defineNuxtConfig({
  // Se quiser pré-carregar o CSS globalmente
  css: [
    '@tiagocst/vue-daterange-picker-advanced/dist/vue-daterange-picker-advanced.css'
  ],
  
  // Para otimizar o bundle
  build: {
    transpile: ['@tiagocst/vue-daterange-picker-advanced']
  }
})
```

## Dicas Importantes

### ✅ Boas Práticas
- Sempre use `<client-only>` wrapper
- Inclua um fallback para melhor UX
- Importe o CSS no plugin ou globalmente
- Use `.client.js` no nome do plugin para renderização apenas no cliente

### ⚠️ Problemas Comuns
- **Erro de hidratação**: Use `<client-only>`
- **CSS não carregado**: Verifique se importou o CSS
- **Componente não registrado**: Verifique se o plugin está na pasta `plugins/`

### 🎨 Compatibilidade com Tailwind
O componente é totalmente compatível com Tailwind CSS. As classes são processadas automaticamente.

### 🔧 Customização
Todos os props e eventos do componente funcionam normalmente no Nuxt:

```vue
<DateRangePicker
  v-model="range"
  primary-color="#8B5CF6"
  :quick-options="quickOptions"
  :disabled-dates="disabledDates"
  layout="sidebar"
  @apply="handleApply"
  @cancel="handleCancel"
/>
```

## Suporte SSR

O componente é compatível com SSR mas requer renderização no cliente devido ao uso de:
- `Date` objects
- `localStorage` para persistência
- DOM manipulation para posicionamento

Por isso o uso do `<client-only>` é obrigatório.
