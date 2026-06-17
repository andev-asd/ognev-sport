export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  // Gather all image URLs referenced in the DB
  const [products, settings] = await Promise.all([
    prisma.product.findMany({ select: { images: true } }),
    prisma.siteSettings.findMany({ select: { key: true, value: true } }),
  ])

  const usedUrls = new Set<string>()

  for (const p of products) {
    for (const url of p.images) usedUrls.add(url)
  }

  for (const s of settings) {
    if (s.value.startsWith('http')) {
      usedUrls.add(s.value)
    } else if (s.value.startsWith('[')) {
      try {
        const arr = JSON.parse(s.value)
        if (Array.isArray(arr)) arr.forEach((u: unknown) => typeof u === 'string' && usedUrls.add(u))
      } catch {}
    }
  }

  return { used: [...usedUrls] }
})
