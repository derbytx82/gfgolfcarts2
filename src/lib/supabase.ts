import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const supabaseUrl = env.supabaseUrl
const supabaseAnonKey = env.supabaseAnonKey

// Validate before creating client to avoid crashing the whole app
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase environment variables are missing! ' +
    'Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env or Vercel dashboard.'
  )
}

// Create a safe client with empty strings as fallback to avoid throwing at module load time
export const supabase = createClient(
  supabaseUrl || 'https://missing.supabase.co', 
  supabaseAnonKey || 'missing-key', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
