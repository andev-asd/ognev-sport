// server/api/admin/users/[id].delete.ts

export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')!

  await auth.api.removeUser({
    headers: event.headers,
    body: { userId: id },
  })

  return { ok: true }
})
