<!-- app/pages/equipment/[slug].vue -->
<template>
  <div class="det" v-if="product">
    <!-- Breadcrumb -->
    <div class="bc">
      <NuxtLink :to="localePath('/')">{{ t('prod.bhome') }}</NuxtLink>
      <span class="sep">›</span>
      <NuxtLink :to="localePath('/equipment')">{{ t('prod.beq') }}</NuxtLink>
      <span class="sep">›</span>
      <span>{{ localContent?.name }}</span>
    </div>

    <div class="det-gr">
      <ProductGallery :images="(product as any).images" />

      <div class="det-inf">
        <div class="det-bdg">{{ t('prod.badge') }}</div>
        <h1 class="det-nm">{{ localContent?.name }}</h1>
        <div class="det-pr">
          <template v-if="(product as any).fromPrice">{{ t('prod.frm') }}&nbsp;</template>{{ (product as any).price.toLocaleString() }}
          <span class="pn">{{ t('prod.uah') }}</span>
        </div>
        <div class="det-de" v-html="localContent?.description"></div>
        <div class="det-div"></div>
        <ul class="det-fl">
          <li v-for="f in localContent?.features" :key="f">{{ f }}</li>
        </ul>
        <div class="det-cta">
          <NuxtLink :to="localePath('/contacts')" class="btn-p" style="justify-content:center;padding:14px 22px;">
            {{ t('prod.order') }}
          </NuxtLink>
        </div>
        <p class="det-note">{{ t('prod.custom') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { data: product } = await useFetch(`/api/products/${route.params.slug}`)
const { data: siteData } = await useFetch('/api/site-content')
const siteContent = computed(() => siteData.value?.content ?? [])
const { t } = useSiteContent(siteContent.value)
const { lang } = useLang()

const localContent = computed(() =>
  (product.value as any)?.content?.find((c: any) => c.lang === lang.value)
)

useSeoMeta({
  title: computed(() => localContent.value?.name ? `${localContent.value.name} — OgnevSport` : 'OgnevSport'),
  description: computed(() => localContent.value?.shortDesc ?? ''),
})
</script>
