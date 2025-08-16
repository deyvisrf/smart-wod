'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FeedService } from '@/lib/social';

export default function TestFeedPage() {
  const { user, session, profile, loading } = useAuth();
  const [feedData, setFeedData] = useState<any[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const testFeed = async () => {
    if (!user) return;
    
    setFeedLoading(true);
    setFeedError(null);
    
    try {
      console.log('🧪 Testing getUserFeed for user:', user.id);
      const feed = await FeedService.getUserFeed(user.id);
      console.log('✅ Feed result:', feed);
      setFeedData(feed);
    } catch (error: any) {
      console.error('❌ Feed error:', error);
      setFeedError(error?.message || 'Erro desconhecido');
    } finally {
      setFeedLoading(false);
    }
  };

  const testPublicFeed = async () => {
    setFeedLoading(true);
    setFeedError(null);
    
    try {
      console.log('🧪 Testing getPublicFeed');
      const feed = await FeedService.getPublicFeed();
      console.log('✅ Public feed result:', feed);
      setFeedData(feed);
    } catch (error: any) {
      console.error('❌ Public feed error:', error);
      setFeedError(error?.message || 'Erro desconhecido');
    } finally {
      setFeedLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Teste do Feed</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status da Autenticação */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">🔐 Status da Autenticação</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Usuário:</span>
                <span className={user ? 'text-green-600' : 'text-red-600'}>
                  {user ? `✅ ${user.email}` : '❌ Não logado'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sessão:</span>
                <span className={session ? 'text-green-600' : 'text-red-600'}>
                  {session ? '✅ Ativa' : '❌ Inativa'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Perfil:</span>
                <span className={profile ? 'text-green-600' : 'text-red-600'}>
                  {profile ? `✅ ${profile.name}` : '❌ Não criado'}
                </span>
              </div>
            </div>
          </div>

          {/* Testes do Feed */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Testes do Feed</h2>
            <div className="space-y-3">
              <button
                onClick={testFeed}
                disabled={!user || feedLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {feedLoading ? '⏳ Testando...' : '🧪 Testar Feed do Usuário'}
              </button>
              
              <button
                onClick={testPublicFeed}
                disabled={feedLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {feedLoading ? '⏳ Testando...' : '🌐 Testar Feed Público'}
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">📋 Resultados dos Testes</h2>
            
            {feedError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="text-red-800 font-semibold">❌ Erro Encontrado:</h3>
                <p className="text-red-700">{feedError}</p>
              </div>
            )}

            {feedData.length > 0 ? (
              <div>
                <h3 className="text-green-800 font-semibold mb-3">✅ Feed Carregado com Sucesso!</h3>
                <p className="text-green-700 mb-3">
                  Total de WODs encontrados: <strong>{feedData.length}</strong>
                </p>
                <div className="space-y-2">
                  {feedData.slice(0, 3).map((wod, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border">
                      <div className="font-medium">{wod.title}</div>
                      <div className="text-sm text-gray-600">
                        Por: {wod.user?.name || 'Usuário'} • 
                        Likes: {wod.likes_count} • 
                        Comentários: {wod.comments_count}
                      </div>
                    </div>
                  ))}
                  {feedData.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      ... e mais {feedData.length - 3} WODs
                    </p>
                  )}
                </div>
              </div>
            ) : !feedLoading && !feedError ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-inbox-line text-2xl text-gray-400"></i>
                </div>
                <h3 className="text-gray-600 font-medium">Feed Vazio</h3>
                <p className="text-gray-500 text-sm">
                  {user ? 'Clique nos botões acima para testar o feed' : 'Faça login para testar o feed'}
                </p>
              </div>
            ) : null}

            {feedLoading && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Testando feed...</p>
              </div>
            )}
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">📋 Como Usar</h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Certifique-se de estar logado (ver status acima)</li>
              <li>Clique em "Testar Feed do Usuário" para verificar se funciona</li>
              <li>Clique em "Testar Feed Público" para verificar acesso público</li>
              <li>Verifique o console do navegador (F12) para logs detalhados</li>
              <li>Se der erro, verifique se as tabelas do Supabase existem</li>
            </ol>
            
            <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-300">
              <p className="text-blue-800 text-sm">
                <strong>💡 Dica:</strong> Se o feed estiver vazio mas sem erros, significa que está funcionando perfeitamente! 
                Uma aplicação nova naturalmente não tem conteúdo ainda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
