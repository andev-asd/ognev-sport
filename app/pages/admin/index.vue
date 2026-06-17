<!-- app/pages/admin/index.vue -->
<template>
  <div>
    <div class="admin-page-header">
      <h1>Заявки</h1>
      <div class="filter-tabs">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-tab"
          :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
          <span v-if="counts[f.value]" class="filter-count">{{ counts[f.value] }}</span>
        </button>
      </div>
    </div>

    <div v-if="pending" style="color:#7a7068">Загрузка...</div>
    <div v-else-if="!filtered.length" style="color:#7a7068;padding:24px 0">
      {{ activeFilter === 'all' ? 'Заявок пока нет.' : 'Нет заявок с таким статусом.' }}
    </div>

    <div v-else class="requests-list">
      <div
        v-for="r in filtered"
        :key="r.id"
        class="request-card"
        :class="`status-${r.status}`"
      >
        <!-- Header row -->
        <div class="req-header">
          <div class="req-identity">
            <span class="req-name">{{ r.name }}</span>
            <a :href="`tel:${r.phone.replace(/\s/g,'')}`" class="req-phone">{{ r.phone }}</a>
            <span class="req-badge">{{ methodLabel(r.method) }}</span>
            <span class="req-badge lang-badge">{{ r.lang.toUpperCase() }}</span>
          </div>
          <div class="req-meta">
            <span class="req-date">{{ formatDate(r.createdAt) }}</span>
            <div class="status-select-wrap">
              <select
                :value="r.status"
                class="status-select"
                :class="`sel-${r.status}`"
                @change="setStatus(r.id, ($event.target as HTMLSelectElement).value)"
              >
                <option value="new">🆕 Нова</option>
                <option value="in_progress">⚙️ В роботі</option>
                <option value="done">✅ Виконано</option>
                <option value="rejected">❌ Відхилено</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Message -->
        <div v-if="r.message" class="req-message">{{ r.message }}</div>

        <!-- Note -->
        <div class="req-note-wrap">
          <textarea
            :value="r.note"
            class="req-note"
            rows="1"
            placeholder="Нотатка (видно тільки адмінам)…"
            @change="setNote(r.id, ($event.target as HTMLTextAreaElement).value)"
            @input="autoResize($event.target as HTMLTextAreaElement)"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
const supabase = useSupabaseClient()

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

const { data: raw, pending, refresh } = await useFetch('/api/admin/requests', {
  headers: await getAuthHeaders(),
})

type Request = {
  id: string; name: string; phone: string; method: string
  message: string; lang: string; createdAt: string
  read: boolean; status: string; note: string
}

const requests = computed<Request[]>(() => (raw.value as any[]) ?? [])

const filters = [
  { value: 'all',         label: 'Всі' },
  { value: 'new',         label: 'Нові' },
  { value: 'in_progress', label: 'В роботі' },
  { value: 'done',        label: 'Виконано' },
  { value: 'rejected',    label: 'Відхилено' },
]
const activeFilter = ref('all')

const filtered = computed(() =>
  activeFilter.value === 'all'
    ? requests.value
    : requests.value.filter(r => r.status === activeFilter.value)
)

const counts = computed(() => {
  const c: Record<string, number> = {}
  for (const r of requests.value) c[r.status] = (c[r.status] ?? 0) + 1
  return c
})

const methodLabel = (m: string) =>
  ({ call: 'Дзвінок', telegram: 'Telegram', viber: 'Viber' })[m] ?? m

const formatDate = (d: string) =>
  new Date(d).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })

const autoResize = (el: HTMLTextAreaElement) => {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

const setStatus = async (id: string, status: string) => {
  await $fetch(`/api/admin/requests/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: { status, read: true },
  })
  refresh()
}

const setNote = async (id: string, note: string) => {
  await $fetch(`/api/admin/requests/${id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: { note },
  })
}
</script>

<style scoped>
.admin-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.admin-page-header h1 { font-size: 1.4rem; font-weight: 700; color: #f0ebe3; margin: 0; }

/* Filter tabs */
.filter-tabs { display: flex; gap: 4px; background: #1c1917; border: 1px solid #2e2821; border-radius: 10px; padding: 4px; }
.filter-tab { padding: 5px 12px; border-radius: 7px; border: none; background: transparent; color: #7a7068; font-size: .8rem; font-family: inherit; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background .15s, color .15s; white-space: nowrap; }
.filter-tab:hover { color: #f0ebe3; }
.filter-tab.active { background: #252219; color: #f0ebe3; }
.filter-count { background: #e85800; color: #fff; border-radius: 100px; padding: 0 5px; font-size: .65rem; font-weight: 700; min-width: 16px; text-align: center; }

/* Cards */
.requests-list { display: flex; flex-direction: column; gap: 10px; }
.request-card { background: #1c1917; border: 1px solid #2e2821; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; transition: border-color .2s; }
.request-card.status-new         { border-left: 3px solid #e85800; }
.request-card.status-in_progress { border-left: 3px solid #3b82f6; }
.request-card.status-done        { border-left: 3px solid #22c55e; }
.request-card.status-rejected    { border-left: 3px solid #3a3530; opacity: .7; }

/* Header */
.req-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.req-identity { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.req-name  { font-weight: 600; color: #f0ebe3; font-size: .92rem; }
.req-phone { color: #e85800; font-size: .88rem; font-weight: 500; text-decoration: none; }
.req-phone:hover { text-decoration: underline; }
.req-badge { background: #0f0e0d; border: 1px solid #2e2821; border-radius: 100px; padding: 2px 8px; font-size: .7rem; font-weight: 600; color: #7a7068; text-transform: uppercase; }
.lang-badge { color: #a09080; }

.req-meta { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.req-date { font-size: .75rem; color: #7a7068; white-space: nowrap; }

/* Status select */
.status-select-wrap { position: relative; }
.status-select { appearance: none; padding: 4px 24px 4px 10px; border-radius: 7px; border: 1px solid #3a3530; background: #0f0e0d; color: #a09080; font-size: .78rem; font-family: inherit; cursor: pointer; outline: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%237a7068'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; }
.status-select:focus { border-color: #e85800; }
.sel-new         { border-color: rgba(232,88,0,.4);  color: #e85800; }
.sel-in_progress { border-color: rgba(59,130,246,.4); color: #3b82f6; }
.sel-done        { border-color: rgba(34,197,94,.4);  color: #22c55e; }
.sel-rejected    { border-color: #2e2821; color: #7a7068; }

/* Message & note */
.req-message { font-size: .88rem; color: #a09080; line-height: 1.55; background: #0f0e0d; border-radius: 8px; padding: 10px 12px; }
.req-note-wrap { }
.req-note { width: 100%; background: transparent; border: none; border-top: 1px dashed #2e2821; color: #7a7068; font-size: .82rem; font-family: inherit; resize: none; outline: none; padding: 8px 0 0; line-height: 1.5; min-height: 28px; box-sizing: border-box; transition: color .15s; }
.req-note:focus { color: #f0ebe3; border-top-color: #3a3530; }
.req-note::placeholder { color: #3a3530; }
</style>
