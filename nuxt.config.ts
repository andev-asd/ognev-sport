// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  css: ['~/assets/css/main.css'],
  // Register components by filename without the directory prefix, so
  // components/admin/LangTabs.vue is <LangTabs> (not <AdminLangTabs>).
  components: [{ path: '~/components', pathPrefix: false }],
  modules: ['@nuxtjs/supabase', '@nuxtjs/i18n'],
  supabase: {
    redirect: false,
  },
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'ua',
    locales: [
      { code: 'ua', language: 'uk-UA', name: 'Українська' },
      { code: 'ru', language: 'ru-RU', name: 'Русский' },
      { code: 'en', language: 'en-US', name: 'English' },
    ],
    // Needed for SEO hreflang / canonical tags. Override in prod via NUXT_PUBLIC_I18N_BASE_URL.
    baseUrl: process.env.NUXT_PUBLIC_I18N_BASE_URL || 'https://ognevsport.com',
    // Content comes from the DB, so no translation files — locale is used only for routing
    bundle: { optimizeTranslationDirective: false },
    // No auto-redirect: default is always 'ua' (predictable URLs), user switches manually
    detectBrowserLanguage: false,
  },
  runtimeConfig: {
    groqApiKey: '',
    telegramBotToken: '',
    telegramChatId: '',
    betterAuthSecret: '',  // NUXT_BETTER_AUTH_SECRET
    betterAuthUrl: '',     // NUXT_BETTER_AUTH_URL
  },
  devServer: {
    port: 3030,
  },
  routeRules: {
    // Public pages — ISR: prerendered at deploy, auto-regenerated every 5 min
    // New products added via admin appear on site within 5 minutes, no redeploy needed
    '/': { isr: 300 },
    '/equipment': { isr: 300 },
    '/contacts': { isr: 300 },
    '/equipment/**': { isr: 300 },
    '/ru': { isr: 300 },
    '/ru/equipment': { isr: 300 },
    '/ru/contacts': { isr: 300 },
    '/ru/equipment/**': { isr: 300 },
    '/en': { isr: 300 },
    '/en/equipment': { isr: 300 },
    '/en/contacts': { isr: 300 },
    '/en/equipment/**': { isr: 300 },

    // Public API — cache at CDN edge for 5 minutes
    '/api/products': { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    '/api/products/**': { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    '/api/site-content': { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    '/sitemap.xml': { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },

    // Admin is auth-gated & dynamic — keep it SSR but never prerender to static,
    // and keep it out of search indexes.
    '/admin/**': { prerender: false, index: false },
    '/admin': { prerender: false, index: false },
    // Admin is single-language: i18n still generates localized routes, so redirect
    // any /ru/admin* or /en/admin* to the canonical /admin.
    '/ru/admin': { redirect: '/admin' },
    '/ru/admin/**': { redirect: '/admin' },
    '/en/admin': { redirect: '/admin' },
    '/en/admin/**': { redirect: '/admin' },
  },
  nitro: {
    preset: 'vercel',
    prerender: {
      // Three locale roots as crawl entry points; crawlLinks follows localized
      // links from each (/, /ru/..., /en/...) to prerender all public pages.
      routes: ['/', '/ru', '/en'],
      crawlLinks: true,
      ignore: ['/admin', '/ru/admin', '/en/admin'],
    },
  },
})
