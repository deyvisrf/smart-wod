import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Tentar obter token do cookie
  const token = req.cookies.get('sb-access-token')?.value
  const hasSession = !!token

  // Lista de rotas que requerem autenticação
  const protectedRoutes = ['/home', '/wods', '/create', '/profile', '/settings', '/messages', '/groups', '/challenges']
  
  // Lista de rotas de auth que usuários logados não devem acessar
  const authRoutes = ['/auth/login']

  const pathname = req.nextUrl.pathname

  // Se usuário está logado e tenta acessar rota de auth, redireciona para home
  if (hasSession && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // Se usuário não está logado e tenta acessar rota protegida, redireciona para login
  if (!hasSession && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
