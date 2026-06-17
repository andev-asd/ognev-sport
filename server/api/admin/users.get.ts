// server/api/admin/users.get.ts

export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { users } = await auth.api.listUsers({
    headers: event.headers,
    query: { limit: 100 },
  })

  return users.map(u => ({
    id: u.id,
    email: u.email,
    createdAt: u.createdAt,
  }))
})
