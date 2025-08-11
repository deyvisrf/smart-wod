'use client';

import { useState } from 'react';
import type { GeneratedWod } from './actions';
import { generateWodAction } from './actions';

export default function CreateWorkoutPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setWod(null);
    try {
      const result = await generateWodAction({
        level: form.level,
        goal: form.goal,
        equipment: form.equipment,
        duration: Number(form.duration) || 30,
        style: form.style,
        preset: form.preset,
        includeLoads: form.includeLoads,
        prompt: form.prompt,
      });
      setWod(result);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24 pb-10 lg:ml-72">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar Treino</h1>

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

        {/* Formulário removido: utilize os atalhos acima para gerar WODs rapidamente */}

        {wod && (
          <section className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{wod.title}</h2>
              {wod.durationMinutes ? (
                <span className="text-sm text-gray-600">{wod.durationMinutes} min</span>
              ) : null}
            </div>
            <p className="text-sm text-gray-500 mb-1">Nível: {wod.level}</p>
            {(wod.modelUsed || wod.source) && (
              <p className="text-xs text-gray-400 mb-4">Fonte: {wod.source} {wod.modelUsed ? `(modelo: ${wod.modelUsed})` : ''}</p>
            )}
            {Array.isArray(wod.loadRecommendations) && wod.loadRecommendations.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">Cargas sugeridas</h3>
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
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">{wod.warmup.title}</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {wod.warmup.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            )}

            {wod.main && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">{wod.main.title}</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  {wod.main.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            )}

            {wod.cooldown && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-1">{wod.cooldown.title}</h3>
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
    </main>
  );
}


