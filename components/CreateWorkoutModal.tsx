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
  const [wod, setWod] = useState<GeneratedWod | null>(null);

  if (!open) return null;

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
            <form onSubmit={handleSubmit} className="space-y-4">
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


