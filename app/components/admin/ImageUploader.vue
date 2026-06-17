<!-- app/components/admin/ImageUploader.vue -->
<template>
  <div class="img-uploader">
    <div class="img-grid">
      <div
        v-for="(url, i) in modelValue"
        :key="url"
        class="img-item"
        :class="{ 'drag-over': dragOverIndex === i, 'dragging': dragIndex === i }"
        draggable="true"
        @dragstart="onDragStart(i)"
        @dragover.prevent="onDragOver(i)"
        @dragend="onDragEnd"
        @drop.prevent="onDrop(i)"
      >
        <img :src="url" alt="" draggable="false" />
        <button class="img-remove" type="button" @click="remove(i)" title="Удалить">✕</button>
        <span v-if="i === 0" class="img-badge">Главное</span>
      </div>
      <button type="button" class="img-add" @click="pickerOpen = true">+ Фото</button>
    </div>

    <MediaPickerModal
      v-model="pickerOpen"
      :bucket="bucket"
      @select="onSelect"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string[]; bucket: string }>()
const emit = defineEmits<{ 'update:modelValue': [urls: string[]] }>()

const pickerOpen = ref(false)
const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const onSelect = (urls: string[]) => {
  const existing = new Set(props.modelValue)
  const newUrls = urls.filter(u => !existing.has(u))
  emit('update:modelValue', [...props.modelValue, ...newUrls])
}

const onDragStart = (i: number) => { dragIndex.value = i }
const onDragOver = (i: number) => { dragOverIndex.value = i }
const onDragEnd = () => { dragIndex.value = null; dragOverIndex.value = null }

const onDrop = (toIndex: number) => {
  const from = dragIndex.value
  if (from === null || from === toIndex) return
  const updated = [...props.modelValue]
  const [item] = updated.splice(from, 1)
  updated.splice(toIndex, 0, item)
  emit('update:modelValue', updated)
  dragIndex.value = null
  dragOverIndex.value = null
}

const remove = (i: number) => {
  const updated = [...props.modelValue]
  updated.splice(i, 1)
  emit('update:modelValue', updated)
}
</script>

<style scoped>
.img-grid { display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start; }
.img-item { position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; cursor: grab; transition: opacity .15s, transform .15s, box-shadow .15s; }
.img-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.img-item.dragging { opacity: .4; cursor: grabbing; }
.img-item.drag-over { box-shadow: 0 0 0 2px #e85800; transform: scale(1.05); }
.img-remove { position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,.75); border: none; color: #fff; font-size: .65rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; }
.img-badge { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(232,88,0,.85); color: #fff; font-size: .55rem; text-align: center; padding: 2px 0; pointer-events: none; }
.img-add { width: 80px; height: 80px; border-radius: 8px; border: 2px dashed #2e2821; background: none; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #7a7068; font-size: .75rem; text-align: center; transition: border-color .15s, color .15s; font-family: inherit; }
.img-add:hover { border-color: #e85800; color: #e85800; }
</style>
