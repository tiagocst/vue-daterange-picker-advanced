# Nuxt 3 Example

## Installation

```bash
npm install vue-daterange-picker-advanced
```

## Usage

### Method 1: Plugin (Recommended)

Create `plugins/vue-daterange-picker-advanced.client.js`:

```javascript
import VueDateRangePickerAdvanced from 'vue-daterange-picker-advanced'
import 'vue-daterange-picker-advanced/dist/vue-daterange-picker-advanced.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDateRangePickerAdvanced)
})
```

### Method 2: Direct Import

In your component:

```vue
<template>
  <div>
    <client-only>
      <DateRangePicker
        v-model="selectedRange"
        primary-color="#3B82F6"
        placeholder="Select a date range..."
        @update:model-value="onDateChange"
      />
    </client-only>
  </div>
</template>

<script setup>
import { DateRangePicker } from 'vue-daterange-picker-advanced'
import 'vue-daterange-picker-advanced/dist/vue-daterange-picker-advanced.css'

const selectedRange = ref(null)

const onDateChange = (range) => {
  console.log('Date range changed:', range)
}
</script>
```

### Method 3: Nuxt Module (Future)

Add to `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['vue-daterange-picker-advanced/nuxt']
})
```

## Important Notes

- Use `<client-only>` wrapper for SSR compatibility
- The component uses browser-specific date handling, so client-side rendering is recommended
- CSS must be imported separately when using direct imports

## Full Example

```vue
<template>
  <div class="container mx-auto p-8">
    <h1 class="text-2xl font-bold mb-4">Nuxt 3 DateRange Picker Example</h1>
    
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Select Date Range:
      </label>
      
      <client-only>
        <DateRangePicker
          v-model="selectedRange"
          primary-color="#10B981"
          placeholder="Choose your dates..."
          @update:model-value="handleDateChange"
        />
        
        <template #fallback>
          <div class="animate-pulse bg-gray-200 h-10 rounded"></div>
        </template>
      </client-only>
      
      <div v-if="selectedRange" class="mt-4 p-4 bg-green-50 rounded">
        <h3 class="font-medium text-green-900">Selected Range:</h3>
        <p class="text-green-700">{{ formatRange(selectedRange) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const selectedRange = ref(null)

const handleDateChange = (range) => {
  console.log('Date range changed:', range)
}

const formatRange = (range) => {
  if (!range || !range.start || !range.end) return 'No range selected'
  const start = new Date(range.start).toLocaleDateString()
  const end = new Date(range.end).toLocaleDateString()
  return `${start} - ${end}`
}

// SEO
useHead({
  title: 'DateRange Picker - Nuxt 3 Example'
})
</script>
```
