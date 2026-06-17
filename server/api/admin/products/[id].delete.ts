
export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')!
  await prisma.product.delete({ where: { id } })
  return { ok: true }
})
