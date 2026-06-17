
export default defineEventHandler(async () => {
  const [content, settings] = await Promise.all([
    prisma.siteContent.findMany(),
    prisma.siteSettings.findMany(),
  ])
  return { content, settings }
})
