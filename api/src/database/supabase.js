import {createClient} from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase env vars not set');
}

export const supabaseAnon  = createClient (
  supabaseUrl,
  supabaseKey
)

export const supabaseService = createClient (
  supabaseUrl,
  supabaseKey
)
