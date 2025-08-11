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
  const [wod, setWod] = useState<GeneratedWod | null>(null);

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

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <option>Iniciante</option>
                <option>Intermediário</option>
                <option>Avançado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formato do treino</label>
              <select
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value as any })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <option>AMRAP</option>
                <option>EMOM</option>
                <option>For Time</option>
                <option>Chipper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preset</label>
              <select
                value={form.preset}
                onChange={(e) => setForm({ ...form, preset: e.target.value as any })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <option>RX</option>
                <option>Scaled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
              <input
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
                placeholder="Força, Condicionamento, HIIT, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipamentos disponíveis</label>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 max-h-40 overflow-auto">
                {equipmentOptions.map((opt) => {
                  const checked = form.equipment.includes(opt);
                  return (
                    <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setForm((prev) => {
                            const next = new Set(prev.equipment);
                            if (e.target.checked) next.add(opt);
                            else next.delete(opt);
                            return { ...prev, equipment: Array.from(next) };
                          });
                        }}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração (min)</label>
              <input
                type="number"
                min={10}
                max={120}
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="includeLoads"
                type="checkbox"
                checked={form.includeLoads}
                onChange={(e) => setForm({ ...form, includeLoads: e.target.checked })}
              />
              <label htmlFor="includeLoads" className="text-sm text-gray-700">Incluir recomendações de carga (M/F)</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instruções adicionais (opcional)</label>
            <textarea
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2"
              placeholder="Ex.: Priorizar técnica, evitar saltos, sem barra, foco em core…"
            />
          </div>

          <div className="flex gap-3">
            <button
              disabled={status !== 'idle'}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 font-semibold text-white shadow-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-60"
              type="submit"
            >
              <i className="ri-dumbbell-fill text-current"></i>
              {status === 'idle' ? 'Gerar WOD' : 'Gerando…'}
            </button>
          </div>
        </form>

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


