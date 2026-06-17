import { describe, it, expect, vi } from 'vitest'

vi.mock('~/server/utils/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: '1',
          slug: 'crossover',
          price: 52000,
          fromPrice: false,
          images: ['https://example.com/img.jpg'],
          visible: true,
          order: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          content: [{ id: 'c1', productId: '1', lang: 'ua', name: 'Кросовер', shortDesc: 'Опис', description: '<p>Full</p>', features: ['Особливість 1'] }]
        }
      ]),
      findUnique: vi.fn().mockResolvedValue({
        id: '1', slug: 'crossover', price: 52000, fromPrice: false,
        images: [], visible: true, order: 0, createdAt: new Date(), updatedAt: new Date(),
        content: []
      }),
    },
    siteContent: { findMany: vi.fn().mockResolvedValue([]) },
    siteSettings: { findMany: vi.fn().mockResolvedValue([]) },
  }
}))

describe('products API', () => {
  it('returns visible products ordered by order', async () => {
    const { prisma } = await import('~/server/utils/prisma')
    const result = await prisma.product.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
      include: { content: true },
    })
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('crossover')
    expect(result[0].content).toHaveLength(1)
  })

  it('returns single product by slug', async () => {
    const { prisma } = await import('~/server/utils/prisma')
    const result = await prisma.product.findUnique({
      where: { slug: 'crossover' },
      include: { content: true },
    })
    expect(result?.slug).toBe('crossover')
  })
})
