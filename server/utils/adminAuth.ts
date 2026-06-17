// server/utils/adminAuth.ts
import { auth } from './auth'

export const getAdminSession = async (event: any) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })
  return session?.user ?? null
}
