const BASE_URL = process.env.NUXT_PUBLIC_I18N_BASE_URL || 'https://ognevsport.com'

// i18n: 'prefix_except_default', default = ua (no prefix), ru/en get prefix
const LOCALES = [
  { code: 'ua', prefix: '' },
  { code: 'ru', prefix: '/ru' },
  { code: 'en', prefix: '/en' },
]

const STATIC_PATHS = ['', '/equipment', '/contacts']

function url(prefix: string, path: string, lastmod?: string) {
  const loc = `${BASE_URL}${prefix}${path}`
  return `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  const today = new Date().toISOString().slice(0, 10)

  const products = await prisma.product.findMany({
    where: { visible: true },
    select: { slug: true, updatedAt: true },
  })

  const entries: string[] = []

  // Static pages
  for (const { prefix } of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push(url(prefix, path || '/', today))
    }
  }

  // Product pages
  for (const product of products) {
    const lastmod = product.updatedAt.toISOString().slice(0, 10)
    for (const { prefix } of LOCALES) {
      entries.push(url(prefix, `/equipment/${product.slug}`, lastmod))
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`
})
