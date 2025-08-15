'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';

type Group = { id: string; name: string; description?: string; createdAt: string; members: number };

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('isLoggedIn');
      if (v !== '1') router.replace('/login');
      const p = localStorage.getItem('isPremium');
      setIsPremium(p === '1');
    } catch {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('groups') || '[]') as Group[];
      setGroups(stored);
    } catch {
      setGroups([]);
    }
  }, []);

  const createGroup = () => {
    if (!isPremium) {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Recurso premium: ative no menu do perfil.', variant: 'info' } }));
      return;
    }
    if (!name.trim()) return;
    const g: Group = { id: Date.now().toString(), name, description, createdAt: new Date().toISOString(), members: 1 };
    const next = [g, ...groups];
    setGroups(next);
    localStorage.setItem('groups', JSON.stringify(next));
    setName('');
    setDescription('');
  };

  const removeGroup = (id: string) => {
    const next = groups.filter((g) => g.id !== id);
    setGroups(next);
    localStorage.setItem('groups', JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />
      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h1 className="text-xl font-bold text-gray-900">Grupos</h1>
            <p className="text-sm text-gray-600">Crie e participe de grupos de treino</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Criar grupo</h2>
              {!isPremium && <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Premium</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2" />
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 sm:col-span-2" />
              <button onClick={createGroup} className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 font-medium">Criar</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold mb-3">Meus grupos</h2>
            {groups.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum grupo ainda.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groups.map((g) => (
                  <div key={g.id} className="p-4 rounded-xl border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{g.name}</h3>
                        {g.description && <p className="text-sm text-gray-600">{g.description}</p>}
                        <p className="text-xs text-gray-500 mt-1">Criado em {new Date(g.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <button onClick={() => removeGroup(g.id)} className="text-red-600 hover:bg-red-50 rounded-lg p-2"><i className="ri-delete-bin-line" /></button>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">Membros: {g.members}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


