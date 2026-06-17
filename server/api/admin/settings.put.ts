
export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  const body = await readBody(event)
  if (!Array.isArray(body)) throw createError({ statusCode: 400, message: 'Expected array' })

  await Promise.all(
    body.map((item: { key: string; value: string }) =>
      prisma.siteSettings.upsert({
        where: { key: item.key },
        update: { value: item.value },
        create: { key: item.key, value: item.value },
      })
    )
  )
  return { ok: true }
})
