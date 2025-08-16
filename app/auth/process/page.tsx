'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClientSafe } from '@/lib/supabase';

export default function ProcessAuth() {
  const router = useRouter();

  useEffect(() => {
    const processAuth = async () => {
      const supabase = getSupabaseClientSafe();
      
      if (!supabase) {
        console.error('Supabase not available');
        return;
      }

      // Verificar se tem sessão
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('Process auth - session check:', { 
        hasSession: !!session, 
        error,
        user: session?.user?.email 
      });

      if (session) {
        // Tem sessão, redirecionar para home
        console.log('User authenticated, redirecting to home...');
        router.replace('/home');
      } else {
        // Não tem sessão, voltar para login
        console.log('No session found, redirecting to login...');
        router.replace('/auth/login');
      }
    };

    // Aguardar um momento para garantir que tudo está carregado
    setTimeout(processAuth, 100);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Verificando autenticação...
        </h2>
        <p className="text-gray-600 text-sm">
          Aguarde enquanto processamos seu login
        </p>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">
            Se esta tela não mudar em alguns segundos, 
            <a href="/auth/login" className="text-purple-600 hover:text-purple-700 ml-1">
              clique aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
