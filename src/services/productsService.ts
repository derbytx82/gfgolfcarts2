import { supabase } from '../lib/supabase'
import type { Product, ProductInput } from '../types'

const TABLE = 'products'

function normalizeProductPayload(payload: ProductInput) {
  return {
    ...payload,
    slug: payload.slug,
    tags: payload.tags ?? [],
    gallery_images: payload.gallery_images ?? [],
    specs: payload.specs ?? {},
    updated_at: new Date().toISOString(),
  }
}

export async function getProducts() {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as Product[]
}

export async function getFeaturedProducts(limit = 6) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return (data ?? []) as Product[]
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('slug', slug).maybeSingle()

  if (error) {
    throw error
  }

  return (data as Product | null) ?? null
}

export async function getProductById(id: string) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle()

  if (error) {
    throw error
  }

  return (data as Product | null) ?? null
}

export async function saveProduct(payload: ProductInput) {
  const normalized = normalizeProductPayload(payload)
  const { data, error } = await supabase.from(TABLE).upsert(normalized).select().single()

  if (error) {
    throw error
  }

  return data as Product
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)

  if (error) {
    throw error
  }
}
