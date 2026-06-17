export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const userId = getRouterParam(event, 'id')!
  const { password } = await readBody(event)

  if (!password || password.length < 8)
    throw createError({ statusCode: 400, message: 'Пароль должен быть не менее 8 символов' })

  await auth.api.setUserPassword({
    headers: event.headers,
    body: { userId, newPassword: password },
  })

  return { ok: true }
})
