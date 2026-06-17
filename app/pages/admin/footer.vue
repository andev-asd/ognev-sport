<!-- app/pages/admin/footer.vue -->
<template>
  <div>
    <div class="admin-page-header">
      <h1>Редактор футера</h1>
      <div style="display:flex;align-items:center;gap:12px">
        <LangTabs v-model="activeLang" />
        <button class="btn-p" :disabled="saving" :class="{ 'btn-dirty': isDirty && !saving }" @click="saveAll">
          {{ saving ? 'Сохраняется...' : isDirty ? 'Сохранить ●' : 'Сохранить' }}
        </button>
      </div>
    </div>

    <div v-if="pending" style="color:#7a7068">Загрузка...</div>
    <template v-else>

      <!-- Preview -->
      <div class="section-card" style="margin-bottom:16px">
        <div class="section-label"><span class="section-name">Превью</span></div>
        <div class="ft-preview">
          <div class="ftp-brand">
            <span class="ftp-logo"><span style="color:#e85800">Ognev</span>Sport</span>
            <RichTextInput v-model="textMap[`foot__${activeLang}`]" placeholder="© 2026 OgnevSport..." ce-class="ef ftp-cp-ef" single-line />
          </div>
          <div class="ftp-contacts">
            <input v-model="settings.phone"    class="ftp-contact-ef" placeholder="Телефон" @input="isDirty = true" />
            <input v-model="settings.email"    class="ftp-contact-ef" placeholder="Email" @input="isDirty = true" />
            <input v-model="settings.telegram" class="ftp-contact-ef" placeholder="@telegram" @input="isDirty = true" />
          </div>
          <div class="ftp-nav">
            <RichTextInput v-model="textMap[`nav.home__${activeLang}`]" placeholder="Головна" ce-class="ef ftp-nav-ef" single-line />
            <RichTextInput v-model="textMap[`nav.eq__${activeLang}`]"   placeholder="Тренажери" ce-class="ef ftp-nav-ef" single-line />
            <RichTextInput v-model="textMap[`nav.con__${activeLang}`]"  placeholder="Контакти" ce-class="ef ftp-nav-ef" single-line />
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

const [{ data: rawContent, pending }, { data: rawSettings }] = await Promise.all([
  useFetch('/api/admin/content', { headers: await getAuthHeaders() }),
  useFetch('/api/admin/settings', { headers: await getAuthHeaders() }),
])

const textMap = reactive<Record<string, string>>({})
const FOOTER_KEYS = ['foot', 'nav.home', 'nav.eq', 'nav.con']
for (const item of (rawContent.value as any[]) ?? []) {
  if (FOOTER_KEYS.includes(item.key)) textMap[`${item.key}__${item.lang}`] = item.value
}

const settings = reactive({ phone: '', email: '', telegram: '' })
const rawS = rawSettings.value as any[] ?? []
settings.phone    = rawS.find(s => s.key === 'foot.phone')?.value    ?? ''
settings.email    = rawS.find(s => s.key === 'foot.email')?.value    ?? ''
settings.telegram = rawS.find(s => s.key === 'foot.telegram')?.value ?? ''

watch([textMap, settings], () => { isDirty.value = true }, { deep: true })

onMounted(() => {
  window.addEventListener('beforeunload', (e) => {
    if (isDirty.value) { e.preventDefault(); e.returnValue = '' }
  })
})

const saveAll = async () => {
  saving.value = true
  saveError.value = ''
  try {
    const headers = await getAuthHeaders()

    const contentPayload = Object.entries(textMap).map(([k, value]) => {
      const sepIdx = k.lastIndexOf('__')
      return { key: k.slice(0, sepIdx), lang: k.slice(sepIdx + 2), value }
    })
    await $fetch('/api/admin/content', { method: 'PUT', headers, body: contentPayload })

    await $fetch('/api/admin/settings', {
      method: 'PUT', headers,
      body: [
        { key: 'foot.phone',    value: settings.phone },
        { key: 'foot.email',    value: settings.email },
        { key: 'foot.telegram', value: settings.telegram },
      ],
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

/* Footer preview */
.ft-preview { background: #0f0e0d; border-radius: 10px; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }

.ftp-brand { display: flex; flex-direction: column; gap: 6px; }
.ftp-logo { font-size: 1rem; font-weight: 800; color: #f0ebe3; }
.ftp-cp-ef { font-size: .75rem; color: #7a7068; }

.ftp-contacts { display: flex; flex-direction: column; gap: 6px; }
.ftp-contact-ef { background: transparent; border: none; border-bottom: 1px dashed #3a3530; color: #a09080; font-size: .78rem; font-family: inherit; outline: none; padding: 2px 0; width: 180px; transition: border-color .15s; }
.ftp-contact-ef:hover { border-bottom-color: #6a5a4a; }
.ftp-contact-ef:focus { border-bottom-color: #e85800; }
.ftp-contact-ef::placeholder { color: #3a3530; }

.ftp-nav { display: flex; gap: 20px; }
.ftp-nav-ef { font-size: .78rem; color: #7a7068; min-width: 60px; }
</style>
