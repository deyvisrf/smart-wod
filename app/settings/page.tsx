'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

type AppSettings = {
  notifications: {
    email: boolean;
    push: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    challenges: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showStats: boolean;
    allowMessages: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'pt' | 'en';
    units: 'metric' | 'imperial';
  };
};

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>({
    notifications: {
      email: true,
      push: true,
      likes: true,
      comments: true,
      follows: true,
      challenges: false,
    },
    privacy: {
      profilePublic: true,
      showStats: true,
      allowMessages: true,
    },
    preferences: {
      theme: 'light',
      language: 'pt',
      units: 'metric',
    },
  });

  useEffect(() => {
    try {
      const v = localStorage.getItem('isLoggedIn');
      if (v !== '1') router.replace('/login');
      
      // Carrega configurações salvas
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    window.dispatchEvent(new CustomEvent('toast:show', { 
      detail: { message: 'Configurações salvas!', variant: 'success' } 
    }));
  };

  const updateNotifications = (key: keyof AppSettings['notifications'], value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: { ...settings.notifications, [key]: value }
    };
    updateSettings(newSettings);
  };

  const updatePrivacy = (key: keyof AppSettings['privacy'], value: boolean) => {
    const newSettings = {
      ...settings,
      privacy: { ...settings.privacy, [key]: value }
    };
    updateSettings(newSettings);
  };

  const updatePreferences = (key: keyof AppSettings['preferences'], value: string) => {
    const newSettings = {
      ...settings,
      preferences: { ...settings.preferences, [key]: value }
    };
    updateSettings(newSettings);
  };

  const clearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      const keysToKeep = ['isLoggedIn', 'isPremium'];
      const storage = { ...localStorage };
      
      Object.keys(storage).forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      window.dispatchEvent(new CustomEvent('toast:show', { 
        detail: { message: 'Dados limpos com sucesso!', variant: 'success' } 
      }));
    }
  };

  const exportData = () => {
    const data = {
      profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
      stats: JSON.parse(localStorage.getItem('userStats') || '{}'),
      wods: JSON.parse(localStorage.getItem('saved_wods') || '[]'),
      groups: JSON.parse(localStorage.getItem('groups') || '[]'),
      challenges: JSON.parse(localStorage.getItem('challenges') || '[]'),
      messages: JSON.parse(localStorage.getItem('messages') || '[]'),
      settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartwod-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    window.dispatchEvent(new CustomEvent('toast:show', { 
      detail: { message: 'Dados exportados!', variant: 'success' } 
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />
      
      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
            <p className="text-gray-600">Gerencie suas preferências e privacidade</p>
          </div>

          <div className="space-y-6">
            {/* Notificações */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-notification-line text-purple-600"></i>
                Notificações
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Notificações por email</p>
                    <p className="text-sm text-gray-500">Receber atualizações por email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => updateNotifications('email', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Curtidas</p>
                    <p className="text-sm text-gray-500">Quando alguém curtir seus posts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.likes}
                      onChange={(e) => updateNotifications('likes', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Comentários</p>
                    <p className="text-sm text-gray-500">Quando alguém comentar seus posts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.comments}
                      onChange={(e) => updateNotifications('comments', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Novos seguidores</p>
                    <p className="text-sm text-gray-500">Quando alguém começar a te seguir</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.follows}
                      onChange={(e) => updateNotifications('follows', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Desafios</p>
                    <p className="text-sm text-gray-500">Convites para desafios e atualizações</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.challenges}
                      onChange={(e) => updateNotifications('challenges', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacidade */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-shield-user-line text-purple-600"></i>
                Privacidade
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Perfil público</p>
                    <p className="text-sm text-gray-500">Permitir que outros vejam seu perfil</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.profilePublic}
                      onChange={(e) => updatePrivacy('profilePublic', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Mostrar estatísticas</p>
                    <p className="text-sm text-gray-500">Exibir suas estatísticas de treino</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showStats}
                      onChange={(e) => updatePrivacy('showStats', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Permitir mensagens</p>
                    <p className="text-sm text-gray-500">Receber mensagens de outros usuários</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowMessages}
                      onChange={(e) => updatePrivacy('allowMessages', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Preferências */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-settings-3-line text-purple-600"></i>
                Preferências
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) => updatePreferences('theme', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="auto">Automático</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => updatePreferences('language', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unidades</label>
                  <select
                    value={settings.preferences.units}
                    onChange={(e) => updatePreferences('units', e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="metric">Métrico (kg, cm)</option>
                    <option value="imperial">Imperial (lbs, ft)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dados e Segurança */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="ri-database-line text-purple-600"></i>
                Dados e Segurança
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Exportar dados</p>
                    <p className="text-sm text-gray-500">Baixe uma cópia dos seus dados</p>
                  </div>
                  <button
                    onClick={exportData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Exportar
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <div>
                    <p className="font-medium text-red-900">Limpar todos os dados</p>
                    <p className="text-sm text-red-600">Remove todos os dados locais (irreversível)</p>
                  </div>
                  <button
                    onClick={clearData}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
