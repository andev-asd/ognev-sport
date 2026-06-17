
export default defineEventHandler(async () => {
  return prisma.product.findMany({
    where: { visible: true },
    orderBy: { order: 'asc' },
    include: { content: true },
  })
})
