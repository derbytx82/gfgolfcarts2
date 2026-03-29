import { supabase } from '../lib/supabase'
import type { SiteContent, SiteContentInput } from '../types'

const TABLE = 'site_content'

export async function getSiteContentList() {
  const { data, error } = await supabase.from(TABLE).select('*').order('updated_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as SiteContent[]
}

export async function getSiteContentMap() {
  const list = await getSiteContentList()

  return list.reduce<Record<string, SiteContent>>((acc, item) => {
    acc[item.section_key] = item
    return acc
  }, {})
}

export async function saveSiteContent(payload: SiteContentInput) {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        ...payload,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'section_key',
      },
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as SiteContent
}
