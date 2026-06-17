import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const products = await prisma.product.findMany({ select: { id: true, images: true } })

  const results: { productId: string; old: string; new: string; error?: string }[] = []

  for (const product of products) {
    const newImages: string[] = []
    let changed = false

    for (const imageUrl of product.images) {
      // Already in Supabase — keep as is
      if (imageUrl.includes(process.env.SUPABASE_URL!)) {
        newImages.push(imageUrl)
        continue
      }

      // External URL — download and reupload
      try {
        const res = await fetch(imageUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const buffer = Buffer.from(await res.arrayBuffer())
        const contentType = res.headers.get('content-type') ?? 'image/jpeg'
        const ext = contentType.split('/')[1]?.split(';')[0] ?? 'jpg'
        const path = `migrated/${product.id}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(path, buffer, { contentType })

        if (uploadError) throw new Error(uploadError.message)

        const { data } = supabase.storage.from('products').getPublicUrl(path)
        newImages.push(data.publicUrl)
        results.push({ productId: product.id, old: imageUrl, new: data.publicUrl })
        changed = true
      } catch (e: any) {
        // Keep old URL on error
        newImages.push(imageUrl)
        results.push({ productId: product.id, old: imageUrl, new: imageUrl, error: e.message })
      }
    }

    if (changed) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: newImages },
      })
    }
  }

  return { migrated: results.filter(r => !r.error).length, failed: results.filter(r => r.error).length, details: results }
})
