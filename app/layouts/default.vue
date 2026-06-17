<template>
  <div :data-theme="theme" class="site-body">
    <AppNav :content="siteContent" />
    <slot />
    <AppFooter :content="siteContent" :settings="siteSettings" />
  </div>
</template>

<script setup lang="ts">
const { theme, apply } = useTheme()
onMounted(() => apply())
watch(theme, () => apply())

// SEO: hreflang + canonical + html lang attribute for all locales
const head = useLocaleHead()
useHead(() => ({
  htmlAttrs: head.value.htmlAttrs,
  link: head.value.link,
  meta: head.value.meta,
}))

// Fetch site content for nav and footer
const { data } = await useFetch('/api/site-content')
const siteContent = computed(() => data.value?.content ?? [])
const siteSettings = computed(() => data.value?.settings ?? [])
</script>
