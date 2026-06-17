// server/api/admin/users.post.ts

const generatePassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from(
    { length: 12 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const { email } = await readBody(event)
  if (!email) throw createError({ statusCode: 400, message: 'Email required' })

  const password = generatePassword()

  await auth.api.createUser({
    headers: event.headers,
    body: {
      email,
      password,
      name: email.split('@')[0],
      role: 'admin',
    },
  })

  return { email, password }
})
