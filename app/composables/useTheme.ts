// app/composables/useTheme.ts
export const useTheme = () => {
  // Cookie keeps SSR and client in sync (avoids hydration mismatch on data-theme).
  const theme = useCookie<'dark' | 'light'>('theme', {
    default: () => 'dark',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/',
  })

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const apply = () => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', theme.value)
    }
  }

  return { theme, toggle, apply }
}
