<!-- app/components/admin/LangTabs.vue -->
<template>
  <div class="lang-tabs">
    <div class="lang-tabs-header">
      <button
        v-for="l in langs"
        :key="l"
        class="lang-tab"
        :class="{ active: modelValue === l }"
        type="button"
        @click="$emit('update:modelValue', l)"
      >{{ l.toUpperCase() }}</button>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: 'ua' | 'ru' | 'en' }>()
defineEmits<{ 'update:modelValue': [lang: 'ua' | 'ru' | 'en'] }>()
const langs = ['ua', 'ru', 'en'] as const
</script>

<style scoped>
.lang-tabs-header { display: flex; gap: 4px; margin-bottom: 16px; }
.lang-tab { padding: 6px 14px; border-radius: 6px; background: #1c1917; border: 1px solid #2e2821; color: #7a7068; font-size: .8rem; font-weight: 700; cursor: pointer; transition: all .15s; font-family: inherit; }
.lang-tab.active { background: #e85800; border-color: #e85800; color: #fff; }
.lang-tab:hover:not(.active) { border-color: #7a7068; color: #f0ebe3; }
</style>
