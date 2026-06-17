import { createClient } from '@supabase/supabase-js'

const BUCKETS = ['products', 'site']

async function listAll(supabase: ReturnType<typeof createClient>, bucket: string, prefix = ''): Promise<string[]> {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 })
  if (error || !data) return []
  const paths: string[] = []
  for (const item of data) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name
    if (item.metadata) {
      paths.push(fullPath)
    } else {
      const sub = await listAll(supabase, bucket, fullPath)
      paths.push(...sub)
    }
  }
  return paths
}

export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const results: { bucket: string; path: string; url: string }[] = []

  for (const bucket of BUCKETS) {
    const paths = await listAll(supabase, bucket)
    for (const path of paths) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path)
      results.push({ bucket, path, url: data.publicUrl })
    }
  }

  return results
})
