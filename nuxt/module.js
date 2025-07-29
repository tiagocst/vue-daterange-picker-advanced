import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'vue-daterange-picker-advanced',
    configKey: 'vueDateRangePickerAdvanced'
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Register the plugin
    addPlugin(resolver.resolve('./plugin.js'))

    // Add CSS
    nuxt.options.css.push('vue-daterange-picker-advanced/dist/vue-daterange-picker-advanced.css')
  }
})
