
export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })
  return prisma.siteContent.findMany()
})
