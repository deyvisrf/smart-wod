'use client';

import { useState, useEffect } from 'react';

export default function SetupPage() {
  const [status, setStatus] = useState<'checking' | 'missing' | 'configured'>('checking');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  useEffect(() => {
    // Check if environment variables are set
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (url && key && url !== 'https://seu-projeto.supabase.co') {
      setStatus('configured');
      setSupabaseUrl(url);
      setSupabaseKey(key.substring(0, 20) + '...');
    } else {
      setStatus('missing');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuração do SmartWod
          </h1>
          <p className="text-gray-600 mb-8">
            Status da configuração do Supabase para autenticação
          </p>

          {status === 'checking' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verificando configuração...</p>
            </div>
          )}

          {status === 'missing' && (
            <div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Supabase não está configurado
                    </h3>
                    <p className="mt-2 text-sm text-red-700">
                      As variáveis de ambiente do Supabase não foram encontradas. 
                      Por isso o login com Google está travando na tela de "Carregando...".
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Como configurar:
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        1. Crie uma conta no Supabase
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Acesse <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 underline">supabase.com</a> e crie uma conta gratuita.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        2. Crie um novo projeto
                      </h3>
                      <p className="text-sm text-gray-600">
                        No dashboard do Supabase, clique em "New Project" e preencha as informações.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        3. Configure o Google OAuth
                      </h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>No painel do Supabase:</p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                          <li>Vá em <strong>Authentication → Providers</strong></li>
                          <li>Ative o <strong>Google</strong></li>
                          <li>Configure o Google OAuth seguindo as instruções</li>
                          <li>Em <strong>Site URL</strong>, coloque: <code className="bg-gray-200 px-1 rounded">http://localhost:3000</code></li>
                          <li>Em <strong>Redirect URLs</strong>, adicione: <code className="bg-gray-200 px-1 rounded">http://localhost:3000/auth/callback</code></li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        4. Copie as credenciais
                      </h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>No Supabase, vá em <strong>Settings → API</strong> e copie:</p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                          <li><strong>Project URL</strong> (sua URL do Supabase)</li>
                          <li><strong>anon public</strong> key (sua chave pública)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        5. Crie o arquivo .env.local
                      </h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>Na raiz do projeto (pasta <code className="bg-gray-200 px-1 rounded">smart-wod</code>), crie um arquivo chamado <code className="bg-gray-200 px-1 rounded">.env.local</code> com:</p>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-2 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui`}
                        </pre>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        6. Reinicie o servidor
                      </h3>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>Pare o servidor (Ctrl+C) e reinicie:</p>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg mt-2">
{`npm run dev`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Alternativa: Use o login mockado
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enquanto não configura o Supabase, você pode usar a página de login sem autenticação real:
                  </p>
                  <a 
                    href="/login" 
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Ir para Login Mockado
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {status === 'configured' && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Supabase configurado!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>URL: {supabaseUrl}</p>
                      <p>Key: {supabaseKey}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a 
                  href="/auth/login" 
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Ir para Login com Supabase
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a 
                  href="/login" 
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Login Mockado (sem auth)
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


