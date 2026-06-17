
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { content: true },
  })
  if (!product) throw createError({ statusCode: 404, message: 'Product not found' })
  return product
})
