// app/composables/useLang.ts
// Language now lives in the URL (via @nuxtjs/i18n). SSR and client both read it
// from the route, so there is no hydration mismatch.
export type Lang = 'ua' | 'ru' | 'en'

export const useLang = () => {
  const { locale, setLocale } = useI18n()

  const lang = computed<Lang>(() => locale.value as Lang)

  const setLang = (l: Lang) => {
    setLocale(l)
  }

  const langLabel: Record<Lang, string> = {
    ua: 'Українська',
    ru: 'Русский',
    en: 'English',
  }

  return { lang, setLang, langLabel }
}
