'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClientSafe } from '@/lib/supabase';

export default function TestSession() {
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = getSupabaseClientSafe();
      
      if (!supabase) {
        setSessionInfo({ error: 'Supabase not configured' });
        setLoading(false);
        return;
      }

      try {
        // Verificar sessão
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Verificar usuário
        const { data: { user } } = await supabase.auth.getUser();

        // Verificar cookies
        const cookies = document.cookie.split(';').map(c => c.trim());
        const supabaseCookies = cookies.filter(c => c.includes('sb-'));

        setSessionInfo({
          session: session ? {
            user: session.user.email,
            provider: session.user.app_metadata?.provider,
            createdAt: session.user.created_at,
            expiresAt: new Date(session.expires_at! * 1000).toLocaleString(),
          } : null,
          user: user ? {
            email: user.email,
            id: user.id,
            provider: user.app_metadata?.provider,
          } : null,
          cookies: supabaseCookies,
          error: error?.message,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        });
      } catch (err: any) {
        setSessionInfo({ error: err.message });
      } finally {
        setLoading(false);
      }
    };

    checkSession();
    
    // Verificar a cada 2 segundos
    const interval = setInterval(checkSession, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClearSession = async () => {
    const supabase = getSupabaseClientSafe();
    if (supabase) {
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  const handleTestLogin = () => {
    window.location.href = '/auth/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔍 Teste de Sessão Supabase
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Status da Sessão: {sessionInfo?.session ? '✅ Ativa' : '❌ Inativa'}
          </h2>
          
          <div className="space-y-4">
            {sessionInfo?.session ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Sessão Encontrada:</h3>
                <pre className="text-xs text-green-700 overflow-auto">
                  {JSON.stringify(sessionInfo.session, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Nenhuma Sessão Ativa</h3>
                <p className="text-sm text-red-600">
                  Você não está autenticado. Faça login para criar uma sessão.
                </p>
              </div>
            )}

            {sessionInfo?.user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Usuário:</h3>
                <pre className="text-xs text-blue-700 overflow-auto">
                  {JSON.stringify(sessionInfo.user, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Cookies Supabase:</h3>
              {sessionInfo?.cookies?.length > 0 ? (
                <ul className="text-xs text-gray-600 space-y-1">
                  {sessionInfo.cookies.map((cookie: string, i: number) => (
                    <li key={i} className="font-mono break-all">
                      {cookie.substring(0, 50)}...
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nenhum cookie Supabase encontrado</p>
              )}
            </div>

            {sessionInfo?.error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Erro:</h3>
                <p className="text-sm text-yellow-700">{sessionInfo.error}</p>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Configuração:</h3>
              <p className="text-xs text-gray-600">
                Supabase URL: {sessionInfo?.supabaseUrl || 'Não configurado'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleTestLogin}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ir para Login
          </button>
          
          {sessionInfo?.session && (
            <button
              onClick={handleClearSession}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Limpar Sessão
            </button>
          )}
          
          <button
            onClick={() => window.location.href = '/home'}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Tentar acessar Home
          </button>
        </div>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">📝 Instruções:</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Esta página verifica automaticamente a sessão a cada 2 segundos</li>
            <li>Se você fizer login em outra aba, verá a sessão aparecer aqui</li>
            <li>Use os botões para testar diferentes cenários</li>
            <li>Verifique o console do navegador (F12) para mais detalhes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
