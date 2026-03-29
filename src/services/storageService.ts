import { supabase } from '../lib/supabase'

export const STORAGE_BUCKETS = {
  products: 'products',
  gallery: 'gallery',
  testimonials: 'testimonials',
  site: 'site',
} as const

function getFileExtension(fileName: string) {
  const parts = fileName.split('.')
  return parts.length > 1 ? parts.pop()?.toLowerCase() : 'jpg'
}

function parseStoragePath(publicUrl: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = publicUrl.indexOf(marker)

  if (index === -1) {
    return null
  }

  return publicUrl.slice(index + marker.length)
}

export async function uploadImage(file: File, bucket: (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS], folder = '') {
  const extension = getFileExtension(file.name)
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
  const path = folder ? `${folder}/${fileName}` : fileName

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  })

  if (error) {
    throw error
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl
}

export async function removeImageByPublicUrl(
  publicUrl: string,
  bucket: (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS],
) {
  const path = parseStoragePath(publicUrl, bucket)

  if (!path) {
    return
  }

  const { error } = await supabase.storage.from(bucket).remove([path])

  if (error) {
    throw error
  }
}
