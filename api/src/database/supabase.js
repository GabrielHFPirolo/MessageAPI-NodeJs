import {createClient} from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase env vars not set');
}

<<<<<<< HEAD
export const supabaseAnon  = createClient (
  supabaseUrl,
  supabaseKey
)

export const supabaseService = createClient (
  supabaseUrl,
  supabaseKey
=======
export const supabase = createClient (
    supabaseUrl,
    supabaseKey
>>>>>>> 34c235853d7b814ea50a75510e1625ad6ee1d0e4
)
