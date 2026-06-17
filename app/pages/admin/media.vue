<!-- app/pages/admin/media.vue -->
<template>
  <div>
    <div class="admin-page-header">
      <h1>Медиа-библиотека</h1>
      <div style="display:flex;align-items:center;gap:10px">
        <span v-if="selected.size" class="sel-count">Выбрано: {{ selected.size }}</span>
        <button v-if="selected.size" class="btn-del" :disabled="deleting" @click="deleteSelected">
          {{ deleting ? 'Удаление...' : `Удалить (${selected.size})` }}
        </button>
        <div class="filter-tabs">
          <button class="filter-tab" :class="{ active: filter === 'all' }"    @click="filter = 'all'">Все <span class="fc">{{ files.length }}</span></button>
          <button class="filter-tab" :class="{ active: filter === 'unused' }" @click="filter = 'unused'">Неиспользуемые <span class="fc unused-fc">{{ unusedFiles.length }}</span></button>
        </div>
      </div>
    </div>

    <div v-if="loading" style="color:#7a7068;padding:32px 0">Загрузка...</div>
    <div v-else-if="!visibleFiles.length" style="color:#7a7068;padding:32px 0">
      {{ filter === 'unused' ? 'Неиспользуемых файлов нет.' : 'Файлов нет.' }}
    </div>

    <div v-else class="media-grid">
      <div
        v-for="f in visibleFiles"
        :key="`${f.bucket}/${f.path}`"
        class="media-item"
        :class="{ selected: selected.has(`${f.bucket}/${f.path}`), unused: !f.used }"
        @click="toggleSelect(`${f.bucket}/${f.path}`)"
      >
        <img :src="f.url" :alt="f.name" loading="lazy" />
        <div class="media-overlay">
          <div class="media-check"><svg width="12" height="10" viewBox="0 0 12 10"><path d="M1 5l3.5 3.5L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg></div>
        </div>
        <div class="media-badge" :class="f.used ? 'badge-used' : 'badge-unused'">
          {{ f.used ? 'Используется' : 'Не используется' }}
        </div>
        <div class="media-name">{{ f.name }}</div>
      </div>
    </div>

    <p v-if="deleteError" style="color:#e85800;margin-top:12px;font-size:.88rem">{{ deleteError }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const supabase = useSupabaseClient()

type MediaFile = { bucket: string; path: string; name: string; url: string; used: boolean }

const loading = ref(true)
const files = ref<MediaFile[]>([])
const selected = ref(new Set<string>())
const filter = ref<'all' | 'unused'>('all')
const deleting = ref(false)
const deleteError = ref('')

const unusedFiles = computed(() => files.value.filter(f => !f.used))
const visibleFiles = computed(() =>
  filter.value === 'unused' ? unusedFiles.value : files.value
)

onMounted(async () => {
  const [fileList, usedData] = await Promise.all([
    $fetch<{ bucket: string; path: string; url: string }[]>('/api/admin/media-files'),
    $fetch<{ used: string[] }>('/api/admin/media'),
  ])

  const usedSet = new Set(usedData?.used ?? [])

  files.value = (fileList ?? []).map(f => ({
    bucket: f.bucket,
    path: f.path,
    name: f.path.split('/').pop() ?? f.path,
    url: f.url,
    used: usedSet.has(f.url),
  }))

  loading.value = false
})

const toggleSelect = (key: string) => {
  const s = new Set(selected.value)
  if (s.has(key)) s.delete(key)
  else s.add(key)
  selected.value = s
}

const deleteSelected = async () => {
  if (!selected.value.size) return
  deleteError.value = ''
  deleting.value = true
  try {
    // Group by bucket
    const byBucket: Record<string, string[]> = {}
    for (const key of selected.value) {
      const slash = key.indexOf('/')
      const bucket = key.slice(0, slash)
      const path = key.slice(slash + 1)
      if (!byBucket[bucket]) byBucket[bucket] = []
      byBucket[bucket].push(path)
    }
    for (const [bucket, paths] of Object.entries(byBucket)) {
      const { error } = await supabase.storage.from(bucket).remove(paths)
      if (error) throw error
    }
    files.value = files.value.filter(f => !selected.value.has(`${f.bucket}/${f.path}`))
    selected.value = new Set()
  } catch (e: any) {
    deleteError.value = `Ошибка: ${e?.message ?? 'неизвестная ошибка'}`
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.admin-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.admin-page-header h1 { font-size: 1.4rem; font-weight: 700; color: #f0ebe3; margin: 0; }

.filter-tabs { display: flex; gap: 4px; background: #1c1917; border: 1px solid #2e2821; border-radius: 10px; padding: 4px; }
.filter-tab { padding: 5px 12px; border-radius: 7px; border: none; background: transparent; color: #7a7068; font-size: .8rem; font-family: inherit; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background .15s, color .15s; white-space: nowrap; }
.filter-tab:hover { color: #f0ebe3; }
.filter-tab.active { background: #252219; color: #f0ebe3; }
.fc { background: #2e2821; color: #a09080; border-radius: 100px; padding: 0 5px; font-size: .65rem; font-weight: 700; min-width: 16px; text-align: center; }
.unused-fc { background: rgba(232,88,0,.15); color: #e85800; }

.sel-count { color: #a09080; font-size: .85rem; }

.btn-del { padding: 7px 16px; border-radius: 8px; border: none; background: #7f1d1d; color: #fca5a5; font-size: .85rem; font-family: inherit; cursor: pointer; transition: background .15s; }
.btn-del:hover:not(:disabled) { background: #991b1b; }
.btn-del:disabled { opacity: .5; cursor: not-allowed; }

/* Grid */
.media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }

.media-item {
  position: relative; border-radius: 10px; overflow: hidden;
  cursor: pointer; border: 2px solid #2e2821;
  aspect-ratio: 1; background: #1c1917;
  transition: border-color .15s, opacity .15s;
}
.media-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity .2s; }
.media-item.unused { opacity: .7; }
.media-item.unused:hover { opacity: 1; }
.media-item.selected { border-color: #e85800; }
.media-item.selected img { opacity: .75; }

/* Overlay checkbox */
.media-overlay {
  position: absolute; top: 7px; left: 7px;
  width: 20px; height: 20px; border-radius: 6px;
  border: 2px solid rgba(255,255,255,.5); background: rgba(0,0,0,.3);
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, border-color .15s;
}
.media-item.selected .media-overlay { background: #e85800; border-color: #e85800; color: #fff; }
.media-item:not(.selected) .media-check { display: none; }

/* Usage badge */
.media-badge {
  position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
  padding: 2px 7px; border-radius: 100px; font-size: .6rem; font-weight: 700;
  white-space: nowrap; pointer-events: none;
  opacity: 0; transition: opacity .15s;
}
.media-item:hover .media-badge { opacity: 1; }
.badge-used   { background: rgba(34,197,94,.2); color: #22c55e; border: 1px solid rgba(34,197,94,.3); }
.badge-unused { background: rgba(232,88,0,.2); color: #e85800; border: 1px solid rgba(232,88,0,.3); }

/* Filename */
.media-name {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(0,0,0,.7); color: #a09080; font-size: .6rem;
  padding: 4px 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
</style>
