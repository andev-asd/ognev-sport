<!-- app/pages/admin/home.vue -->
<template>
  <div>
    <!-- Header -->
    <div class="admin-page-header">
      <h1>Редактор главной</h1>
      <div style="display:flex;align-items:center;gap:12px">
        <LangTabs v-model="activeLang" />
        <button class="btn-p" :disabled="saving" :class="{ 'btn-dirty': isDirty && !saving }" @click="saveAll">
          {{ saving ? 'Сохраняется...' : isDirty ? 'Сохранить всё ●' : 'Сохранить всё' }}
        </button>
      </div>
    </div>

    <div v-if="pending" style="color:#7a7068">Загрузка...</div>
    <template v-else>

      <!-- ══ HERO ══════════════════════════════════════════════════ -->
      <div class="section-card" style="margin-bottom:16px">
        <div class="section-label">
          <span class="section-name">Hero</span>
          <label class="vis-toggle"><input type="checkbox" v-model="sections[0].visible" /> Показывать</label>
        </div>

        <div class="hero-preview">
          <!-- Text side -->
          <div class="hero-text-side">
            <!-- Badge -->
            <div class="badge-wrap">
              <span class="badge-dot"></span>
              <RichTextInput
                v-model="textMap[`hero.eyebrow__${activeLang}`]"
                placeholder="Подзаголовок (badge)"
                ce-class="ef badge-ef"
                single-line
              />
            </div>
            <!-- H1 -->
            <RichTextInput
              v-model="textMap[`hero.title__${activeLang}`]"
              placeholder="Заголовок H1"
              ce-class="ef h1-ef"
            />
            <!-- Slogan -->
            <RichTextInput
              v-model="textMap[`hero.slogan__${activeLang}`]"
              placeholder="Слоган (под заголовком)"
              ce-class="ef slogan-ef"
              single-line
            />
            <!-- Sub -->
            <RichTextInput
              v-model="textMap[`hero.sub__${activeLang}`]"
              placeholder="Описание"
              ce-class="ef sub-ef"
            />
            <!-- CTAs -->
            <div class="cta-row">
              <RichTextInput
                v-model="textMap[`hero.cta__${activeLang}`]"
                placeholder="Кнопка 1"
                ce-class="ef cta-primary-ef"
                single-line
              />
              <RichTextInput
                v-model="textMap[`hero.cta2__${activeLang}`]"
                placeholder="Кнопка 2"
                ce-class="ef cta-secondary-ef"
                single-line
              />
            </div>
          </div>

          <!-- Images side -->
          <div class="hero-img-side">
            <div class="img-side-label">Изображения (до 3)</div>
            <ImageUploader v-model="heroImages" bucket="site" />
            <div class="img-side-label" style="margin-top:14px">Фон секції (необов'язково)</div>
            <div class="hero-bg-upload">
              <div v-if="heroBg" class="hero-bg-thumb">
                <img :src="heroBg" alt="hero bg" />
                <button type="button" class="hero-bg-clear" @click="heroBg = ''">✕</button>
              </div>
              <button v-else type="button" class="hero-bg-add" @click="bgPickerOpen = true">+ Фон</button>
            </div>
            <MediaPickerModal v-model="bgPickerOpen" bucket="site" @select="urls => heroBg = urls[0]" />
          </div>
        </div>
      </div>

      <!-- ══ СТАТИСТИКА ════════════════════════════════════════════ -->
      <div class="section-card" style="margin-bottom:16px">
        <div class="section-label">
          <span class="section-name">Статистика</span>
          <label class="vis-toggle"><input type="checkbox" v-model="sections[1].visible" /> Показывать</label>
        </div>
        <div class="stats-preview">
          <div v-for="idx in statsCount" :key="idx - 1" class="stat-block">
            <div class="stat-block-hd">
              <button type="button" class="feat-del-btn" title="Удалить" @click="removeStat(idx - 1)">×</button>
            </div>
            <input v-model="textMap[`stats.${idx-1}.value__${activeLang}`]" class="ef stat-value-ef" placeholder="100+" />
            <RichTextInput
              v-model="textMap[`stats.${idx-1}.label__${activeLang}`]"
              placeholder="Подпись"
              ce-class="ef stat-label-ef"
              single-line
            />
          </div>
          <button type="button" class="stat-add-btn" @click="addStat">+</button>
        </div>
      </div>

      <!-- ══ О КОМПАНИИ ════════════════════════════════════════════ -->
      <div class="section-card" style="margin-bottom:16px">
        <div class="section-label">
          <span class="section-name">О компании</span>
          <label class="vis-toggle"><input type="checkbox" v-model="sections[2].visible" /> Показывать</label>
        </div>

        <div class="about-preview">
          <!-- Left: main text -->
          <div class="about-main">
            <RichTextInput
              v-model="textMap[`about.label__${activeLang}`]"
              placeholder="Метка (верхний тег)"
              ce-class="ef about-label-ef"
              single-line
            />
            <RichTextInput
              v-model="textMap[`about.title__${activeLang}`]"
              placeholder="Заголовок раздела"
              ce-class="ef about-title-ef"
              single-line
            />
            <RichTextInput
              v-model="textMap[`about.p1__${activeLang}`]"
              placeholder="Абзац 1"
              ce-class="ef about-p-ef"
            />
            <RichTextInput
              v-model="textMap[`about.p2__${activeLang}`]"
              placeholder="Абзац 2"
              ce-class="ef about-p-ef"
            />
          </div>

          <!-- Right: features -->
          <div class="about-features">
            <div class="features-hint">
              Преимущества
              <button type="button" class="feat-add-btn" @click="addFeat">+</button>
            </div>
            <div v-for="idx in featCount" :key="idx - 1" class="feat-block">
              <div class="feat-block-hd">
                <span class="feat-num">{{ idx }}</span>
                <button type="button" class="feat-del-btn" title="Удалить" @click="removeFeat(idx - 1)">×</button>
              </div>
              <RichTextInput
                v-model="textMap[`feat.${idx-1}.name__${activeLang}`]"
                placeholder="Название"
                ce-class="ef feat-name-ef"
                single-line
              />
              <RichTextInput
                v-model="textMap[`feat.${idx-1}.desc__${activeLang}`]"
                placeholder="Описание"
                ce-class="ef feat-desc-ef"
                single-line
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ══ ТОВАРЫ ═════════════════════════════════════════════════ -->
      <div class="section-card">
        <div class="section-label">
          <span class="section-name">Товары</span>
          <label class="vis-toggle"><input type="checkbox" v-model="sections[3].visible" /> Показывать</label>
        </div>
        <div style="color:#7a7068;font-size:.82rem;padding:8px 0">
          Товары берутся из раздела «Товары» и отображаются автоматически.
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

// Warn before closing with unsaved changes
onMounted(() => {
  window.addEventListener('beforeunload', (e) => {
    if (isDirty.value) { e.preventDefault(); e.returnValue = '' }
  })
})
onUnmounted(() => {
  window.removeEventListener('beforeunload', () => {})
})
const activeLang = ref<'ua' | 'ru' | 'en'>('ua')

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

const [{ data: rawContent }, { data: rawSettings }] = await Promise.all([
  useFetch('/api/admin/content', { headers: await getAuthHeaders() }),
  useFetch('/api/admin/settings', { headers: await getAuthHeaders() }),
])

const pending = ref(false)

// textMap: "key__lang" -> value
const textMap = reactive<Record<string, string>>({})
for (const item of (rawContent.value as any[]) ?? []) {
  textMap[`${item.key}__${item.lang}`] = item.value
}


const sections = reactive([
  { key: 'heroVisible',     label: 'Hero',       visible: true },
  { key: 'statsVisible',    label: 'Статистика', visible: true },
  { key: 'aboutVisible',    label: 'О компании', visible: true },
  { key: 'productsVisible', label: 'Товары',     visible: true },
])
for (const s of sections) {
  const raw = (rawSettings.value as any[])?.find((r: any) => r.key === s.key)
  if (raw) s.visible = raw.value !== 'false'
}

// Dynamic stats array
const statsCount = ref(0)
const initStatsCount = () => {
  const indices = Object.keys(textMap)
    .filter(k => /^stats\.\d+\.value__/.test(k))
    .map(k => parseInt(k.split('.')[1]))
  statsCount.value = indices.length > 0 ? Math.max(...indices) + 1 : 4
}
initStatsCount()

const addStat = () => {
  const i = statsCount.value
  for (const lang of ['ua', 'ru', 'en']) {
    textMap[`stats.${i}.value__${lang}`] = ''
    textMap[`stats.${i}.label__${lang}`] = ''
  }
  statsCount.value++
}

const removeStat = (removeIdx: number) => {
  for (let i = removeIdx; i < statsCount.value - 1; i++) {
    for (const lang of ['ua', 'ru', 'en']) {
      textMap[`stats.${i}.value__${lang}`] = textMap[`stats.${i + 1}.value__${lang}`] ?? ''
      textMap[`stats.${i}.label__${lang}`] = textMap[`stats.${i + 1}.label__${lang}`] ?? ''
    }
  }
  const last = statsCount.value - 1
  for (const lang of ['ua', 'ru', 'en']) {
    delete textMap[`stats.${last}.value__${lang}`]
    delete textMap[`stats.${last}.label__${lang}`]
  }
  statsCount.value--
}

// Dynamic features array
const featCount = ref(0)
const initFeatCount = () => {
  const indices = Object.keys(textMap)
    .filter(k => /^feat\.\d+\.name__/.test(k))
    .map(k => parseInt(k.split('.')[1]))
  featCount.value = indices.length > 0 ? Math.max(...indices) + 1 : 3
}
initFeatCount()

const addFeat = () => {
  const i = featCount.value
  for (const lang of ['ua', 'ru', 'en']) {
    textMap[`feat.${i}.name__${lang}`] = ''
    textMap[`feat.${i}.desc__${lang}`] = ''
  }
  featCount.value++
}

const removeFeat = (removeIdx: number) => {
  for (let i = removeIdx; i < featCount.value - 1; i++) {
    for (const lang of ['ua', 'ru', 'en']) {
      textMap[`feat.${i}.name__${lang}`] = textMap[`feat.${i + 1}.name__${lang}`] ?? ''
      textMap[`feat.${i}.desc__${lang}`] = textMap[`feat.${i + 1}.desc__${lang}`] ?? ''
    }
  }
  const last = featCount.value - 1
  for (const lang of ['ua', 'ru', 'en']) {
    delete textMap[`feat.${last}.name__${lang}`]
    delete textMap[`feat.${last}.desc__${lang}`]
  }
  featCount.value--
}

const heroImages = ref<string[]>([])
const heroImgSetting = (rawSettings.value as any[])?.find((r: any) => r.key === 'heroImages')
if (heroImgSetting) {
  try { heroImages.value = JSON.parse(heroImgSetting.value) } catch {}
}

const heroBg = ref('')
heroBg.value = (rawSettings.value as any[])?.find((r: any) => r.key === 'heroBg')?.value ?? ''

watch([textMap, sections, heroImages, heroBg], () => { isDirty.value = true }, { deep: true })

const bgPickerOpen = ref(false)

const saveAll = async () => {
  saving.value = true
  saveError.value = ''
  const headers = await getAuthHeaders()
  try {
    const contentPayload = Object.entries(textMap).map(([k, value]) => {
      const sepIdx = k.lastIndexOf('__')
      return { key: k.slice(0, sepIdx), lang: k.slice(sepIdx + 2), value }
    })
    await $fetch('/api/admin/content', { method: 'PUT', headers, body: contentPayload })

    const settingsPayload = [
      ...sections.map(s => ({ key: s.key, value: String(s.visible) })),
      { key: 'heroImages', value: JSON.stringify(heroImages.value) },
      { key: 'heroBg', value: heroBg.value },
    ]
    await $fetch('/api/admin/settings', { method: 'PUT', headers, body: settingsPayload })
    isDirty.value = false
  } catch {
    saveError.value = 'Ошибка сохранения. Попробуйте ещё раз.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* ── Layout ─────────────────────────────── */
.admin-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.admin-page-header h1 { font-size: 1.4rem; font-weight: 700; color: #f0ebe3; margin: 0; }
.btn-dirty { background: #b84400 !important; box-shadow: 0 0 0 2px rgba(232,88,0,.35); }

/* ── Section cards ───────────────────────── */
.section-card { background: #1c1917; border: 1px solid #2e2821; border-radius: 14px; padding: 24px; }
.section-label { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid #2e2821; }
.section-name { font-size: .72rem; font-weight: 700; color: #7a7068; text-transform: uppercase; letter-spacing: .1em; }
.vis-toggle { display: flex; align-items: center; gap: 6px; font-size: .8rem; color: #a09080; cursor: pointer; margin-left: auto; }

/* ── HERO ─────────────────────────────────── */
.hero-preview { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; }
.hero-text-side { display: flex; flex-direction: column; gap: 16px; }
.badge-wrap { display: inline-flex; align-items: center; gap: 8px; padding: 5px 14px; background: rgba(232,88,0,.1); border: 1px solid rgba(232,88,0,.2); border-radius: 100px; align-self: flex-start; }
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #e85800; flex-shrink: 0; }
.cta-row { display: flex; gap: 12px; }
.hero-img-side { display: flex; flex-direction: column; gap: 10px; }
.img-side-label { font-size: .72rem; font-weight: 700; color: #7a7068; text-transform: uppercase; letter-spacing: .08em; }
.hero-bg-upload { display: flex; align-items: flex-start; }
.hero-bg-thumb { position: relative; width: 120px; height: 70px; border-radius: 8px; overflow: hidden; border: 1px solid #3a3530; }
.hero-bg-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.hero-bg-clear { position: absolute; top: 4px; right: 4px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,.75); border: none; color: #fff; font-size: .65rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.hero-bg-add { width: 120px; height: 70px; border-radius: 8px; border: 2px dashed #2e2821; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #7a7068; font-size: .75rem; text-align: center; transition: border-color .15s, color .15s; }
.hero-bg-add:hover, .hero-bg-add.uploading { border-color: #e85800; color: #e85800; }

/* ── STATS ────────────────────────────────── */
.stats-preview { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; align-items: start; }
.stat-block { background: #0f0e0d; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 8px; text-align: center; }
.stat-block-hd { display: flex; justify-content: flex-end; margin-bottom: -4px; }
.stat-add-btn { background: #0f0e0d; border: 1px dashed #3a3530; border-radius: 10px; color: #3a3530; font-size: 1.4rem; cursor: pointer; min-height: 80px; display: flex; align-items: center; justify-content: center; transition: border-color .15s, color .15s; }
.stat-add-btn:hover { border-color: #e85800; color: #e85800; }

/* ── ABOUT ────────────────────────────────── */
.about-preview { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
.about-main { display: flex; flex-direction: column; gap: 14px; }
.about-features { display: flex; flex-direction: column; gap: 10px; }
.features-hint { font-size: .72rem; font-weight: 700; color: #7a7068; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
.feat-add-btn { margin-left: auto; width: 22px; height: 22px; border-radius: 50%; border: 1px solid #3a3530; background: transparent; color: #7a7068; font-size: 1rem; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color .15s, color .15s; }
.feat-add-btn:hover { border-color: #e85800; color: #e85800; }
.feat-block { background: #0f0e0d; border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.feat-block-hd { display: flex; align-items: center; margin-bottom: 2px; }
.feat-num { font-size: .68rem; font-weight: 700; color: #3a3530; text-transform: uppercase; letter-spacing: .06em; }
.feat-del-btn { margin-left: auto; width: 18px; height: 18px; border-radius: 4px; border: none; background: transparent; color: #3a3530; font-size: .95rem; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: color .15s; }
.feat-del-btn:hover { color: #e85800; }

/* ── Responsive ───────────────────────────── */
@media (max-width: 900px) {
  .hero-preview, .about-preview { grid-template-columns: 1fr; }
  .stats-preview { grid-template-columns: 1fr 1fr; }
}
</style>
