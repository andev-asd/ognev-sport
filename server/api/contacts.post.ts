// server/api/contacts.post.ts

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, phone, method, message, lang } = body

  if (!name || !phone || !method) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const request = await prisma.contactRequest.create({
    data: {
      name,
      phone,
      method,
      message: message ?? '',
      lang: lang ?? 'ua',
    },
  })

  // Fire-and-forget Telegram notify (don't await — don't block response)
  $fetch('/api/notify', {
    method: 'POST',
    body: { name, phone, method, message: message ?? '' },
  }).catch(() => {})

  return { ok: true, id: request.id }
})
