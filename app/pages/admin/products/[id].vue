<!-- app/pages/admin/products/[id].vue -->
<template>
  <div>
    <div class="admin-page-header">
      <NuxtLink to="/admin/products" class="btn-s" style="padding:7px 14px;font-size:.85rem">← Назад</NuxtLink>
      <h1>Редактор товара</h1>
      <button class="btn-ai" @click="showAiModal = true">✦ AI: заполнить текст</button>
      <button class="btn-danger" @click="deleteProduct">Удалить товар</button>
      <button class="btn-p" :disabled="saving" @click="save">{{ saving ? 'Сохраняется...' : 'Сохранить' }}</button>
    </div>

    <!-- AI Generate Modal -->
    <Teleport to="body">
      <div v-if="showAiModal" class="ai-modal-backdrop" @click.self="showAiModal = false">
        <div class="ai-modal">
          <div class="ai-modal-header">
            <span>✦ Сгенерировать контент через AI</span>
            <button class="ai-modal-close" @click="showAiModal = false">✕</button>
          </div>
          <p class="ai-modal-hint">Опишите товар как можете — вразброс, с ошибками. AI поймёт и создаст название, описания и характеристики сразу на UA / RU / EN.</p>
          <textarea
            v-model="aiRawText"
            class="ai-modal-textarea"
            placeholder="Например: кросовер блоковая рама 2 стека по 115кг ролики на подшипниках нержавеющие направляющие порошковое покрытие варианты рукояток есть турник цена 52тис"
            rows="8"
            :disabled="aiGenerating"
          />
          <div v-if="aiError" class="ai-modal-error">{{ aiError }}</div>
          <div class="ai-modal-footer">
            <button class="btn-s" style="padding:9px 18px;font-size:.88rem" @click="showAiModal = false">Отмена</button>
            <button class="btn-p" style="padding:9px 20px;font-size:.88rem" :disabled="aiGenerating || !aiRawText.trim()" @click="generateAi">
              {{ aiGenerating ? 'Генерирую...' : '✦ Сгенерировать' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="loading" class="admin-loading">Загрузка...</div>

    <div v-else class="admin-form-grid">
      <!-- Основные данные -->
      <div class="admin-card">
        <h3>Основное</h3>
        <div class="afld">
          <label>Slug (URL)</label>
          <input v-model="form.slug" placeholder="my-product" />
        </div>
        <div class="afld">
          <label>Цена (грн)</label>
          <input v-model.number="form.price" type="number" min="0" />
        </div>
        <div class="afld">
          <label>
            <input type="checkbox" v-model="form.fromPrice" style="margin-right:6px" />
            Показывать «от X»
          </label>
        </div>
        <div class="afld">
          <label>
            <input type="checkbox" v-model="form.visible" style="margin-right:6px" />
            Видимый на сайте
          </label>
        </div>
      </div>

      <!-- Изображения -->
      <div class="admin-card">
        <h3>Изображения</h3>
        <ImageUploader v-model="form.images" bucket="products" />
      </div>

      <!-- Тексты по языкам -->
      <div class="admin-card admin-card-full">
        <h3>Контент по языкам</h3>
        <LangTabs v-model="activeLang">
          <template v-for="l in (['ua', 'ru', 'en'] as const)" :key="l">
            <div v-show="activeLang === l">
              <div class="afld">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                  <label style="margin:0">Название</label>
                  <AiTrigger field="name" field-label="Название" :value="form.content[l].name" @done="(r) => applyAi('name', r)" />
                </div>
                <RichTextInput v-model="form.content[l].name" placeholder="Название товара" ce-class="admin-ce" single-line />
              </div>
              <div class="afld">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                  <label style="margin:0">Краткое описание</label>
                  <AiTrigger field="shortDesc" field-label="Краткое описание" :value="form.content[l].shortDesc" @done="(r) => applyAi('shortDesc', r)" />
                </div>
                <RichTextInput v-model="form.content[l].shortDesc" placeholder="Одна строка для карточки" ce-class="admin-ce" single-line />
              </div>
              <div class="afld">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                  <label style="margin:0">Полное описание</label>
                  <AiTrigger field="description" field-label="Полное описание" :value="form.content[l].description" @done="(r) => applyAi('description', r)" />
                </div>
                <RichTextInput v-model="form.content[l].description" placeholder="Подробное описание..." ce-class="admin-ce" />
              </div>
              <div class="afld">
                <label>Характеристики (по одной на строке)</label>
                <textarea
                  :value="form.content[l].features.join('\n')"
                  rows="5"
                  placeholder="Характеристика 1&#10;Характеристика 2"
                  @input="form.content[l].features = ($event.target as HTMLTextAreaElement).value.split('\n').filter(Boolean)"
                ></textarea>
              </div>
            </div>
          </template>
        </LangTabs>
      </div>
    </div>

    <p v-if="saveError" style="color:#e85800;margin-top:12px;font-size:.88rem">{{ saveError }}</p>
  </div>

  <ConfirmModal
    v-model="confirmOpen"
    :title="`Удалить товар «${form.content.ua.name || form.slug}»?`"
    message="Это действие необратимо."
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const route = useRoute()
const supabase = useSupabaseClient()
const saving = ref(false)
const loading = ref(true)
const saveError = ref('')
const activeLang = ref<'ua' | 'ru' | 'en'>('ua')

type LangContent = { name: string; shortDesc: string; description: string; features: string[] }

const form = reactive({
  slug: '',
  price: 0,
  fromPrice: false,
  visible: true,
  images: [] as string[],
  content: {
    ua: { name: '', shortDesc: '', description: '', features: [] as string[] } as LangContent,
    ru: { name: '', shortDesc: '', description: '', features: [] as string[] } as LangContent,
    en: { name: '', shortDesc: '', description: '', features: [] as string[] } as LangContent,
  },
})

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

// AI generate all content from raw text
const showAiModal = ref(false)
const aiRawText = ref('')
const aiGenerating = ref(false)
const aiError = ref('')

const generateAi = async () => {
  if (!aiRawText.value.trim()) return
  aiGenerating.value = true
  aiError.value = ''
  try {
    const result = await $fetch<{
      slug?: string
      price?: number
      ua: { name: string; shortDesc: string; description: string; features: string[] }
      ru: { name: string; shortDesc: string; description: string; features: string[] }
      en: { name: string; shortDesc: string; description: string; features: string[] }
    }>('/api/ai/generate-product', { method: 'POST', body: { text: aiRawText.value } })

    if (result.slug) form.slug = result.slug
    if (result.price) form.price = result.price

    for (const lang of ['ua', 'ru', 'en'] as const) {
      if (result[lang]) {
        form.content[lang].name = result[lang].name ?? ''
        form.content[lang].shortDesc = result[lang].shortDesc ?? ''
        form.content[lang].description = result[lang].description ?? ''
        form.content[lang].features = result[lang].features ?? []
      }
    }
    showAiModal.value = false
    aiRawText.value = ''
  } catch (e: any) {
    aiError.value = e?.data?.message ?? e?.message ?? 'Ошибка генерации'
  } finally {
    aiGenerating.value = false
  }
}

// AI pipeline fills all three languages at once for the given field
const applyAi = (
  field: 'name' | 'shortDesc' | 'description',
  r: { ua: string; ru: string; en: string },
) => {
  form.content.ua[field] = r.ua
  form.content.ru[field] = r.ru
  form.content.en[field] = r.en
}

onMounted(async () => {
  const p = await $fetch(`/api/admin/products/${route.params.id}`, {
    headers: await getAuthHeaders(),
  }) as any
  form.slug = p.slug
  form.price = p.price
  form.fromPrice = p.fromPrice
  form.visible = p.visible
  form.images = [...p.images]
  for (const c of (p.content ?? [])) {
    if (c.lang in form.content) {
      form.content[c.lang as 'ua' | 'ru' | 'en'] = {
        name: c.name,
        shortDesc: c.shortDesc,
        description: c.description,
        features: [...c.features],
      }
    }
  }
  loading.value = false
})

const confirmOpen = ref(false)

const deleteProduct = () => { confirmOpen.value = true }

const confirmDelete = async () => {
  confirmOpen.value = false
  await $fetch(`/api/admin/products/${route.params.id}`, { method: 'DELETE' })
  await navigateTo('/admin/products')
}

const save = async () => {
  saving.value = true
  saveError.value = ''
  try {
    await $fetch(`/api/admin/products/${route.params.id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: {
        slug: form.slug,
        price: form.price,
        fromPrice: form.fromPrice,
        visible: form.visible,
        images: form.images,
        content: (['ua', 'ru', 'en'] as const).map(lang => ({
          lang,
          ...form.content[lang],
        })),
      },
    })
  } catch {
    saveError.value = 'Ошибка сохранения. Попробуйте ещё раз.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.admin-page-header h1 { font-size: 1.4rem; font-weight: 700; color: #f0ebe3; margin: 0; flex: 1; }
.admin-loading { color: #7a7068; padding: 24px 0; }
.admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.admin-card { background: #1c1917; border: 1px solid #2e2821; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.admin-card h3 { font-size: .88rem; font-weight: 700; color: #7a7068; text-transform: uppercase; letter-spacing: .06em; margin: 0; }
.admin-card-full { grid-column: 1 / -1; }
.afld { display: flex; flex-direction: column; gap: 6px; }
.afld label { font-size: .8rem; font-weight: 600; color: #f0ebe3; }
.afld input, .afld textarea { background: #0f0e0d; border: 1px solid #3a3530; border-radius: 8px; padding: 10px 13px; color: #f0ebe3; font-family: inherit; font-size: .88rem; outline: none; transition: border-color .15s; }
.afld input:focus, .afld textarea:focus { border-color: #e85800; }
.afld textarea { resize: vertical; }

.btn-danger { padding: 8px 16px; border-radius: 8px; background: none; border: 1px solid #7f1d1d; color: #fca5a5; font-size: .85rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: background .15s; white-space: nowrap; }
.btn-danger:hover { background: rgba(127,29,29,.4); }
.btn-ai { padding: 8px 16px; border-radius: 8px; background: rgba(232,88,0,.12); border: 1px solid rgba(232,88,0,.35); color: #e85800; font-size: .85rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: background .15s, border-color .15s; white-space: nowrap; }
.btn-ai:hover { background: rgba(232,88,0,.2); border-color: rgba(232,88,0,.6); }

.ai-modal-backdrop { position: fixed; inset: 0; z-index: 900; background: rgba(0,0,0,.72); display: flex; align-items: center; justify-content: center; padding: 20px; }
.ai-modal { background: #1c1917; border: 1px solid #3a3530; border-radius: 16px; width: 100%; max-width: 580px; display: flex; flex-direction: column; gap: 16px; padding: 24px; box-shadow: 0 24px 64px rgba(0,0,0,.6); }
.ai-modal-header { display: flex; align-items: center; justify-content: space-between; }
.ai-modal-header span { font-size: 1rem; font-weight: 700; color: #e85800; }
.ai-modal-close { background: none; border: none; color: #7a7068; font-size: 1rem; cursor: pointer; padding: 2px 6px; border-radius: 4px; transition: color .15s; }
.ai-modal-close:hover { color: #f0ebe3; }
.ai-modal-hint { font-size: .82rem; color: #7a7068; line-height: 1.55; margin: 0; }
.ai-modal-textarea { background: #0f0e0d; border: 1px solid #3a3530; border-radius: 10px; padding: 12px 14px; color: #f0ebe3; font-family: inherit; font-size: .88rem; outline: none; resize: vertical; transition: border-color .15s; line-height: 1.6; }
.ai-modal-textarea:focus { border-color: #e85800; }
.ai-modal-textarea:disabled { opacity: .5; }
.ai-modal-error { font-size: .82rem; color: #e85800; }
.ai-modal-footer { display: flex; justify-content: flex-end; gap: 8px; }
</style>
