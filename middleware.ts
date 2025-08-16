import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/auth/login',
    '/auth/callback',
    '/auth/callback-client', 
    '/auth/process',
    '/auth/auth-code-error',
    '/login',
    '/setup',
    '/api'
  ]
  
  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Se é rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Para rotas protegidas, verificar cookies do Supabase
  const supabaseAccessToken = req.cookies.get('sb-jjsmoytzjhzdjxinhgen-auth-token')
  const hasSession = !!supabaseAccessToken
  
  // Rotas que requerem autenticação
  const protectedRoutes = ['/home', '/wods', '/create', '/profile', '/settings', '/messages', '/groups', '/challenges']
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Se é rota protegida e não tem sessão, redirecionar para login
  if (isProtectedRoute && !hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }
  
  // Rota raiz - redirecionar baseado no status
  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = hasSession ? '/home' : '/auth/login'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}