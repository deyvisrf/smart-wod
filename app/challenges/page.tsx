'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';

type Challenge = { id: string; title: string; goal: string; startsAt: string; endsAt: string; createdAt: string; participants: number };

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
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
      const stored = JSON.parse(localStorage.getItem('challenges') || '[]') as Challenge[];
      setChallenges(stored);
    } catch {
      setChallenges([]);
    }
  }, []);

  const createChallenge = () => {
    if (!isPremium) {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Recurso premium: ative no menu do perfil.', variant: 'info' } }));
      return;
    }
    if (!title.trim() || !goal.trim() || !startsAt || !endsAt) return;
    const c: Challenge = {
      id: Date.now().toString(),
      title,
      goal,
      startsAt,
      endsAt,
      createdAt: new Date().toISOString(),
      participants: 1,
    };
    const next = [c, ...challenges];
    setChallenges(next);
    localStorage.setItem('challenges', JSON.stringify(next));
    setTitle('');
    setGoal('');
    setStartsAt('');
    setEndsAt('');
  };

  const removeChallenge = (id: string) => {
    const next = challenges.filter((c) => c.id !== id);
    setChallenges(next);
    localStorage.setItem('challenges', JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />
      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h1 className="text-xl font-bold text-gray-900">Desafios</h1>
            <p className="text-sm text-gray-600">Crie desafios comunitários e convide amigos</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Criar desafio</h2>
              {!isPremium && <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Premium</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2" />
              <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Objetivo" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2" />
              <input value={startsAt} onChange={(e) => setStartsAt(e.target.value)} type="date" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2" />
              <input value={endsAt} onChange={(e) => setEndsAt(e.target.value)} type="date" className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2" />
              <button onClick={createChallenge} className="lg:col-span-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 font-medium">Criar</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold mb-3">Meus desafios</h2>
            {challenges.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum desafio ainda.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {challenges.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{c.title}</h3>
                        <p className="text-sm text-gray-600">{c.goal}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(c.startsAt).toLocaleDateString('pt-BR')} - {new Date(c.endsAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <button onClick={() => removeChallenge(c.id)} className="text-red-600 hover:bg-red-50 rounded-lg p-2"><i className="ri-delete-bin-line" /></button>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">Participantes: {c.participants}</div>
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


