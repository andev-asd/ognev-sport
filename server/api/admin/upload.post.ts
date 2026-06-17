import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401 })

  const parts = await readMultipartFormData(event)
  if (!parts?.length) throw createError({ statusCode: 400, message: 'No file' })

  const filePart = parts.find(p => p.name === 'file')
  const bucketPart = parts.find(p => p.name === 'bucket')
  const pathPart = parts.find(p => p.name === 'path')

  if (!filePart?.data) throw createError({ statusCode: 400, message: 'No file data' })

  const bucket = bucketPart?.data.toString() ?? 'site'
  const path = pathPart?.data.toString() ?? `upload-${Date.now()}`
  const contentType = filePart.type ?? 'application/octet-stream'

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, filePart.data, { contentType })

  if (error) throw createError({ statusCode: 500, message: error.message })

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl }
})
