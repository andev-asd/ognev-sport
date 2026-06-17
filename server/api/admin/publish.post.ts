export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (!hookUrl) throw createError({ statusCode: 503, message: 'Deploy hook не настроен' })

  const res = await fetch(hookUrl, { method: 'POST' })
  if (!res.ok) throw createError({ statusCode: 502, message: 'Vercel не ответил' })

  return { ok: true }
})
