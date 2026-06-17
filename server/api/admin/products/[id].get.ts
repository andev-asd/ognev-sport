
export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')!
  const product = await prisma.product.findUnique({
    where: { id },
    include: { content: true },
  })
  if (!product) throw createError({ statusCode: 404, message: 'Not found' })
  return product
})
