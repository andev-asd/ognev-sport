<!-- app/components/admin/ImageUploader.vue -->
<template>
  <div class="img-uploader">
    <div class="img-grid">
      <div v-for="(url, i) in modelValue" :key="url" class="img-item">
        <img :src="url" alt="" />
        <button class="img-remove" type="button" @click="remove(i)" title="Удалить">✕</button>
      </div>
      <label class="img-add" :class="{ uploading }">
        <input
          type="file"
          accept="image/*"
          multiple
          @change="upload"
          :disabled="uploading"
          style="display:none"
        />
        <span>{{ uploading ? '...' : '+ Фото' }}</span>
      </label>
    </div>
    <p v-if="error" style="color:#e85800;font-size:.75rem;margin-top:4px">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string[]; bucket: string }>()
const emit = defineEmits<{ 'update:modelValue': [urls: string[]] }>()

const uploading = ref(false)
const error = ref('')

const upload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return
  uploading.value = true
  error.value = ''
  const newUrls: string[] = []
  for (const file of Array.from(files)) {
    try {
      const ext = file.name.split('.').pop()
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', props.bucket)
      form.append('path', `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`)
      const res = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body: form })
      newUrls.push(res.url)
    } catch (err: any) {
      error.value = err?.data?.message ?? err?.message ?? 'Помилка завантаження'
    }
  }
  emit('update:modelValue', [...props.modelValue, ...newUrls])
  uploading.value = false
  ;(e.target as HTMLInputElement).value = ''
}

const remove = (i: number) => {
  const updated = [...props.modelValue]
  updated.splice(i, 1)
  emit('update:modelValue', updated)
}
</script>

<style scoped>
.img-grid { display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start; }
.img-item { position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; }
.img-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.img-remove { position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,.75); border: none; color: #fff; font-size: .65rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; }
.img-add { width: 80px; height: 80px; border-radius: 8px; border: 2px dashed #2e2821; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #7a7068; font-size: .75rem; text-align: center; transition: border-color .15s, color .15s; }
.img-add:hover, .img-add.uploading { border-color: #e85800; color: #e85800; }
</style>
