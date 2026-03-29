import { supabase } from '../lib/supabase'
import type { QuoteFormInput } from '../types'

const TABLE = 'quote_requests'

export async function submitQuoteRequest(payload: QuoteFormInput) {
  const { error } = await supabase.from(TABLE).insert({
    ...payload,
    created_at: new Date().toISOString(),
  })

  if (error) {
    throw error
  }
}
