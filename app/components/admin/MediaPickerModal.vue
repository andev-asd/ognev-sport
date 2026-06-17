<!-- app/components/admin/MediaPickerModal.vue -->
<template>
  <Teleport to="body">
    <div v-if="modelValue" class="mp-overlay" @click.self="close">
      <div class="mp-modal">
        <div class="mp-header">
          <div class="mp-tabs">
            <button :class="{ active: tab === 'library' }" @click="tab = 'library'">Медиатека</button>
            <button :class="{ active: tab === 'upload' }" @click="tab = 'upload'">Загрузить</button>
          </div>
          <button class="mp-close" @click="close">✕</button>
        </div>

        <!-- LIBRARY TAB -->
        <div v-if="tab === 'library'" class="mp-body">
          <div v-if="loading" class="mp-empty">Загрузка...</div>
          <div v-else-if="!files.length" class="mp-empty">Файлов нет</div>
          <div v-else class="mp-grid">
            <div
              v-for="f in files"
              :key="f.url"
              class="mp-item"
              :class="{ selected: picked.has(f.url) }"
              @click="toggle(f.url)"
            >
              <img :src="f.url" :alt="f.name" loading="lazy" />
              <div class="mp-check">
                <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
              </div>
            </div>
          </div>
        </div>

        <!-- UPLOAD TAB -->
        <div v-if="tab === 'upload'" class="mp-body">
          <label class="mp-dropzone" :class="{ uploading }">
            <input type="file" accept="image/*" multiple :disabled="uploading" @change="uploadFiles" style="display:none" />
            <div class="mp-dropzone-content">
              <span class="mp-dropzone-icon">↑</span>
              <span>{{ uploading ? 'Загрузка...' : 'Выбрать файлы или перетащить сюда' }}</span>
              <span class="mp-dropzone-hint">JPG, PNG, WebP</span>
            </div>
          </label>
          <div v-if="uploadedUrls.length" class="mp-uploaded">
            <p class="mp-uploaded-label">Загружено ({{ uploadedUrls.length }}):</p>
            <div class="mp-grid">
              <div
                v-for="url in uploadedUrls"
                :key="url"
                class="mp-item selected"
              >
                <img :src="url" loading="lazy" />
                <div class="mp-check">
                  <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                </div>
              </div>
            </div>
          </div>
          <p v-if="uploadError" class="mp-error">{{ uploadError }}</p>
        </div>

        <div class="mp-footer">
          <span class="mp-sel-count" v-if="allPicked.size">Выбрано: {{ allPicked.size }}</span>
          <span v-else class="mp-sel-hint">Нажми на изображение чтобы выбрать</span>
          <div style="display:flex;gap:8px">
            <button class="mp-btn-cancel" @click="close">Отмена</button>
            <button class="mp-btn-select" :disabled="!allPicked.size" @click="confirm">
              Вставить {{ allPicked.size ? `(${allPicked.size})` : '' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: boolean; bucket: string }>()
const emit = defineEmits<{
  'update:modelValue': [v: boolean]
  'select': [urls: string[]]
}>()

type MediaFile = { bucket: string; path: string; name: string; url: string }

const tab = ref<'library' | 'upload'>('library')
const files = ref<MediaFile[]>([])
const loading = ref(false)
const picked = ref(new Set<string>())
const uploadedUrls = ref<string[]>([])
const uploading = ref(false)
const uploadError = ref('')

const allPicked = computed(() => {
  const s = new Set(picked.value)
  uploadedUrls.value.forEach(u => s.add(u))
  return s
})

watch(() => props.modelValue, async (open) => {
  if (!open) return
  tab.value = 'library'
  picked.value = new Set()
  uploadedUrls.value = []
  uploadError.value = ''
  await loadFiles()
})

async function loadFiles() {
  loading.value = true
  try {
    const data = await $fetch<MediaFile[]>('/api/admin/media-files')
    files.value = (data ?? []).map(f => ({
      ...f,
      name: f.path.split('/').pop() ?? f.path,
    }))
  } finally {
    loading.value = false
  }
}

function toggle(url: string) {
  const s = new Set(picked.value)
  if (s.has(url)) s.delete(url)
  else s.add(url)
  picked.value = s
}

async function uploadFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const fileList = input.files
  if (!fileList?.length) return
  uploading.value = true
  uploadError.value = ''
  for (const file of Array.from(fileList)) {
    try {
      const ext = file.name.split('.').pop()
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', props.bucket)
      form.append('path', `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`)
      const res = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body: form })
      uploadedUrls.value.push(res.url)
    } catch (err: any) {
      uploadError.value = err?.data?.message ?? err?.message ?? 'Ошибка загрузки'
    }
  }
  uploading.value = false
  input.value = ''
  // Reload library in background
  loadFiles()
}

