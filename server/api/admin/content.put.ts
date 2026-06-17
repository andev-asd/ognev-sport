
export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  const body = await readBody(event)
  if (!Array.isArray(body)) throw createError({ statusCode: 400, message: 'Expected array' })

  await Promise.all(
    body.map((item: { key: string; lang: string; value: string }) =>
      prisma.siteContent.upsert({
        where: { key_lang: { key: item.key, lang: item.lang } },
        update: { value: item.value },
        create: { key: item.key, lang: item.lang, value: item.value },
      })
    )
  )
  return { ok: true }
})
