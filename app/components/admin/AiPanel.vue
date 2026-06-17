<template>
  <Teleport to="body">
    <div v-if="open" class="ai-overlay" @click.self="$emit('close')">
      <div class="ai-panel">
        <div class="ai-panel-header">
          <span>✨ AI-редактор — {{ fieldLabel }}</span>
          <button type="button" @click="$emit('close')">✕</button>
        </div>

        <div v-if="loading && step === 1" class="ai-loading">Анализируем текст...</div>

        <!-- Step 1: Fix -->
        <div v-else-if="step === 1" class="ai-step">
          <div class="ai-step-label">Шаг 1 из {{ field === 'description' ? 3 : 2 }} — Исправление</div>
          <div v-if="detectedLang" class="ai-detected">
            Обнаружен язык: <strong>{{ langNames[detectedLang] }}</strong>
          </div>
          <textarea v-model="editedText" class="ai-textarea" rows="7"></textarea>
          <div class="ai-step-actions">
            <button type="button" class="btn-s" @click="$emit('close')">Отмена</button>
            <button type="button" class="btn-p" :disabled="loading" @click="goTranslate">
              {{ loading ? '...' : 'Перевести →' }}
            </button>
          </div>
        </div>

        <!-- Step 2: Translations -->
        <div v-else-if="step === 2" class="ai-step">
          <div class="ai-step-label">Шаг 2 из {{ field === 'description' ? 3 : 2 }} — Переводы</div>
          <div v-for="l in (['ua', 'ru', 'en'] as const)" :key="l" class="ai-lang-block">
            <label class="ai-lang-label">{{ l.toUpperCase() }}</label>
            <textarea v-model="translations[l]" class="ai-textarea" rows="4"></textarea>
          </div>
          <div class="ai-step-actions">
            <button type="button" class="btn-s" @click="step = 1">← Назад</button>
            <button v-if="field === 'description'" type="button" class="btn-p" :disabled="loading" @click="goSeo">
              {{ loading ? '...' : 'Добавить SEO →' }}
            </button>
            <button v-else type="button" class="btn-p" @click="finish">Сохранить</button>
          </div>
        </div>

        <!-- Step 3: SEO preview -->
        <div v-else-if="step === 3" class="ai-step">
          <div class="ai-step-label">Шаг 3 из 3 — SEO-разметка</div>
          <p class="ai-seo-hint">Жирным — ключевые характеристики, курсивом — важные уточнения.</p>
          <div v-for="l in (['ua', 'ru', 'en'] as const)" :key="l" class="ai-lang-block">
            <label class="ai-lang-label">{{ l.toUpperCase() }}</label>
            <div class="ai-preview" v-html="translations[l]"></div>
          </div>
          <div class="ai-step-actions">
            <button type="button" class="btn-s" @click="step = 2">← Без SEO-разметки</button>
            <button type="button" class="btn-p" @click="finish">Сохранить с разметкой</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  open: boolean
  field: string
  fieldLabel: string
  initialText: string
}>()

const emit = defineEmits<{
  close: []
  done: [result: { ua: string; ru: string; en: string }]
}>()

const step = ref(1)
const loading = ref(false)
const editedText = ref('')
const detectedLang = ref<'ua' | 'ru' | 'en' | null>(null)
const translations = reactive<{ ua: string; ru: string; en: string }>({ ua: '', ru: '', en: '' })
const langNames = { ua: 'Украинский', ru: 'Русский', en: 'English' }

watch(() => props.open, async (val) => {
  if (!val) return
  step.value = 1
  editedText.value = props.initialText
  translations.ua = ''
  translations.ru = ''
  translations.en = ''
  detectedLang.value = null
  loading.value = true
  try {
    const result = await $fetch('/api/ai/fix', {
      method: 'POST',
      body: { text: props.initialText, field: props.field },
    }) as { correctedText: string; detectedLang: 'ua' | 'ru' | 'en' }
    editedText.value = result.correctedText
    detectedLang.value = result.detectedLang
  } catch { /* keep original */ }
  finally { loading.value = false }
})

const goTranslate = async () => {
  loading.value = true
  try {
    const result = await $fetch('/api/ai/translate', {
      method: 'POST',
      body: { text: editedText.value, sourceLang: detectedLang.value ?? 'ua', field: props.field },
    }) as { ua: string; ru: string; en: string }
    Object.assign(translations, result)
    step.value = 2
  } finally { loading.value = false }
}

const goSeo = async () => {
  loading.value = true
  try {
    const result = await $fetch('/api/ai/seo', {
      method: 'POST',
      body: { ua: translations.ua, ru: translations.ru, en: translations.en },
    }) as { ua: string; ru: string; en: string }
    Object.assign(translations, result)
    step.value = 3
  } finally { loading.value = false }
}

const finish = () => {
  emit('done', { ...translations })
  emit('close')
}
</script>

<style scoped>
.ai-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.78); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
.ai-panel { background: #1c1917; border: 1px solid #2e2821; border-radius: 16px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; }
.ai-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid #2e2821; font-weight: 600; font-size: .95rem; color: #f0ebe3; position: sticky; top: 0; background: #1c1917; z-index: 1; }
.ai-panel-header button { background: none; border: none; color: #7a7068; font-size: 1.1rem; cursor: pointer; padding: 4px; }
.ai-loading { padding: 48px 24px; text-align: center; color: #7a7068; }
.ai-step { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.ai-step-label { font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #e85800; }
.ai-detected { font-size: .82rem; color: #7a7068; }
.ai-detected strong { color: #f0ebe3; }
.ai-lang-block { display: flex; flex-direction: column; gap: 6px; }
.ai-lang-label { font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #7a7068; }
.ai-textarea { background: #0f0e0d; border: 1px solid #3a3530; border-radius: 9px; padding: 11px 14px; color: #f0ebe3; font-family: inherit; font-size: .88rem; resize: vertical; outline: none; transition: border-color .15s; width: 100%; box-sizing: border-box; }
.ai-textarea:focus { border-color: #e85800; }
.ai-step-actions { display: flex; gap: 8px; justify-content: flex-end; padding-top: 4px; }
.ai-seo-hint { font-size: .78rem; color: #7a7068; line-height: 1.5; margin: 0; }
.ai-preview { background: #0f0e0d; border: 1px solid #3a3530; border-radius: 9px; padding: 11px 14px; font-size: .88rem; line-height: 1.65; color: #f0ebe3; min-height: 60px; }
</style>
