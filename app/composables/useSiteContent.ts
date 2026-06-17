// app/composables/useSiteContent.ts
import { useLang } from './useLang'
import type { Lang } from './useLang'

export const useSiteContent = (
  content: Array<{ key: string; lang: string; value: string }>
) => {
  const { lang } = useLang()

  const t = (key: string): string => {
    const item = content.find(c => c.key === key && c.lang === lang.value)
    return item?.value ?? ''
  }

  return { t }
}
