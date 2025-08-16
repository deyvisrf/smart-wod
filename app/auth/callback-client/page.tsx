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
        window.location.href = '/auth/login';
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
          
          // Redirecionar imediatamente para home
          window.location.replace('/home');
          return;
        } catch (error) {
          console.error('Error setting session:', error);
          window.location.href = '/auth/login';
          return;
        }
      }

      // Se não tem tokens, verificar se já tem sessão
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Session already exists, redirecting to home');
          window.location.replace('/home');
        } else {
          console.log('No tokens or session found, redirecting to login');
          window.location.href = '/auth/login';
        }
      } catch (error) {
        console.error('Error checking session:', error);
        window.location.href = '/auth/login';
      }
    };

    // Executar imediatamente
    handleCallback();
  }, [router]);

  // Não renderizar nada para evitar "piscar" a tela
  return null;
}