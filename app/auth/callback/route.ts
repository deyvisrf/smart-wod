import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/home'

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        // Redirecionar para home após trocar o código com sucesso
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      } else {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
      }
    } catch (err) {
      console.error('Auth callback exception:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
    }
  }

  // Se não tem código, verificar se é implicit flow (token no hash)
  // Como não podemos ler o hash no servidor, redirecionamos para o cliente
  return NextResponse.redirect(`${requestUrl.origin}/auth/callback-client`)
}