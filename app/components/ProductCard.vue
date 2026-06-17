<!-- app/components/ProductCard.vue -->
<template>
  <NuxtLink :to="localePath(`/equipment/${product.slug}`)" class="pcard">
    <div class="pc-img">
      <img v-if="product.images[0]" :src="product.images[0]" :alt="localContent?.name" loading="lazy" />
    </div>
    <div class="pc-body">
      <div class="pc-nm">{{ localContent?.name }}</div>
      <div class="pc-ds">{{ localContent?.shortDesc }}</div>
      <div class="pc-ft">
        <div class="pc-pr">
          <template v-if="product.fromPrice">{{ t('prod.frm') }}&nbsp;</template>{{ product.price.toLocaleString() }} {{ t('prod.uah') }}
        </div>
        <div class="pc-ar">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product, ProductContent } from '@prisma/client'

const props = defineProps<{
  product: Product & { content: ProductContent[] }
  content: Array<{ key: string; lang: string; value: string }>
}>()

const localePath = useLocalePath()
const { lang } = useLang()
const { t } = useSiteContent(props.content)

const localContent = computed(() =>
  props.product.content.find(c => c.lang === lang.value)
)
</script>
