
export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  return prisma.product.findMany({
    orderBy: { order: 'asc' },
    include: { content: true },
  })
})
