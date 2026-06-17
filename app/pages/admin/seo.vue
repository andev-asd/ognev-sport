<!-- app/pages/admin/seo.vue -->
<template>
  <div>
    <div class="admin-page-header">
      <h1>SEO</h1>
      <div style="display:flex;align-items:center;gap:12px">
        <LangTabs v-model="activeLang" />
        <button class="btn-p" :disabled="saving" :class="{ 'btn-dirty': isDirty && !saving }" @click="saveAll">
          {{ saving ? 'Сохраняется...' : isDirty ? 'Сохранить ●' : 'Сохранить' }}
        </button>
      </div>
    </div>

    <div v-if="pending" style="color:#7a7068">Загрузка...</div>
    <template v-else>
      <div class="seo-pages">
        <div v-for="page in pages" :key="page.key" class="seo-card">
          <div class="seo-card-header">
            <span class="seo-page-name">{{ page.label }}</span>
            <span class="seo-page-url">{{ page.url }}</span>
          </div>

          <!-- Google preview -->
          <div class="google-preview">
            <div class="gp-site">ognevsport.com{{ page.url }}</div>
            <div class="gp-title">{{ textMap[`seo.${page.key}.title__${activeLang}`] || page.label + ' — OgnevSport' }}</div>
            <div class="gp-desc">{{ textMap[`seo.${page.key}.desc__${activeLang}`] || '—' }}</div>
          </div>

          <div class="seo-fields">
            <div class="seo-field">
              <label>Title <span class="char-count" :class="{ warn: (textMap[`seo.${page.key}.title__${activeLang}`] || '').length > 60 }">{{ (textMap[`seo.${page.key}.title__${activeLang}`] || '').length }}/60</span></label>
              <input
                v-model="textMap[`seo.${page.key}.title__${activeLang}`]"
                class="seo-input"
                :placeholder="page.label + ' — OgnevSport'"
                @input="isDirty = true"
              />
            </div>
            <div class="seo-field">
              <label>Description <span class="char-count" :class="{ warn: (textMap[`seo.${page.key}.desc__${activeLang}`] || '').length > 160 }">{{ (textMap[`seo.${page.key}.desc__${activeLang}`] || '').length }}/160</span></label>
              <textarea
                v-model="textMap[`seo.${page.key}.desc__${activeLang}`]"
                class="seo-input"
                rows="2"
                :placeholder="page.defaultDesc"
                @input="isDirty = true"
              ></textarea>
            </div>
            <div class="seo-field">
              <label>og:image <span class="seo-hint">(URL, одне для всіх мов)</span></label>
              <div class="og-image-wrap">
                <input
                  v-model="ogImages[page.key]"
                  class="seo-input"
                  placeholder="https://..."
                  @input="isDirty = true"
                />
                <div v-if="ogImages[page.key]" class="og-image-thumb">
                  <img :src="ogImages[page.key]" alt="og:image preview" />
                </div>
              </div>
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

const pages = [
  { key: 'home',     label: 'Головна',  url: '/',          defaultDesc: 'Виробник спортивних тренажерів для залів.' },
  { key: 'catalog',  label: 'Каталог',  url: '/equipment', defaultDesc: 'Весь асортимент спортивних тренажерів.' },
  { key: 'contacts', label: 'Контакти', url: '/contacts',  defaultDesc: 'Зв\'яжіться з OgnevSport.' },
]

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

const [{ data: rawContent, pending }, { data: rawSettings }] = await Promise.all([
  useFetch('/api/admin/content', { headers: await getAuthHeaders() }),
  useFetch('/api/admin/settings', { headers: await getAuthHeaders() }),
])

const textMap = reactive<Record<string, string>>({})
for (const item of (rawContent.value as any[]) ?? []) {
  if (item.key.startsWith('seo.')) textMap[`${item.key}__${item.lang}`] = item.value
}

const ogImages = reactive<Record<string, string>>({})
for (const page of pages) {
  const s = (rawSettings.value as any[])?.find((r: any) => r.key === `seo.${page.key}.ogImage`)
  ogImages[page.key] = s?.value ?? ''
}

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

    const settingsPayload = pages.map(p => ({
      key: `seo.${p.key}.ogImage`,
      value: ogImages[p.key] ?? '',
    }))
    await $fetch('/api/admin/settings', { method: 'PUT', headers, body: settingsPayload })

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

.seo-pages { display: flex; flex-direction: column; gap: 16px; }

.seo-card { background: #1c1917; border: 1px solid #2e2821; border-radius: 14px; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.seo-card-header { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid #2e2821; }
.seo-page-name { font-size: .72rem; font-weight: 700; color: #7a7068; text-transform: uppercase; letter-spacing: .1em; }
.seo-page-url { font-size: .78rem; color: #3a3530; font-family: monospace; }

/* Google SERP preview */
.google-preview { background: #0f0e0d; border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 3px; }
.gp-site { font-size: .72rem; color: #5f6368; }
.gp-title { font-size: 1rem; color: #8ab4f8; font-weight: 400; line-height: 1.3; }
.gp-desc { font-size: .82rem; color: #bdc1c6; line-height: 1.5; margin-top: 2px; }

.seo-fields { display: flex; flex-direction: column; gap: 14px; }
.seo-field { display: flex; flex-direction: column; gap: 6px; }
.seo-field label { font-size: .8rem; font-weight: 600; color: #a09080; display: flex; align-items: center; gap: 6px; }
.char-count { font-size: .72rem; color: #3a3530; font-weight: 400; margin-left: auto; }
.char-count.warn { color: #e85800; }
.seo-hint { font-size: .72rem; color: #3a3530; font-weight: 400; }

.seo-input { background: #0f0e0d; border: 1px solid #3a3530; border-radius: 8px; padding: 9px 12px; color: #f0ebe3; font-family: inherit; font-size: .88rem; outline: none; transition: border-color .15s; width: 100%; box-sizing: border-box; resize: vertical; }
.seo-input:focus { border-color: #e85800; }

.og-image-wrap { display: flex; flex-direction: column; gap: 10px; }
.og-image-thumb { width: 120px; height: 63px; border-radius: 6px; overflow: hidden; border: 1px solid #3a3530; }
.og-image-thumb img { width: 100%; height: 100%; object-fit: cover; }
</style>
