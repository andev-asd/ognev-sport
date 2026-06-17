<template>
  <Teleport to="body">
    <div v-if="modelValue" class="confirm-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="confirm-modal">
        <div class="confirm-title">{{ title }}</div>
        <div v-if="message" class="confirm-message">{{ message }}</div>
        <div class="confirm-footer">
          <button class="confirm-cancel" @click="$emit('update:modelValue', false)">Отмена</button>
          <button class="confirm-ok" @click="$emit('confirm')">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message?: string
  confirmLabel?: string
}>(), { confirmLabel: 'Удалить' })
defineEmits<{ 'update:modelValue': [v: boolean]; confirm: [] }>()
</script>

<style scoped>
.confirm-backdrop { position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,.72); display: flex; align-items: center; justify-content: center; padding: 20px; }
.confirm-modal { background: #1c1917; border: 1px solid #3a3530; border-radius: 14px; width: 100%; max-width: 400px; padding: 24px; display: flex; flex-direction: column; gap: 12px; box-shadow: 0 24px 64px rgba(0,0,0,.6); }
.confirm-title { font-size: .97rem; font-weight: 700; color: #f0ebe3; line-height: 1.4; }
.confirm-message { font-size: .85rem; color: #7a7068; line-height: 1.55; }
.confirm-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.confirm-cancel { padding: 8px 18px; border-radius: 8px; background: none; border: 1px solid #3a3530; color: #a09080; font-size: .85rem; font-family: inherit; cursor: pointer; transition: border-color .15s, color .15s; }
.confirm-cancel:hover { border-color: #7a7068; color: #f0ebe3; }
.confirm-ok { padding: 8px 18px; border-radius: 8px; background: #7f1d1d; border: none; color: #fca5a5; font-size: .85rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: background .15s; }
.confirm-ok:hover { background: #991b1b; }
</style>
