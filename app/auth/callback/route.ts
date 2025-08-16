import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/home'

  console.log('Auth callback received:', { 
    code: !!code, 
    next,
    url: request.url 
  })

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        console.log('Auth callback successful, redirecting to:', next)
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      } else {
        console.error('Auth callback error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
      }
    } catch (err) {
      console.error('Auth callback exception:', err)
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
    }
  }

  // Se não tem code mas pode ter token no hash (implicit flow)
  // Redireciona para uma página client-side que pode processar o hash
  console.log('No code in callback, checking for implicit flow')
  return NextResponse.redirect(`${requestUrl.origin}/auth/callback-client`)
}