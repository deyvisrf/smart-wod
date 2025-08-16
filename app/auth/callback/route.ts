import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'

  console.log('Auth callback received:', { code: !!code, next })

  if (code) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Missing Supabase environment variables')
        return NextResponse.redirect(`${origin}/auth/auth-code-error`)
      }

      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        console.log('Auth callback successful, redirecting to:', next)
        return NextResponse.redirect(`${origin}${next}`)
      } else {
        console.error('Auth callback error:', error)
      }
    } catch (err) {
      console.error('Auth callback exception:', err)
    }
  }

  // Return the user to an error page with instructions
  console.log('Auth callback failed, redirecting to error page')
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
