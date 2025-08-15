'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

type UserProfile = {
  name: string;
  bio: string;
  location: string;
  joinedAt: string;
  avatar?: string;
  followers: number;
  following: number;
  wods: number;
};

type UserStats = {
  totalWorkouts: number;
  favoriteStyle: string;
  weeklyGoal: number;
  currentStreak: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Deyvis Ferreira',
    bio: 'Apaixonado por CrossFit e vida saudável. Sempre em busca de novos desafios!',
    location: 'São Paulo, SP',
    joinedAt: '2023-01-15',
    followers: 127,
    following: 89,
    wods: 45,
  });
  const [stats, setStats] = useState<UserStats>({
    totalWorkouts: 156,
    favoriteStyle: 'AMRAP',
    weeklyGoal: 5,
    currentStreak: 12,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('isLoggedIn');
      if (v !== '1') router.replace('/login');
      
      const p = localStorage.getItem('isPremium');
      setIsPremium(p === '1');
      
      // Carrega perfil salvo
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setEditForm(parsed);
      }
      
      // Carrega stats salvos
      const savedStats = localStorage.getItem('userStats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch {
      router.replace('/login');
    }
  }, [router]);

  const saveProfile = () => {
    setProfile(editForm);
    localStorage.setItem('userProfile', JSON.stringify(editForm));
    setIsEditing(false);
    window.dispatchEvent(new CustomEvent('toast:show', { 
      detail: { message: 'Perfil atualizado!', variant: 'success' } 
    }));
  };

  const cancelEdit = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setEditForm({ ...editForm, avatar: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />
      
      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header do perfil */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-purple-200">
                    <span className="text-white font-bold text-2xl">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                    <i className="ri-camera-line text-white text-sm"></i>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarUpload(e.target.files)}
                    />
                  </label>
                )}
              </div>

              {/* Info do perfil */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    {isEditing ? (
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="text-2xl font-bold text-gray-900 border-b border-gray-200 focus:outline-none focus:border-purple-500 bg-transparent"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <i className="ri-map-pin-line text-gray-500"></i>
                      {isEditing ? (
                        <input
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          className="text-sm text-gray-600 border-b border-gray-200 focus:outline-none focus:border-purple-500 bg-transparent"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{profile.location}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <i className="ri-calendar-line text-gray-500"></i>
                      <span className="text-sm text-gray-600">
                        Membro desde {new Date(profile.joinedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {isPremium && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                          <i className="ri-vip-crown-line"></i>
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                      >
                        Editar Perfil
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={saveProfile}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                  {isEditing ? (
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={3}
                      className="w-full text-gray-700 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">{profile.bio}</p>
                  )}
                </div>

                {/* Stats sociais */}
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="font-bold text-purple-600 text-lg">{profile.followers}</p>
                    <p className="text-gray-500 text-sm">Seguidores</p>
                  </div>
                  <div>
                    <p className="font-bold text-purple-600 text-lg">{profile.following}</p>
                    <p className="text-gray-500 text-sm">Seguindo</p>
                  </div>
                  <div>
                    <p className="font-bold text-purple-600 text-lg">{profile.wods}</p>
                    <p className="text-gray-500 text-sm">WODs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas de treino */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-trophy-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{stats.totalWorkouts}</p>
                  <p className="text-gray-500 text-sm">Total de Treinos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-heart-pulse-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{stats.favoriteStyle}</p>
                  <p className="text-gray-500 text-sm">Estilo Favorito</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="ri-target-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{stats.weeklyGoal}</p>
                  <p className="text-gray-500 text-sm">Meta Semanal</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <i className="ri-fire-line text-orange-600 text-xl"></i>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{stats.currentStreak}</p>
                  <p className="text-gray-500 text-sm">Sequência Atual</p>
                </div>
              </div>
            </div>
          </div>

          {/* Atividade recente */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-green-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Completou WOD "Cardio Explosivo"</p>
                  <p className="text-sm text-gray-500">Há 2 horas</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-share-line text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Compartilhou um WOD no feed</p>
                  <p className="text-sm text-gray-500">Há 1 dia</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-add-line text-purple-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Começou a seguir Maria Santos</p>
                  <p className="text-sm text-gray-500">Há 3 dias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
