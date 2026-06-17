<!-- app/error.vue -->
<template>
  <div style="min-height:100vh;background:#0f0e0d;display:flex;align-items:center;justify-content:center;font-family:-apple-system,sans-serif;color:#f0ebe3;text-align:center;padding:20px">
    <div>
      <div style="font-size:3rem;font-weight:800;color:#e85800;margin-bottom:8px">{{ error?.statusCode }}</div>
      <div style="font-size:1.1rem;color:#7a7068;margin-bottom:24px">{{ error?.statusCode === 404 ? 'Страницу не найдено' : 'Ошибка сервера' }}</div>
      <a href="/" style="display:inline-flex;align-items:center;padding:11px 22px;background:#e85800;color:#fff;border-radius:9px;font-weight:600;font-size:.92rem;text-decoration:none">← На главную</a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ error: { statusCode: number; message?: string } | null }>()
</script>
