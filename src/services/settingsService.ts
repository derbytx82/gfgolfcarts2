import { supabase } from '../lib/supabase'
import type { SiteSettings, SiteSettingsInput } from '../types'

const TABLE = 'site_settings'

export async function getSiteSettings() {
  const { data, error } = await supabase.from(TABLE).select('*').order('updated_at', { ascending: false }).limit(1)

  if (error) {
    throw error
  }

  return ((data ?? [])[0] as SiteSettings | undefined) ?? null
}

export async function saveSiteSettings(payload: SiteSettingsInput) {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      {
        ...payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as SiteSettings
}
