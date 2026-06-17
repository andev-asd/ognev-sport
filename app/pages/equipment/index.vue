<!-- app/pages/equipment/index.vue -->
<template>
  <div>
    <div class="eq-hd">
      <h1 class="eq-t">{{ t('eq.title') }}</h1>
      <p class="eq-s">{{ t('eq.sub') }}</p>
    </div>
    <div class="eq-gr">
      <div class="pgrid">
        <ProductCard
          v-for="p in products"
          :key="(p as any).id"
          :product="p as any"
          :content="siteContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: siteData } = await useFetch('/api/site-content')
const { data: products } = await useFetch('/api/products')
const siteContent = computed(() => siteData.value?.content ?? [])
const settings = computed(() => siteData.value?.settings ?? [])
const { t } = useSiteContent(siteContent.value)
const { lang } = useLang()

const seoGet = (key: string) => computed(() =>
  (siteContent.value as any[]).find((c: any) => c.key === key && c.lang === lang.value)?.value ?? ''
)
const getSetting = (key: string, fallback = '') =>
  settings.value.find((s: any) => s.key === key)?.value ?? fallback

useSeoMeta({
  title: computed(() => seoGet('seo.catalog.title').value || 'Каталог тренажерів — OgnevSport'),
  description: computed(() => seoGet('seo.catalog.desc').value || 'Весь асортимент спортивних тренажерів власного виробництва'),
  ogImage: computed(() => getSetting('seo.catalog.ogImage') || undefined),
})
</script>