function confirm() {
  emit('select', [...allPicked.value])
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.mp-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
}
.mp-modal {
  background: #1c1917; border: 1px solid #2e2821; border-radius: 14px;
  width: 100%; max-width: 860px; max-height: 90vh;
  display: flex; flex-direction: column; overflow: hidden;
}
.mp-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #2e2821; flex-shrink: 0;
}
.mp-tabs { display: flex; gap: 4px; background: #0f0e0d; border-radius: 8px; padding: 3px; }
.mp-tabs button {
  padding: 6px 16px; border-radius: 6px; border: none; background: transparent;
  color: #7a7068; font-size: .85rem; font-family: inherit; cursor: pointer;
  transition: background .15s, color .15s;
}
.mp-tabs button.active { background: #252219; color: #f0ebe3; }
.mp-close {
  width: 28px; height: 28px; border-radius: 50%; border: none;
  background: #252219; color: #7a7068; cursor: pointer; font-size: .8rem;
  display: flex; align-items: center; justify-content: center;
  transition: color .15s;
}
.mp-close:hover { color: #f0ebe3; }

.mp-body { flex: 1; overflow-y: auto; padding: 16px 20px; min-height: 0; }
.mp-empty { color: #7a7068; padding: 40px 0; text-align: center; }

.mp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 8px;
}
.mp-item {
  position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden;
  cursor: pointer; border: 2px solid transparent;
  background: #0f0e0d; transition: border-color .15s;
}
.mp-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity .15s; }
.mp-item.selected { border-color: #e85800; }
.mp-item.selected img { opacity: .8; }
.mp-check {
  position: absolute; top: 6px; left: 6px;
  width: 20px; height: 20px; border-radius: 6px;
  background: rgba(0,0,0,.4); border: 2px solid rgba(255,255,255,.4);
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, border-color .15s;
}
.mp-item.selected .mp-check { background: #e85800; border-color: #e85800; color: #fff; }
.mp-item:not(.selected) .mp-check svg { display: none; }

.mp-dropzone {
  display: flex; align-items: center; justify-content: center;
  border: 2px dashed #2e2821; border-radius: 12px;
  min-height: 200px; cursor: pointer;
  transition: border-color .15s, background .15s;
}
.mp-dropzone:hover, .mp-dropzone.uploading { border-color: #e85800; background: rgba(232,88,0,.04); }
.mp-dropzone-content { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #7a7068; }
.mp-dropzone-icon { font-size: 2rem; color: #e85800; }
.mp-dropzone-hint { font-size: .75rem; color: #4a4038; }

.mp-uploaded { margin-top: 16px; }
.mp-uploaded-label { color: #7a7068; font-size: .8rem; margin-bottom: 10px; }
.mp-error { color: #e85800; font-size: .8rem; margin-top: 8px; }

.mp-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; border-top: 1px solid #2e2821; flex-shrink: 0;
}
.mp-sel-count { color: #e85800; font-size: .85rem; font-weight: 600; }
.mp-sel-hint { color: #4a4038; font-size: .8rem; }
.mp-btn-cancel {
  padding: 8px 18px; border-radius: 8px; border: 1px solid #2e2821;
  background: transparent; color: #7a7068; font-size: .88rem; font-family: inherit;
  cursor: pointer; transition: color .15s, border-color .15s;
}
.mp-btn-cancel:hover { color: #f0ebe3; border-color: #7a7068; }
.mp-btn-select {
  padding: 8px 20px; border-radius: 8px; border: none;
  background: #e85800; color: #fff; font-size: .88rem; font-family: inherit;
  font-weight: 600; cursor: pointer; transition: background .15s;
}
.mp-btn-select:hover:not(:disabled) { background: #d14d00; }
.mp-btn-select:disabled { opacity: .4; cursor: not-allowed; }
</style>
