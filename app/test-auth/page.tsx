'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClientSafe } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function TestAuthPage() {
  const { user, session, profile, loading } = useAuth();
  const [cookies, setCookies] = useState<string[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Checking...');

  useEffect(() => {
    // Verificar cookies do navegador
    const allCookies = document.cookie.split(';').map(cookie => cookie.trim());
    setCookies(allCookies);

    // Verificar status do Supabase
    const supabase = getSupabaseClientSafe();
    if (supabase) {
      setSupabaseStatus('✅ Available');
    } else {
      setSupabaseStatus('❌ Not available');
    }
  }, []);

  const testLogin = async () => {
    const supabase = getSupabaseClientSafe();
    if (!supabase) return;

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Login error:', error);
        alert(`Erro no login: ${error.message}`);
      } else {
        console.log('Login initiated:', data);
      }
    } catch (error) {
      console.error('Login exception:', error);
      alert(`Exceção no login: ${error}`);
    }
  };

  const testSession = async () => {
    const supabase = getSupabaseClientSafe();
    if (!supabase) return;

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        alert(`Erro na sessão: ${error.message}`);
      } else {
        console.log('Session data:', data);
        alert(`Sessão: ${data.session ? 'Ativa' : 'Inativa'}`);
      }
    } catch (error) {
      console.error('Session exception:', error);
      alert(`Exceção na sessão: ${error}`);
    }
  };

  const goToHome = () => {
    window.location.href = '/home';
  };

  const goToLogin = () => {
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Teste de Autenticação</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Geral */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Status Geral</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Supabase Client:</span>
                <span className={supabaseStatus.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {supabaseStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">AuthContext Loading:</span>
                <span className={loading ? 'text-yellow-600' : 'text-green-600'}>
                  {loading ? '⏳ Carregando...' : '✅ Pronto'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Usuário:</span>
                <span className={user ? 'text-green-600' : 'text-gray-500'}>
                  {user ? `✅ ${user.email}` : '❌ Não logado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sessão:</span>
                <span className={session ? 'text-green-600' : 'text-gray-500'}>
                  {session ? '✅ Ativa' : '❌ Inativa'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Perfil:</span>
                <span className={profile ? 'text-green-600' : 'text-gray-500'}>
                  {profile ? `✅ ${profile.name}` : '❌ Não criado'}
                </span>
              </div>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🍪 Cookies do Navegador</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {cookies.length > 0 ? (
                cookies.map((cookie, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    <span className="font-mono">{cookie}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Nenhum cookie encontrado</p>
              )}
            </div>
          </div>

          {/* Ações de Teste */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🧪 Ações de Teste</h2>
            <div className="space-y-3">
              <button
                onClick={testLogin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                🔐 Testar Login Google
              </button>
              <button
                onClick={testSession}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                📋 Verificar Sessão
              </button>
              <button
                onClick={goToHome}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
              >
                🏠 Ir para Home
              </button>
              <button
                onClick={goToLogin}
                className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
              >
                🔑 Ir para Login
              </button>
            </div>
          </div>

          {/* Informações da Sessão */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📋 Detalhes da Sessão</h2>
            <div className="space-y-3">
              {session ? (
                <div className="text-sm space-y-2">
                  <div><strong>User ID:</strong> {session.user.id}</div>
                  <div><strong>Email:</strong> {session.user.email}</div>
                  <div><strong>Provider:</strong> {session.user.app_metadata?.provider}</div>
                  <div><strong>Created:</strong> {new Date(session.user.created_at).toLocaleString()}</div>
                  <div><strong>Expires:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</div>
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma sessão ativa</p>
              )}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">📝 Logs do Console</h2>
          <p className="text-gray-600 mb-4">
            Abra o DevTools (F12) e veja os logs no console para mais detalhes.
          </p>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
            <div>// Verifique o console do navegador para logs detalhados</div>
            <div>// Procure por mensagens de erro ou sucesso</div>
            <div>// Verifique se há erros de CORS ou rede</div>
          </div>
        </div>

        {/* Instruções */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">📋 Instruções de Teste</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Clique em "Testar Login Google" para iniciar o processo de login</li>
            <li>Complete o login no Google</li>
            <li>Verifique se é redirecionado para /home</li>
            <li>Se não funcionar, verifique os logs no console</li>
            <li>Teste "Verificar Sessão" para confirmar o status</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
