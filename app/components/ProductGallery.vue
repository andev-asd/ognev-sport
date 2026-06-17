<!-- app/components/ProductGallery.vue -->
<template>
  <div class="gal">
    <div class="gal-main-wrap">
      <div class="gal-main">
        <img
          :src="images[activeIdx]"
          alt=""
          @click="lbOpen = true"
          style="cursor:zoom-in"
        />
      </div>
      <button
        v-if="images.length > 1"
        class="gal-nav gal-nav-prev"
        @click="nav(-1)"
        aria-label="Previous"
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path d="M8 2L2 8l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        v-if="images.length > 1"
        class="gal-nav gal-nav-next"
        @click="nav(1)"
        aria-label="Next"
      >
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path d="M2 2l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Thumbnails -->
    <div class="gal-strip" v-if="images.length > 1">
      <div class="gal-th-inner">
        <button
          v-for="(img, i) in images"
          :key="i"
          class="g-th"
          :class="{ on: i === activeIdx }"
          @click="activeIdx = i"
        >
          <img :src="img" alt="" />
        </button>
      </div>
    </div>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <div
      v-if="lbOpen"
      class="lb open"
      @click.self="lbOpen = false"
    >
      <button class="lb-close" @click="lbOpen = false">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="lb-nav lb-prev" @click="nav(-1)" aria-label="Previous">
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
          <path d="M10 2L2 10l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <img class="lb-img" :src="images[activeIdx]" alt="" />
      <button class="lb-nav lb-next" @click="nav(1)" aria-label="Next">
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
          <path d="M2 2l8 8-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="lb-counter">{{ activeIdx + 1 }} / {{ images.length }}</div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

const props = defineProps<{ images: string[] }>()
const activeIdx = ref(0)
const lbOpen = ref(false)

const nav = (dir: -1 | 1) => {
  activeIdx.value = (activeIdx.value + dir + props.images.length) % props.images.length
}

// Close lightbox on Escape key
if (import.meta.client) {
  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') lbOpen.value = false
    if (e.key === 'ArrowLeft') nav(-1)
    if (e.key === 'ArrowRight') nav(1)
  })
}
</script>
