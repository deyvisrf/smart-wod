'use client';

import { useEffect, useState } from 'react';
import type { GeneratedWod } from './actions';
import { generateWodAction } from './actions';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { WodService, type WodData } from '../../lib/wods';

export default function CreateWorkoutPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect para login se não autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);
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
  const [showForm, setShowForm] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

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
      setSaveStatus('idle'); // Reset save status when new WOD is generated
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
      setSaveStatus('idle'); // Reset save status when new WOD is generated
    } finally {
      setStatus('idle');
    }
  };

  // Função para salvar WOD no banco
  const handleSaveWod = async () => {
    if (!wod || !user) return;

    setSaveStatus('saving');
    try {
      // Converter GeneratedWod para WodData
      const wodData: WodData = {
        title: wod.title,
        level: wod.level,
        duration_minutes: wod.durationMinutes,
        warmup: wod.warmup,
        main: wod.main,
        cooldown: wod.cooldown,
        notes: wod.notes,
        equipment: form.equipment,
        style: form.style,
        preset: form.preset,
        load_recommendations: wod.loadRecommendations
      };

      const saved = await WodService.createWod(wodData, user.id);
      if (saved) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000); // Reset after 3 seconds
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error saving WOD:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
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
        {/* Form completo */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Parâmetros</h2>
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="text-purple-600 hover:text-purple-700 text-sm"
            >
              {showForm ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2"
                >
                  <option>Iniciante</option>
                  <option>Intermediário</option>
                  <option>Avançado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objetivo</label>
                <input
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipamentos</label>
                <div className="flex flex-wrap gap-2">
                  {equipmentOptions.map((eq) => {
                    const selected = form.equipment.includes(eq);
                    return (
                      <button
                        type="button"
                        key={eq}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            equipment: selected
                              ? prev.equipment.filter((e) => e !== eq)
                              : [...prev.equipment, eq],
                          }));
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm border ${selected ? 'bg-purple-600 text-white border-purple-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                      >
                        {eq}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duração (min)</label>
                <input
                  type="number"
                  min={5}
                  max={120}
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estilo</label>
                <select
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value as any })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2"
                >
                  <option value="AMRAP">AMRAP</option>
                  <option value="EMOM">EMOM</option>
                  <option value="For Time">For Time</option>
                  <option value="Chipper">Chipper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preset</label>
                <select
                  value={form.preset}
                  onChange={(e) => setForm({ ...form, preset: e.target.value as any })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2"
                >
                  <option value="RX">RX</option>
                  <option value="Scaled">Scaled</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="includeLoads"
                  type="checkbox"
                  checked={form.includeLoads}
                  onChange={(e) => setForm({ ...form, includeLoads: e.target.checked })}
                />
                <label htmlFor="includeLoads" className="text-sm text-gray-700">Incluir recomendações de carga</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prompt livre (opcional)</label>
                <textarea
                  value={form.prompt}
                  onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2"
                />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 font-semibold shadow-md hover:from-purple-600 hover:to-pink-600 disabled:opacity-60"
                >
                  {status === 'loading' ? 'Gerando…' : 'Gerar WOD'}
                </button>
              </div>
            </form>
          )}
        </section>

        {wod && (
          <section className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">{wod.title}</h2>
              <div className="flex items-center gap-3">
                {wod.durationMinutes ? (
                  <span className="text-sm text-gray-600">{wod.durationMinutes} min</span>
                ) : null}
                <button
                  onClick={handleSaveWod}
                  disabled={saveStatus === 'saving' || !user}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    saveStatus === 'saved' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : saveStatus === 'error'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {saveStatus === 'saving' ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-purple-600 border-r-transparent" />
                      Salvando...
                    </span>
                  ) : saveStatus === 'saved' ? (
                    <span className="flex items-center gap-2">
                      <i className="ri-check-line"></i>
                      Salvo!
                    </span>
                  ) : saveStatus === 'error' ? (
                    <span className="flex items-center gap-2">
                      <i className="ri-close-line"></i>
                      Erro
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <i className="ri-save-line"></i>
                      Salvar WOD
                    </span>
                  )}
                </button>
              </div>
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


