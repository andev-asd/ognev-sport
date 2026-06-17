
export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const { content, ...productData } = body

  // Update product base fields
  await prisma.product.update({
    where: { id },
    data: productData,
  })

  // Upsert content for each language
  if (content && Array.isArray(content)) {
    for (const c of content) {
      await prisma.productContent.upsert({
        where: { productId_lang: { productId: id, lang: c.lang } },
        update: {
          name: c.name,
          shortDesc: c.shortDesc,
          description: c.description,
          features: c.features ?? [],
        },
        create: {
          productId: id,
          lang: c.lang,
          name: c.name,
          shortDesc: c.shortDesc,
          description: c.description,
          features: c.features ?? [],
        },
      })
    }
  }

  return prisma.product.findUnique({ where: { id }, include: { content: true } })
})
