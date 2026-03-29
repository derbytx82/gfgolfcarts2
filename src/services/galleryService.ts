import { supabase } from '../lib/supabase'
import type { GalleryItem, GalleryItemInput } from '../types'

const TABLE = 'gallery_items'

export async function getGalleryItems() {
  const { data, error } = await supabase.from(TABLE).select('*').order('sort_order', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []) as GalleryItem[]
}

export async function saveGalleryItem(payload: GalleryItemInput) {
  const { data, error } = await supabase.from(TABLE).upsert(payload).select().single()

  if (error) {
    throw error
  }

  return data as GalleryItem
}

export async function deleteGalleryItem(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)

  if (error) {
    throw error
  }
}
