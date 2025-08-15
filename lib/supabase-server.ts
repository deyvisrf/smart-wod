import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './supabase'

// Client para componentes do servidor
export const createSupabaseServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}
