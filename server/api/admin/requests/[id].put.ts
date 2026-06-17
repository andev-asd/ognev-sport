export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const data: Record<string, unknown> = {}
  if ('read'   in body) data.read   = Boolean(body.read)
  if ('status' in body) data.status = String(body.status)
  if ('note'   in body) data.note   = String(body.note)

  return prisma.contactRequest.update({ where: { id }, data })
})
