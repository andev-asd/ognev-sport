<template>
  <button type="button" class="ai-trigger-btn" @click="open = true">✨ AI</button>

  <AiPanel
    :open="open"
    :field="field"
    :field-label="fieldLabel || field"
    :initial-text="value"
    @close="open = false"
    @done="(r) => { $emit('done', r) }"
  />
</template>

<script setup lang="ts">
defineProps<{ field: string; fieldLabel?: string; value: string }>()
defineEmits<{ done: [result: { ua: string; ru: string; en: string }] }>()
const open = ref(false)
</script>

<style scoped>
.ai-trigger-btn { padding: 4px 10px; border-radius: 6px; background: rgba(232,88,0,.12); border: 1px solid rgba(232,88,0,.28); color: #e85800; font-size: .72rem; font-weight: 700; letter-spacing: .04em; cursor: pointer; transition: all .15s; font-family: inherit; flex-shrink: 0; }
.ai-trigger-btn:hover { background: rgba(232,88,0,.22); border-color: #e85800; }
</style>
