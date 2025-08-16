'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClientSafe } from '@/lib/supabase';

export default function CallbackClient() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseClientSafe();
      
      if (!supabase) {
        console.error('Supabase client not available');
        router.push('/auth/auth-code-error');
        return;
      }

      // Obter o hash da URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      console.log('Callback client - checking tokens:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken,
        url: window.location.href 
      });

      if (accessToken && refreshToken) {
        try {
          // Definir a sessão manualmente com os tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) throw error;

          console.log('Session set successfully:', data);
          
          // Aguardar um momento para garantir que a sessão foi salva
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Usar replace em vez de push para evitar problemas de histórico
          window.location.href = '/home';
        } catch (error) {
          console.error('Error setting session:', error);
          router.push('/auth/auth-code-error');
        }
      } else {
        // Verificar se já tem sessão (pode ter vindo de outro fluxo)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Session already exists, redirecting to home');
          window.location.href = '/home';
        } else {
          console.error('No tokens found in URL');
          router.push('/auth/auth-code-error');
        }
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  );
}

