'use client';

import { useState } from 'react';
import { generateWodAction } from '../app/create/actions';
import type { GeneratedWod } from '../app/create/actions';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateWorkoutModal({ open, onClose }: Props) {
  const equipmentOptions = [
    'Livre',
    'Kettlebell',
    'Dumbbell',
    'Barra Olímpica',
    'Anilhas',
    'Caixa (Plyo Box)',
    'Corda Naval',
    'Corda de Pular',
    'Remo (Erg)',
    'Bike',
    'Wall Ball',
    'Anel Ginástico',
    'Barra Fixa',
    'Elástico',
    'Abmat',
  ];

  const [form, setForm] = useState({
    level: 'Iniciante',
    goal: 'Condicionamento',
    equipment: ['Livre'] as string[],
    duration: 30,
    style: 'AMRAP' as 'AMRAP' | 'EMOM' | 'For Time' | 'Chipper',
    preset: 'RX' as 'RX' | 'Scaled',
    includeLoads: true,
    prompt: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [quickType, setQuickType] = useState<
    'surprise' | 'quickMinimal' | 'endurance' | 'beginners' | null
  >(null);
  const [wod, setWod] = useState<GeneratedWod | null>(null);

  if (!open) return null;

  const runQuick = async (
    type: 'surprise' | 'quickMinimal' | 'endurance' | 'beginners',
  ) => {
    setStatus('loading');
    setQuickType(type);
    setWod(null);
    try {
      const base = {
        level: form.level,
        goal: form.goal,
        equipment: form.equipment,
        duration: Number(form.duration) || 30,
        style: form.style,
        preset: form.preset,
        includeLoads: form.includeLoads,
        prompt: form.prompt,
      };
      let input = base;
      if (type === 'surprise') {
        input = {
          ...base,
          goal: 'Surpresa do dia',
          prompt:
            'WOD surpresa para hoje. Varie estímulos, use terminologia CrossFit e mantenha instruções objetivas. Evite explicações longas.',
        };
      } else if (type === 'quickMinimal') {
        input = {
          ...base,
          goal: 'Treino rápido',
          equipment: ['Livre'],
          duration: Math.min(20, base.duration),
          style: 'AMRAP',
          prompt:
            'Treino rápido (10-20 min) com equipamento mínimo (idealmente apenas peso corporal). Alta densidade e transições fáceis.',
        };
      } else if (type === 'endurance') {
        input = {
          ...base,
          goal: 'Resistência',
          duration: Math.max(30, base.duration),
          style: 'For Time',
          prompt:
            'WOD focado em resistência aeróbica e muscular. Volume contínuo, pace sustentável, movimentos cíclicos.',
        };
      } else if (type === 'beginners') {
        input = {
          ...base,
          level: 'Iniciante',
          goal: 'Movimentos básicos',
          equipment: ['Livre'],
          style: 'EMOM',
          prompt:
            'WOD para iniciantes com movimentos básicos e baixo impacto. Ênfase em técnica e consistência.',
        };
      }
      const result = await generateWodAction(input);
      setWod(result);
    } finally {
      setStatus('idle');
      setQuickType(null);
    }
  };

  // Tela simplificada: geração rápida apenas pelos botões acima

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center overflow-auto pt-20 pb-10 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 relative">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Criar Treino</h2>
            <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-gray-100">
              <i className="ri-close-line text-xl text-gray-600" />
            </button>
          </div>

          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => runQuick('surprise')}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={status !== 'idle'}
              >
                {quickType === 'surprise' && status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Gerando…
                  </span>
                ) : (
                  'WOD surpresa para hoje?'
                )}
              </button>
              <button
                type="button"
                onClick={() => runQuick('quickMinimal')}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={status !== 'idle'}
              >
                {quickType === 'quickMinimal' && status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Gerando…
                  </span>
                ) : (
                  'Treino rápido com equipamento mínimo'
                )}
              </button>
              <button
                type="button"
                onClick={() => runQuick('endurance')}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={status !== 'idle'}
              >
                {quickType === 'endurance' && status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Gerando…
                  </span>
                ) : (
                  'WOD para desenvolver resistência'
                )}
              </button>
              <button
                type="button"
                onClick={() => runQuick('beginners')}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={status !== 'idle'}
              >
                {quickType === 'beginners' && status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                    Gerando…
                  </span>
                ) : (
                  'WOD para iniciantes (movimentos básicos)'
                )}
              </button>
            </div>
            {status === 'loading' && (
              <div className="mb-4 rounded-xl border border-purple-200 bg-purple-50 p-3 text-sm text-purple-700 flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-purple-600 border-r-transparent" />
                Gerando seu WOD…
              </div>
            )}
            {/* Formulário removido: geração apenas pelos atalhos acima */}

            {wod && (
              <section className="mt-6 bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">{wod.title}</h3>
                  {wod.durationMinutes ? (
                    <span className="text-sm text-gray-600">{wod.durationMinutes} min</span>
                  ) : null}
                </div>
                <p className="text-sm text-gray-500 mb-1">Nível: {wod.level}</p>
                {(wod.modelUsed || wod.source) && (
                  <p className="text-xs text-gray-400 mb-3">Fonte: {wod.source} {wod.modelUsed ? `(modelo: ${wod.modelUsed})` : ''}</p>
                )}
                <div className="mb-4 flex flex-wrap gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${wod.title} - ${wod.main?.title ?? ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-white text-sm shadow-md hover:from-green-600 hover:to-emerald-600"
                  >
                    <i className="ri-whatsapp-line" /> Whatsapp
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        const stored = JSON.parse(localStorage.getItem('my_feed_posts') || '[]');
                        const post = {
                          id: Date.now(),
                          title: wod.title,
                          level: wod.level,
                          warmup: wod.warmup,
                          main: wod.main,
                          cooldown: wod.cooldown,
                          createdAt: new Date().toISOString(),
                        };
                        stored.unshift(post);
                        localStorage.setItem('my_feed_posts', JSON.stringify(stored));
                        window.dispatchEvent(new Event('wod:shared'));
                        window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'WOD compartilhado no seu feed!', variant: 'success' } }));
                        try { window.location.href = '/home'; } catch {}
                        onClose();
                      } catch {
                        window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Não foi possível compartilhar no feed.', variant: 'error' } }));
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-white text-sm shadow-md hover:from-purple-600 hover:to-pink-600"
                  >
                    <i className="ri-share-forward-line" /> Meu feed
                  </button>
                </div>
                {Array.isArray(wod.loadRecommendations) && wod.loadRecommendations.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-1">Cargas sugeridas</h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {wod.loadRecommendations.map((it, i) => {
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
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-1">{wod.warmup.title}</h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {wod.warmup.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {wod.main && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-1">{wod.main.title}</h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {wod.main.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {wod.cooldown && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-1">{wod.cooldown.title}</h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                      {wod.cooldown.items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {wod.notes && <p className="text-sm text-gray-600">{wod.notes}</p>}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


