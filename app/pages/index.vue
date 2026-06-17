<!-- app/pages/index.vue -->
<template>
  <div>
    <!-- HERO -->
    <section
      v-if="heroVisible"
      class="hero-bg"
      :class="{ 'hero-has-bg': heroBgUrl }"
      :style="heroBgUrl ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 18%), linear-gradient(105deg, rgba(0,0,0,.82) 30%, rgba(0,0,0,.45) 65%, rgba(0,0,0,.15) 100%), url(${heroBgUrl})` } : {}"
    >
    <div class="hero">
      <div class="hero-text">
        <div class="hero-ey">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>{{ t('hero.eyebrow') }}</span>
        </div>
        <h1 class="hero-h">{{ t('hero.title') }}</h1>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-if="t('hero.slogan')" class="hero-slogan" v-html="t('hero.slogan')"></p>
        <p class="hero-sub">{{ t('hero.sub') }}</p>
        <div class="hero-act">
          <NuxtLink :to="localePath('/equipment')" class="btn-p">{{ t('hero.cta') }}</NuxtLink>
          <NuxtLink :to="localePath('/contacts')" class="btn-s">{{ t('hero.cta2') }}</NuxtLink>
        </div>
      </div>
      <div class="hero-vis">
        <div v-for="(img, i) in heroImages" :key="i" class="h-img">
          <img :src="img" alt="" loading="lazy" />
        </div>
      </div>
    </div>
    </section>

    <!-- STATS -->
    <div v-if="statsVisible" class="stats-b">
      <div class="stats-in">
        <div v-for="i in statsIndices" :key="i" class="st">
          <div class="st-nb">{{ t(`stats.${i}.value`) }}</div>
          <div class="st-lb">{{ t(`stats.${i}.label`) }}</div>
        </div>
      </div>
    </div>

    <!-- ABOUT -->
    <div v-if="aboutVisible" class="about-s">
      <div>
        <div class="ab-l">{{ t('about.label') }}</div>
        <h2 class="ab-h">{{ t('about.title') }}</h2>
      </div>
      <div>
        <p class="ab-p">{{ t('about.p1') }}</p>
        <p class="ab-p">{{ t('about.p2') }}</p>
        <div class="feats">
          <div v-for="i in featIndices" :key="i" class="fc">
            <div class="fc-ic">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="fc-nm">{{ t(`feat.${i}.name`) }}</div>
            <div class="fc-de">{{ t(`feat.${i}.desc`) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- FEATURED PRODUCTS -->
    <div v-if="productsVisible" class="sec">
      <div class="sec-hd">
        <span class="sec-t">{{ t('featured.title') }}</span>
        <NuxtLink :to="localePath('/equipment')" class="sec-lk">{{ t('featured.link') }}</NuxtLink>
      </div>
      <div class="pgrid">
        <ProductCard
          v-for="p in featuredProducts"
          :key="p.id"
          :product="p"
          :content="siteContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const [{ data: siteData }, { data: products }] = await Promise.all([
  useFetch('/api/site-content'),
  useFetch('/api/products'),
])

const siteContent = computed(() => siteData.value?.content ?? [])
const settings = computed(() => siteData.value?.settings ?? [])

const { t } = useSiteContent(siteContent.value)

const getSetting = (key: string, fallback = 'true') =>
  settings.value.find((s: any) => s.key === key)?.value ?? fallback

const heroVisible = computed(() => getSetting('heroVisible') !== 'false')
const heroBgUrl = computed(() => getSetting('heroBg', ''))
const statsVisible = computed(() => getSetting('statsVisible') !== 'false')
const aboutVisible = computed(() => getSetting('aboutVisible') !== 'false')
const productsVisible = computed(() => getSetting('productsVisible') !== 'false')

const heroImages = computed(() => {
  const raw = getSetting('heroImages', '[]')
  try { return JSON.parse(raw) as string[] } catch { return [] }
})

const statsIndices = computed(() => {
  const seen = new Set<number>()
  for (const c of siteContent.value as any[]) {
    const m = c.key.match(/^stats\.(\d+)\.value$/)
    if (m) seen.add(parseInt(m[1]))
  }
  return [...seen].sort((a, b) => a - b)
})

const featIndices = computed(() => {
  const seen = new Set<number>()
  for (const c of siteContent.value as any[]) {
    const m = c.key.match(/^feat\.(\d+)\.name$/)
    if (m) seen.add(parseInt(m[1]))
  }
  return [...seen].sort((a, b) => a - b)
})

const featuredProducts = computed(() =>
  ((products.value as any[]) ?? []).slice(0, 3)
)

const { lang } = useLang()
const seoGet = (key: string) => computed(() =>
  (siteContent.value as any[]).find((c: any) => c.key === key && c.lang === lang.value)?.value ?? ''
)
const seoOg = (key: string) => getSetting(key, '')

useSeoMeta({
  title: computed(() => seoGet('seo.home.title').value || 'OgnevSport — Виробник тренажерів'),
  description: computed(() => seoGet('seo.home.desc').value || 'Виробник спортивних тренажерів для залів. Армрестлинг, пауерліфтинг, кросфіт. Власне виробництво, індивідуальний підхід.'),
  ogImage: computed(() => seoOg('seo.home.ogImage') || undefined),
})
</script>
