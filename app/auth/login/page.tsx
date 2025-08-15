'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se usuário já está logado
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/home');
        return;
      }
      setLoading(false);
    };

    checkUser();

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          router.replace('/home');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-purple-50">
      {/* Background decor */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-pink-200/40 blur-3xl" />
      </div>

      <div className="relative mx-4 w-full max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur">
          {/* Left: form */}
          <div className="p-6 sm:p-10 min-h-[28rem]">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-md">
                <i className="ri-dumbbell-fill text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">SmartWod</h1>
                <p className="text-xs text-gray-500">Crie treinos completos de CROSSFIT forma rápida e inteligente.</p>
              </div>
            </div>

            <div className="supabase-auth-container">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#8b5cf6',
                        brandAccent: '#7c3aed',
                        brandButtonText: 'white',
                        defaultButtonBackground: '#f3f4f6',
                        defaultButtonBackgroundHover: '#e5e7eb',
                        inputBackground: '#f9fafb',
                        inputBorder: '#e5e7eb',
                        inputBorderHover: '#d1d5db',
                        inputBorderFocus: '#8b5cf6',
                      },
                      borderWidths: {
                        buttonBorderWidth: '1px',
                        inputBorderWidth: '1px',
                      },
                      radii: {
                        borderRadiusButton: '12px',
                        buttonBorderRadius: '12px',
                        inputBorderRadius: '12px',
                      },
                    },
                  },
                  className: {
                    container: 'supabase-auth-custom',
                    label: 'text-sm font-medium text-gray-700',
                    button: 'w-full rounded-xl py-2.5 font-semibold transition-all',
                    input: 'w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500',
                  },
                }}
                providers={['google', 'facebook']}
                redirectTo={`${window.location.origin}/auth/callback`}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'Email',
                      password_label: 'Senha',
                      button_label: 'Entrar',
                      loading_button_label: 'Entrando...',
                      social_provider_text: 'Entrar com {{provider}}',
                      link_text: 'Já tem uma conta? Entre aqui',
                    },
                    sign_up: {
                      email_label: 'Email',
                      password_label: 'Senha',
                      button_label: 'Criar conta',
                      loading_button_label: 'Criando conta...',
                      social_provider_text: 'Cadastrar com {{provider}}',
                      link_text: 'Não tem conta? Cadastre-se',
                      confirmation_text: 'Verifique seu email para confirmar a conta',
                    },
                    magic_link: {
                      email_input_label: 'Email',
                      button_label: 'Enviar link mágico',
                      loading_button_label: 'Enviando...',
                      link_text: 'Enviar um link mágico por email',
                      confirmation_text: 'Verifique seu email para o link de acesso',
                    },
                    forgotten_password: {
                      email_label: 'Email',
                      button_label: 'Enviar instruções',
                      loading_button_label: 'Enviando...',
                      link_text: 'Esqueceu sua senha?',
                      confirmation_text: 'Verifique seu email para redefinir a senha',
                    },
                    update_password: {
                      password_label: 'Nova senha',
                      password_input_placeholder: 'Nova senha',
                      button_label: 'Atualizar senha',
                      loading_button_label: 'Atualizando...',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Right: image panel */}
          <div className="relative hidden sm:block min-h-[28rem]">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-pink-500/20 to-pink-600/20"/>
            <Image
              src="/login-side.png"
              alt="Treino e condicionamento físico"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-500">
          Ao continuar, você concorda com nossos
          {' '}<a className="text-purple-600 hover:text-purple-700" href="#">Termos</a> e
          {' '}<a className="text-purple-600 hover:text-purple-700" href="#">Política de Privacidade</a>.
        </p>
      </div>

      <style jsx global>{`
        .supabase-auth-custom .supabase-auth-ui_ui-button {
          background: linear-gradient(to right, #8b5cf6, #ec4899) !important;
          color: white !important;
          border: none !important;
        }
        
        .supabase-auth-custom .supabase-auth-ui_ui-button:hover {
          background: linear-gradient(to right, #7c3aed, #db2777) !important;
        }
        
        .supabase-auth-custom .supabase-auth-ui_ui-divider {
          color: #6b7280 !important;
          font-size: 12px !important;
        }
        
        .supabase-auth-custom .supabase-auth-ui_ui-anchor {
          color: #8b5cf6 !important;
          font-weight: 500 !important;
        }
        
        .supabase-auth-custom .supabase-auth-ui_ui-anchor:hover {
          color: #7c3aed !important;
        }
      `}</style>
    </main>
  );
}
