import { supabase } from '../lib/supabase'
import type { Testimonial, TestimonialInput } from '../types'

const TABLE = 'testimonials'

export async function getTestimonials(featuredOnly = false) {
  let query = supabase.from(TABLE).select('*').order('created_at', { ascending: false })

  if (featuredOnly) {
    query = query.eq('featured', true)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return (data ?? []) as Testimonial[]
}

export async function saveTestimonial(payload: TestimonialInput) {
  const { data, error } = await supabase.from(TABLE).upsert(payload).select().single()

  if (error) {
    throw error
  }

  return data as Testimonial
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)

  if (error) {
    throw error
  }
}
