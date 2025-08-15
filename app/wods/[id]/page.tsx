'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';

type SavedWod = {
  id: string;
  title: string;
  warmup?: { title: string; items: string[] };
  main?: { title: string; items: string[] };
  cooldown?: { title: string; items: string[] };
  notes?: string;
  createdAt: string;
  equipment?: string[];
  style?: string;
  preset?: string;
  loadRecommendations?: any;
  media?: string[]; // data URLs
};

export default function WodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => String(params?.id ?? ''), [params]);
  const [wod, setWod] = useState<SavedWod | null>(null);
  const [media, setMedia] = useState<string[]>([]);

  useEffect(() => {
    try {
      const v = localStorage.getItem('isLoggedIn');
      if (v !== '1') router.replace('/login');
    } catch {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('saved_wods') || '[]') as SavedWod[];
      const found = all.find((w) => String(w.id) === id) || null;
      setWod(found);
      setMedia(found?.media ?? []);
    } catch {
      setWod(null);
      setMedia([]);
    }
  }, [id]);

  const persistMedia = (nextMedia: string[]) => {
    try {
      const all = JSON.parse(localStorage.getItem('saved_wods') || '[]') as SavedWod[];
      const idx = all.findIndex((w) => String(w.id) === id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], media: nextMedia };
        localStorage.setItem('saved_wods', JSON.stringify(all));
      }
    } catch {}
  };

  const onAddMedia = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve) => {
          const fr = new FileReader();
          fr.onload = () => resolve(String(fr.result));
          fr.readAsDataURL(file);
        })
    );
    const dataUrls = await Promise.all(readers);
    const next = [...media, ...dataUrls];
    setMedia(next);
    persistMedia(next);
  };

  const removeMedia = (idx: number) => {
    const next = media.filter((_, i) => i !== idx);
    setMedia(next);
    persistMedia(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />
      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {!wod ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <p className="text-gray-600">WOD não encontrado.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{wod.title}</h1>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <i className="ri-calendar-line"></i>
                    <span>{new Date(wod.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); router.back(); }}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    Voltar
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {wod.style && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{wod.style}</span>
                )}
                {wod.preset && (
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">{wod.preset}</span>
                )}
                {wod.equipment?.map((eq, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{eq}</span>
                ))}
              </div>

              {Array.isArray(wod.loadRecommendations) && wod.loadRecommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-1">Cargas sugeridas</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    {wod.loadRecommendations.map((it: any, i: number) => {
                      if (typeof it === 'string') return <li key={i}>{it}</li>;
                      const parts = [
                        it.movement,
                        it.rxLoad ? `RX: ${it.rxLoad}` : undefined,
                        it.scaleLoad ? `Scaled: ${it.scaleLoad}` : undefined,
                        it.male || it.female ? `M/F: ${it.male ?? '-'} / ${it.female ?? '-'}` : undefined,
                        it.load,
                        it.notes ? `(${it.notes})` : undefined,
                      ].filter(Boolean);
                      return <li key={i}>{parts.join(' - ')}</li>;
                    })}
                  </ul>
                </div>
              )}

              {wod.warmup && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-1">{wod.warmup.title}</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    {wod.warmup.items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </div>
              )}

              {wod.main && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-1">{wod.main.title}</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    {wod.main.items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </div>
              )}

              {wod.cooldown && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-1">{wod.cooldown.title}</h3>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    {wod.cooldown.items.map((it, i) => <li key={i}>{it}</li>)}
                  </ul>
                </div>
              )}

              {wod.notes && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Observações</h3>
                  <p className="text-gray-700 text-sm">{wod.notes}</p>
                </div>
              )}

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Mídia</h3>
                  <label className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 cursor-pointer">
                    <i className="ri-upload-2-line" />
                    <span>Adicionar imagens</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => onAddMedia(e.target.files)}
                    />
                  </label>
                </div>
                {media.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma imagem adicionada.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {media.map((src, i) => (
                      <div key={i} className="relative group">
                        <img src={src} alt={`media-${i}`} className="w-full h-32 object-cover rounded-xl border border-gray-100" />
                        <button
                          onClick={() => removeMedia(i)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remover"
                        >
                          <i className="ri-close-line" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


