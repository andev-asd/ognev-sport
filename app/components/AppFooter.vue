<template>
  <footer>
    <div class="ft-in">
      <div class="ft-brand">
        <span class="ft-logo"><span style="color:var(--ac)">Ognev</span>Sport</span>
        <span class="ft-cp">{{ t('foot') }}</span>
      </div>

      <div class="ft-contacts" v-if="phone || email || telegram">
        <a v-if="phone" :href="`tel:${phone.replace(/\s/g,'')}`" class="ft-contact-link">{{ phone }}</a>
        <a v-if="email" :href="`mailto:${email}`" class="ft-contact-link">{{ email }}</a>
        <a v-if="telegram" :href="`https://t.me/${telegram.replace('@','')}`" target="_blank" rel="noopener" class="ft-contact-link">{{ telegram }}</a>
      </div>

      <nav class="ft-nav">
        <NuxtLink :to="localePath('/')">{{ t('nav.home') }}</NuxtLink>
        <NuxtLink :to="localePath('/equipment')">{{ t('nav.eq') }}</NuxtLink>
        <NuxtLink :to="localePath('/contacts')">{{ t('nav.con') }}</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: Array<{ key: string; lang: string; value: string }>
  settings?: Array<{ key: string; value: string }>
}>()
const localePath = useLocalePath()
const { t } = useSiteContent(props.content)

const getSetting = (key: string) =>
  props.settings?.find(s => s.key === key)?.value ?? ''

const phone    = computed(() => getSetting('foot.phone'))
const email    = computed(() => getSetting('foot.email'))
const telegram = computed(() => getSetting('foot.telegram'))
</script>
