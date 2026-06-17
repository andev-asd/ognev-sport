<template>
  <div class="admin-shell" data-theme="dark">
    <aside class="admin-sidebar">
      <div class="admin-logo">
        <span style="color:#e85800">Ognev</span>Sport Admin
      </div>
      <nav class="admin-nav">
        <NuxtLink to="/admin">Заявки</NuxtLink>
        <NuxtLink to="/admin/home">Главная</NuxtLink>
        <NuxtLink to="/admin/contacts">Контакты</NuxtLink>
        <NuxtLink to="/admin/seo">SEO</NuxtLink>
        <NuxtLink to="/admin/footer">Футер</NuxtLink>
        <NuxtLink to="/admin/media">Медиа</NuxtLink>
        <NuxtLink to="/admin/products">Товары</NuxtLink>
        <NuxtLink to="/admin/users">Пользователи</NuxtLink>
      </nav>
      <button class="admin-publish" :disabled="publishing" @click="publish">
        {{ publishState === 'ok' ? '✓ Опубликовано' : publishState === 'err' ? '✗ Ошибка' : publishing ? '...' : '↑ Опубликовать' }}
      </button>
      <button class="admin-logout" @click="logout">Выйти</button>
    </aside>
    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

const logout = async () => {
  await authClient.signOut()
  await navigateTo('/admin/login')
}

const publishing = ref(false)
const publishState = ref<'idle' | 'ok' | 'err'>('idle')

const publish = async () => {
  publishing.value = true
  publishState.value = 'idle'
  try {
    await $fetch('/api/admin/publish', { method: 'POST' })
    publishState.value = 'ok'
  } catch {
    publishState.value = 'err'
  } finally {
    publishing.value = false
    setTimeout(() => { publishState.value = 'idle' }, 3000)
  }
}
</script>

<style scoped>
.admin-shell { display: flex; min-height: 100vh; background: #0f0e0d; color: #f0ebe3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
.admin-sidebar { width: 220px; flex-shrink: 0; background: #1c1917; border-right: 1px solid #2e2821; display: flex; flex-direction: column; padding: 24px 16px; gap: 8px; }
.admin-logo { font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; color: #f0ebe3; }
.admin-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
.admin-nav a { padding: 9px 12px; border-radius: 8px; color: #7a7068; font-size: .88rem; text-decoration: none; transition: background .15s, color .15s; }
.admin-nav a:hover { background: #252219; color: #f0ebe3; }
.admin-nav a.router-link-active { background: #252219; color: #f0ebe3; }
.admin-publish { padding: 9px 12px; border-radius: 8px; background: rgba(232,88,0,.12); border: 1px solid rgba(232,88,0,.3); color: #e85800; font-size: .88rem; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s; text-align: center; font-family: inherit; margin-bottom: 4px; }
.admin-publish:hover:not(:disabled) { background: rgba(232,88,0,.22); border-color: rgba(232,88,0,.6); }
.admin-publish:disabled { opacity: .5; cursor: not-allowed; }
.admin-logout { padding: 9px 12px; border-radius: 8px; background: none; border: 1px solid #2e2821; color: #7a7068; font-size: .88rem; cursor: pointer; transition: color .15s, border-color .15s; text-align: left; font-family: inherit; }
.admin-logout:hover { color: #f0ebe3; border-color: #7a7068; }
.admin-main { flex: 1; padding: 32px; overflow-y: auto; }
</style>
