// app/middleware/admin.ts
import { authClient } from '~/utils/auth-client'

export default defineNuxtRouteMiddleware(async () => {
  // Client-side session check
  if (import.meta.client) {
    const session = await authClient.getSession()
    if (!session.data?.user) {
      return navigateTo('/admin/login')
    }
  }
})
