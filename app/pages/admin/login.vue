<!-- app/pages/admin/login.vue -->
<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="login-logo">
        <span style="color:#e85800">Ognev</span>Sport Admin
      </div>
      <div class="fld">
        <label style="color:#f0ebe3;font-size:.8rem;font-weight:600">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="admin@example.com"
          style="background:#0f0e0d;border:1px solid #3a3530;border-radius:9px;padding:11px 14px;color:#f0ebe3;font-family:inherit;font-size:.93rem;outline:none;width:100%;box-sizing:border-box"
          @keydown.enter="login"
        />
      </div>
      <div class="fld">
        <label style="color:#f0ebe3;font-size:.8rem;font-weight:600">Пароль</label>
        <input
          v-model="password"
          type="password"
          style="background:#0f0e0d;border:1px solid #3a3530;border-radius:9px;padding:11px 14px;color:#f0ebe3;font-family:inherit;font-size:.93rem;outline:none;width:100%;box-sizing:border-box"
          @keydown.enter="login"
        />
      </div>
      <button
        class="btn-p"
        style="width:100%;justify-content:center;padding:13px"
        :disabled="loading"
        @click="login"
      >
        {{ loading ? 'Входим...' : 'Войти' }}
      </button>
      <p v-if="error" style="color:#e85800;font-size:.85rem;margin:0">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '~/utils/auth-client'

definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const login = async () => {
  if (!email.value || !password.value) return
  loading.value = true
  error.value = ''
  const { error: err } = await authClient.signIn.email({
    email: email.value,
    password: password.value,
  })
  if (err) {
    error.value = 'Неверный email или пароль'
  } else {
    await navigateTo('/admin')
  }
  loading.value = false
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  background: #0f0e0d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}
.login-box {
  background: #1c1917;
  border: 1px solid #2e2821;
  border-radius: 16px;
  padding: 36px;
  width: 360px;
  max-width: calc(100vw - 32px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.login-logo {
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
  color: #f0ebe3;
}
.fld {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
</style>
