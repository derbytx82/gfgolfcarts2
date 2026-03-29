import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder.placeholder.placeholder'

export const supabase = createClient(env.supabaseUrl || fallbackUrl, env.supabaseAnonKey || fallbackKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
