<!-- app/components/ContactForm.vue -->
<template>
  <div>
    <div v-if="!submitted" class="con-form">
      <div class="con-form-row">
        <div class="fld">
          <label>{{ t('con.nameLbl') }}</label>
          <input v-model="form.name" type="text" :placeholder="t('con.nameLbl')" autocomplete="name" />
        </div>
        <div class="fld">
          <label>{{ t('con.phoneLbl') }}</label>
          <input v-model="form.phone" type="tel" placeholder="+380" autocomplete="tel" />
        </div>
      </div>
      <div class="fld">
        <label>{{ t('con.methodLbl') }}</label>
        <div class="method-group">
          <button
            v-for="m in methods"
            :key="m.val"
            class="method-btn"
            :class="{ on: form.method === m.val }"
            type="button"
            @click="form.method = m.val"
          >{{ m.label }}</button>
        </div>
      </div>
      <div class="fld">
        <label>{{ t('con.msgLbl') }}</label>
        <textarea v-model="form.message" rows="4" :placeholder="t('con.msgPh')"></textarea>
      </div>
      <div class="con-submit">
        <button
          class="btn-p"
          type="button"
          :disabled="loading || !form.name || !form.phone"
          @click="submit"
          style="width:100%;justify-content:center;padding:14px"
        >
          {{ loading ? '...' : t('con.submit') }}
        </button>
      </div>
      <p v-if="error" style="color:#e85800;font-size:.85rem;margin-top:8px">{{ error }}</p>
    </div>

    <div v-else class="con-success">
      <div class="con-success-ic">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="con-success-t">{{ t('con.successT') }}</div>
      <div class="con-success-s">{{ t('con.successS') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ content: Array<{ key: string; lang: string; value: string }> }>()
const { t } = useSiteContent(props.content)
const { lang } = useLang()

const form = reactive({ name: '', phone: '', method: 'call', message: '' })
const loading = ref(false)
const submitted = ref(false)
const error = ref('')

const methods = computed(() => [
  { val: 'call', label: t('con.callOpt') },
  { val: 'telegram', label: 'Telegram' },
  { val: 'viber', label: 'Viber' },
  { val: 'whatsapp', label: 'WhatsApp' },
])

const submit = async () => {
  if (!form.name || !form.phone) return
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/contacts', {
      method: 'POST',
      body: { ...form, lang: lang.value },
    })
    submitted.value = true
  } catch {
    error.value = 'Помилка. Спробуйте ще раз.'
  } finally {
    loading.value = false
  }
}
</script>
