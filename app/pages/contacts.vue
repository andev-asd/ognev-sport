<!-- app/pages/contacts.vue -->
<template>
  <div class="con-pg">
    <h1 class="con-t">{{ t('con.title') }}</h1>
    <p class="con-s">{{ t('con.sub') }}</p>
    <ContactForm :content="siteContent" />
  </div>
</template>

<script setup lang="ts">
const { data: siteData } = await useFetch('/api/site-content')
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
  title: computed(() => seoGet('seo.contacts.title').value || 'Контакти — OgnevSport'),
  description: computed(() => seoGet('seo.contacts.desc').value || 'Зв\'яжіться з виробником спортивних тренажерів OgnevSport'),
  ogImage: computed(() => getSetting('seo.contacts.ogImage') || undefined),
})
</script>
