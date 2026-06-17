<!-- app/pages/admin/contacts.vue -->
<template>
  <div>
    <div class="admin-page-header">
      <h1>Редактор контактів</h1>
      <div style="display:flex;align-items:center;gap:12px">
        <LangTabs v-model="activeLang" />
        <button class="btn-p" :disabled="saving" :class="{ 'btn-dirty': isDirty && !saving }" @click="saveAll">
          {{ saving ? 'Сохраняется...' : isDirty ? 'Сохранить ●' : 'Сохранить' }}
        </button>
      </div>
    </div>

    <div v-if="pending" style="color:#7a7068">Загрузка...</div>
    <template v-else>

      <!-- Preview: страница контактов -->
      <div class="section-card">
        <div class="section-label"><span class="section-name">Страница контактів</span></div>

        <div class="con-preview">
          <!-- Left: heading + form labels -->
          <div class="con-left">
            <RichTextInput
              v-model="textMap[`con.title__${activeLang}`]"
              placeholder="Заголовок"
              ce-class="ef con-title-ef"
            />
            <RichTextInput
              v-model="textMap[`con.sub__${activeLang}`]"
              placeholder="Подзаголовок"
              ce-class="ef con-sub-ef"
            />

            <div class="con-form-preview">
              <div class="con-field-row">
                <div class="con-field">
                  <div class="con-field-label">
                    <RichTextInput v-model="textMap[`con.nameLbl__${activeLang}`]" placeholder="Лейбл Имя" ce-class="ef con-lbl-ef" single-line />
                  </div>
                  <div class="con-field-input">Іван Петренко</div>
                </div>
                <div class="con-field">
                  <div class="con-field-label">
                    <RichTextInput v-model="textMap[`con.phoneLbl__${activeLang}`]" placeholder="Лейбл Телефон" ce-class="ef con-lbl-ef" single-line />
                  </div>
                  <div class="con-field-input">+380 99 000 00 00</div>
                </div>
              </div>

              <div class="con-field">
                <div class="con-field-label">
                  <RichTextInput v-model="textMap[`con.methodLbl__${activeLang}`]" placeholder="Лейбл Способ связи" ce-class="ef con-lbl-ef" single-line />
                </div>
                <div class="con-method-opts">
                  <span class="con-opt con-opt--active">
                    <RichTextInput v-model="textMap[`con.callOpt__${activeLang}`]" placeholder="Звонок" ce-class="ef con-opt-ef" single-line />
                  </span>
                  <span class="con-opt">Telegram</span>
                  <span class="con-opt">Viber</span>
                </div>
              </div>

              <div class="con-field">
                <div class="con-field-label">
                  <RichTextInput v-model="textMap[`con.msgLbl__${activeLang}`]" placeholder="Лейбл Сообщение" ce-class="ef con-lbl-ef" single-line />
                </div>
                <div class="con-field-input con-field-input--tall">
                  <RichTextInput v-model="textMap[`con.msgPh__${activeLang}`]" placeholder="Placeholder сообщения" ce-class="ef con-ph-ef" />
                </div>
              </div>

              <div class="con-submit-row">
                <div class="con-submit-btn">
                  <RichTextInput v-model="textMap[`con.submit__${activeLang}`]" placeholder="Текст кнопки" ce-class="ef con-submit-ef" single-line />
                </div>
              </div>
            </div>
          </div>

          <!-- Right: success state -->
          <div class="con-right">
            <div class="section-name" style="margin-bottom:16px">Состояние после отправки</div>
            <div class="con-success-preview">
              <div class="con-success-icon">✓</div>
              <RichTextInput v-model="textMap[`con.successT__${activeLang}`]" placeholder="Заголовок успеха" ce-class="ef con-success-t-ef" single-line />
              <RichTextInput v-model="textMap[`con.successS__${activeLang}`]" placeholder="Подпись успеха" ce-class="ef con-success-s-ef" />
            </div>
          </div>
        </div>
      </div>

    </template>

    <p v-if="saveError" style="color:#e85800;margin-top:12px;font-size:.88rem">{{ saveError }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
const supabase = useSupabaseClient()
const saving = ref(false)
const saveError = ref('')
const isDirty = ref(false)
const activeLang = ref<'ua' | 'ru' | 'en'>('ua')

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

const { data: rawContent, pending } = await useFetch('/api/admin/content', {
  headers: await getAuthHeaders(),
})

const textMap = reactive<Record<string, string>>({})
for (const item of (rawContent.value as any[]) ?? []) {
  textMap[`${item.key}__${item.lang}`] = item.value
}

watch([textMap], () => { isDirty.value = true }, { deep: true })

onMounted(() => {
  window.addEventListener('beforeunload', (e) => {
    if (isDirty.value) { e.preventDefault(); e.returnValue = '' }
  })
})

const saveAll = async () => {
  saving.value = true
  saveError.value = ''
  try {
    const payload = Object.entries(textMap)
      .filter(([k]) => k.startsWith('con.'))
      .map(([k, value]) => {
        const sepIdx = k.lastIndexOf('__')
        return { key: k.slice(0, sepIdx), lang: k.slice(sepIdx + 2), value }
      })
    await $fetch('/api/admin/content', {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: payload,
    })
    isDirty.value = false
  } catch {
    saveError.value = 'Ошибка сохранения.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.admin-page-header h1 { font-size: 1.4rem; font-weight: 700; color: #f0ebe3; margin: 0; }
.btn-dirty { background: #b84400 !important; box-shadow: 0 0 0 2px rgba(232,88,0,.35); }

.section-card { background: #1c1917; border: 1px solid #2e2821; border-radius: 14px; padding: 24px; }
.section-label { margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #2e2821; }
.section-name { font-size: .72rem; font-weight: 700; color: #7a7068; text-transform: uppercase; letter-spacing: .1em; }

.con-preview { display: grid; grid-template-columns: 1fr 320px; gap: 32px; align-items: start; }

/* Left column */
.con-left { display: flex; flex-direction: column; gap: 20px; }
.con-title-ef { font-family: Georgia, serif; font-size: 1.6rem; font-weight: 400; color: #f0ebe3; }
.con-sub-ef { font-size: .95rem; color: #a09080; line-height: 1.6; }

.con-form-preview { display: flex; flex-direction: column; gap: 14px; border: 1px solid #2e2821; border-radius: 12px; padding: 20px; background: #0f0e0d; }
.con-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.con-field { display: flex; flex-direction: column; gap: 6px; }
.con-field-label { }
.con-lbl-ef { font-size: .8rem; font-weight: 600; color: #f0ebe3; }
.con-field-input { background: #1c1917; border: 1px solid #3a3530; border-radius: 8px; padding: 9px 12px; color: #3a3530; font-size: .88rem; }
.con-field-input--tall { min-height: 72px; }
.con-ph-ef { font-size: .88rem; color: #3a3530; }

.con-method-opts { display: flex; gap: 8px; flex-wrap: wrap; }
.con-opt { padding: 6px 14px; border: 1px solid #3a3530; border-radius: 100px; font-size: .82rem; color: #7a7068; }
.con-opt--active { border-color: rgba(232,88,0,.4); background: rgba(232,88,0,.08); }
.con-opt-ef { font-size: .82rem; color: #e85800; }

.con-submit-row { display: flex; }
.con-submit-btn { padding: 10px 24px; background: #e85800; border-radius: 10px; }
.con-submit-ef { font-size: .95rem; font-weight: 600; color: #fff; }

/* Right column: success */
.con-right { background: #0f0e0d; border-radius: 12px; padding: 24px; }
.con-success-preview { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 16px 0; }
.con-success-icon { width: 48px; height: 48px; border-radius: 50%; background: rgba(232,88,0,.12); border: 2px solid rgba(232,88,0,.3); color: #e85800; font-size: 1.4rem; display: flex; align-items: center; justify-content: center; }
.con-success-t-ef { font-size: 1.1rem; font-weight: 700; color: #f0ebe3; text-align: center; }
.con-success-s-ef { font-size: .88rem; color: #7a7068; line-height: 1.5; text-align: center; }

@media (max-width: 900px) {
  .con-preview { grid-template-columns: 1fr; }
  .con-field-row { grid-template-columns: 1fr; }
}
</style>
