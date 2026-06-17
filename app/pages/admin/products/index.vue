<!-- app/pages/admin/products/index.vue -->
<template>
  <div>
    <div class="admin-page-header">
      <h1>Товары</h1>
      <button class="btn-p" @click="createProduct" :disabled="creating">
        {{ creating ? '...' : '+ Добавить' }}
      </button>
    </div>

    <div v-if="pending" class="admin-loading">Загрузка...</div>

    <draggable
      v-else
      v-model="productsList"
      item-key="id"
      handle=".drag-handle"
      @end="saveOrder"
      class="admin-list"
    >
      <template #item="{ element: p }">
        <div class="admin-list-row">
          <span class="drag-handle" title="Перетащить">⠿</span>
          <img :src="p.images[0] || ''" class="admin-thumb" alt="" />
          <span class="admin-row-name">{{ p.content.find((c: any) => c.lang === 'ua')?.name || p.slug }}</span>
          <span class="admin-row-price">{{ p.price.toLocaleString() }} грн</span>
          <label class="admin-toggle-label">
            <input
              type="checkbox"
              :checked="p.visible"
              @change="toggleVisible(p)"
            />
            {{ p.visible ? 'Видимый' : 'Скрытый' }}
          </label>
          <NuxtLink :to="`/admin/products/${p.id}`" class="btn-s admin-edit-btn">Редактировать</NuxtLink>
          <button class="btn-del-row" title="Удалить" @click="deleteProduct(p)">✕</button>
        </div>
      </template>
    </draggable>
  </div>

  <ConfirmModal
    v-model="confirmOpen"
    :title="`Удалить товар «${confirmName}»?`"
    message="Это действие необратимо."
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
definePageMeta({ middleware: 'admin', layout: 'admin' })

const supabase = useSupabaseClient()
const creating = ref(false)

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

const { data: rawProducts, pending, refresh } = await useFetch('/api/admin/products', {
  headers: await getAuthHeaders(),
})

const productsList = computed({
  get: () => (rawProducts.value as any[]) ?? [],
  set: (val) => { (rawProducts.value as any) = val },
})

const toggleVisible = async (p: any) => {
  await $fetch(`/api/admin/products/${p.id}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: { visible: !p.visible },
  })
  refresh()
}

const saveOrder = async () => {
  const items = productsList.value
  await Promise.all(
    items.map((p: any, i: number) =>
      $fetch(`/api/admin/products/${p.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: { order: i },
      })
    )
  )
}

const confirmOpen = ref(false)
const confirmName = ref('')
let confirmTargetId = ''

const deleteProduct = (p: any) => {
  confirmTargetId = p.id
  confirmName.value = p.content.find((c: any) => c.lang === 'ua')?.name || p.slug
  confirmOpen.value = true
}

const confirmDelete = async () => {
  confirmOpen.value = false
  await $fetch(`/api/admin/products/${confirmTargetId}`, { method: 'DELETE', headers: await getAuthHeaders() })
  refresh()
}

const createProduct = async () => {
  creating.value = true
  try {
    const p = await $fetch('/api/admin/products', {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: { slug: `new-product-${Date.now()}`, price: 0, images: [], content: [] },
    }) as any
    await navigateTo(`/admin/products/${p.id}`)
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.admin-page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.admin-page-header h1 { font-size: 1.4rem; font-weight: 700; color: #f0ebe3; margin: 0; }
.admin-loading { color: #7a7068; padding: 24px 0; }
.admin-list { display: flex; flex-direction: column; gap: 8px; }
.admin-list-row { display: flex; align-items: center; gap: 12px; background: #1c1917; border: 1px solid #2e2821; border-radius: 10px; padding: 12px 16px; }
.drag-handle { cursor: grab; color: #7a7068; font-size: 1.2rem; flex-shrink: 0; user-select: none; }
.admin-thumb { width: 48px; height: 48px; border-radius: 6px; object-fit: cover; background: #252219; flex-shrink: 0; }
.admin-row-name { flex: 1; font-size: .88rem; font-weight: 500; color: #f0ebe3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.admin-row-price { font-size: .85rem; color: #e85800; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
.admin-toggle-label { display: flex; align-items: center; gap: 6px; font-size: .78rem; color: #7a7068; cursor: pointer; flex-shrink: 0; white-space: nowrap; }
.admin-edit-btn { padding: 6px 14px; font-size: .8rem; flex-shrink: 0; }
.btn-del-row { width: 30px; height: 30px; border-radius: 6px; background: none; border: 1px solid #3a3530; color: #7a7068; font-size: .8rem; cursor: pointer; flex-shrink: 0; transition: background .15s, color .15s, border-color .15s; display: flex; align-items: center; justify-content: center; }
.btn-del-row:hover { background: rgba(127,29,29,.4); border-color: #7f1d1d; color: #fca5a5; }
</style>
