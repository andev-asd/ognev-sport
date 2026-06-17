
export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  const { slug, price, fromPrice, images, visible, order, content } = body

  return prisma.product.create({
    data: {
      slug: slug ?? `product-${Date.now()}`,
      price: price ?? 0,
      fromPrice: fromPrice ?? false,
      images: images ?? [],
      visible: visible ?? true,
      order: order ?? 0,
      content: content?.length
        ? { create: content }
        : undefined,
    },
    include: { content: true },
  })
})
