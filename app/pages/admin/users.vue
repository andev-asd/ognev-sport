<!-- app/pages/admin/users.vue -->
<template>
  <div>
    <h1 style="font-size:1.4rem;font-weight:700;color:#f0ebe3;margin-bottom:24px">Администраторы</h1>

    <!-- Список -->
    <div class="admin-card" style="margin-bottom:16px">
      <h3>Текущие администраторы</h3>
      <div v-if="!users?.length" style="color:#7a7068;font-size:.88rem">Нет администраторов.</div>
      <div v-else class="users-list">
        <div v-for="u in users" :key="(u as any).id" class="user-block">
          <div class="user-row">
            <span class="user-email">{{ (u as any).email }}</span>
            <span class="user-date">{{ new Date((u as any).createdAt).toLocaleDateString('uk-UA') }}</span>
            <button class="btn-s user-action-btn" @click="togglePwForm((u as any).id)">
              {{ pwForm.id === (u as any).id ? 'Отмена' : 'Сменить пароль' }}
            </button>
            <button class="btn-s user-delete-btn" @click="deleteUser((u as any).id)">Удалить</button>
          </div>

          <!-- Форма смены пароля -->
          <div v-if="pwForm.id === (u as any).id" class="pw-form">
            <input
              v-model="pwForm.password"
              type="password"
              placeholder="Новый пароль (мин. 8 символов)"
              @keydown.enter="changePassword"
            />
            <button class="btn-p" :disabled="pwForm.loading || pwForm.password.length < 8" @click="changePassword">
              {{ pwForm.loading ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <span v-if="pwForm.error" style="color:#e85800;font-size:.82rem">{{ pwForm.error }}</span>
            <span v-if="pwForm.ok" style="color:#4caf50;font-size:.82rem">Пароль изменён</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Добавить -->
    <div class="admin-card">
      <h3>Добавить администратора</h3>
      <div class="afld">
        <label>Email</label>
        <input v-model="newEmail" type="email" placeholder="admin@example.com" @keydown.enter="addUser" />
      </div>
      <button class="btn-p" :disabled="adding || !newEmail" @click="addUser" style="align-self:flex-start">
        {{ adding ? 'Создаём...' : 'Создать аккаунт' }}
      </button>
      <p v-if="addError" style="color:#e85800;font-size:.85rem;margin:0">{{ addError }}</p>

      <div v-if="generatedPassword" class="password-reveal">
        <p>✅ Аккаунт создан. Скопируйте пароль — он больше не будет показан:</p>
        <div class="password-box">
          <code>{{ generatedPassword }}</code>
          <button class="btn-s" style="padding:4px 12px;font-size:.8rem" @click="generatedPassword = ''">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })
const supabase = useSupabaseClient()
const newEmail = ref('')
const adding = ref(false)
const addError = ref('')
const generatedPassword = ref('')

const pwForm = reactive({ id: '', password: '', loading: false, error: '', ok: false })

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session?.access_token}` }
}

const { data: users, refresh } = await useFetch('/api/admin/users', {
  headers: await getAuthHeaders(),
})

const togglePwForm = (id: string) => {
  if (pwForm.id === id) {
    pwForm.id = ''
  } else {
    pwForm.id = id
    pwForm.password = ''
    pwForm.error = ''
    pwForm.ok = false
  }
}

const changePassword = async () => {
  if (pwForm.password.length < 8) return
  pwForm.loading = true
  pwForm.error = ''
  pwForm.ok = false
  try {
    await $fetch(`/api/admin/users/${pwForm.id}`, {
      method: 'PATCH',
      headers: await getAuthHeaders(),
      body: { password: pwForm.password },
    })
    pwForm.ok = true
    pwForm.password = ''
    setTimeout(() => { pwForm.id = ''; pwForm.ok = false }, 2000)
  } catch (err: any) {
    pwForm.error = err?.data?.message ?? 'Ошибка смены пароля'
  } finally {
    pwForm.loading = false
  }
}

const addUser = async () => {
  if (!newEmail.value) return
  adding.value = true
  addError.value = ''
  generatedPassword.value = ''
  try {
    const result = await $fetch('/api/admin/users', {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: { email: newEmail.value },
    }) as any
    generatedPassword.value = result.password
    newEmail.value = ''
    refresh()
  } catch (err: any) {
    addError.value = err?.data?.message ?? 'Ошибка создания пользователя'
  } finally {
    adding.value = false
  }
}

const deleteUser = async (id: string) => {
  if (!confirm('Удалить этого администратора?')) return
  try {
    await $fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    })
    refresh()
  } catch {
    alert('Ошибка удаления')
  }
}
</script>

<style scoped>
.admin-card { background: #1c1917; border: 1px solid #2e2821; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.admin-card h3 { font-size: .85rem; font-weight: 700; color: #7a7068; text-transform: uppercase; letter-spacing: .06em; margin: 0; }
.users-list { display: flex; flex-direction: column; gap: 8px; }
.user-block { background: #0f0e0d; border-radius: 8px; overflow: hidden; }
.user-row { display: flex; align-items: center; gap: 12px; padding: 10px 12px; }
.user-email { flex: 1; font-size: .88rem; color: #f0ebe3; }
.user-date { font-size: .78rem; color: #7a7068; white-space: nowrap; }
.user-action-btn { padding: 4px 12px; font-size: .75rem; }
.user-delete-btn { padding: 4px 12px; font-size: .75rem; color: #e85800; border-color: rgba(232,88,0,.3); }
.pw-form { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-top: 1px solid #2e2821; flex-wrap: wrap; }
.pw-form input { flex: 1; min-width: 200px; background: #1c1917; border: 1px solid #3a3530; border-radius: 8px; padding: 8px 12px; color: #f0ebe3; font-family: inherit; font-size: .85rem; outline: none; }
.pw-form input:focus { border-color: #e85800; }
.afld { display: flex; flex-direction: column; gap: 6px; }
.afld label { font-size: .8rem; font-weight: 600; color: #f0ebe3; }
.afld input { background: #0f0e0d; border: 1px solid #3a3530; border-radius: 8px; padding: 10px 13px; color: #f0ebe3; font-family: inherit; font-size: .88rem; outline: none; transition: border-color .15s; }
.afld input:focus { border-color: #e85800; }
.password-reveal { background: rgba(232,88,0,.08); border: 1px solid rgba(232,88,0,.25); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.password-reveal p { font-size: .85rem; color: #f0ebe3; margin: 0; }
.password-box { display: flex; align-items: center; gap: 12px; }
.password-box code { flex: 1; font-family: monospace; font-size: 1rem; color: #e85800; letter-spacing: .05em; }
</style>
