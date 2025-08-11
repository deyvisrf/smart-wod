'use client';

import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import WorkoutPost from '../../components/WorkoutPost';

export default function HomePage() {
  // Carrega posts que o usuário compartilhou via modal (localStorage)
  const getShared = () => {
    try {
      return JSON.parse(typeof window !== 'undefined' ? localStorage.getItem('my_feed_posts') || '[]' : '[]');
    } catch {
      return [] as any[];
    }
  };

  const [sharedPosts, setSharedPosts] = React.useState<any[]>(getShared());

  React.useEffect(() => {
    const handler = () => setSharedPosts(getShared());
    window.addEventListener('wod:shared', handler);
    return () => window.removeEventListener('wod:shared', handler);
  }, []);
  const workoutPosts = [
    {
      author: 'Deyvis Ferreira',
      time: '5 dias atrás, 2025',
      workoutTitle: 'Cardio Iniciante 30',
      warmup: [
        '2 minutos de corrida leve ou joelho alto',
        '10 agachamentos livres',
        '10 afundos alternados',
        '10 círculos com os braços',
        '10 flexões na barra (barra baixa)',
      ],
      mainWorkout: {
        title: 'TREINO PRINCIPAL (18 minutos - AMRAP):',
        description: 'Complete o máximo de rounds possível em 18 minutos:',
        exercises: [
          '200m de corrida (pode ser ao redor do box ou 1 min correndo no lugar)',
          '10 subidas no caixote (5 por perna) usando um caixote',
          '8 levantamentos terra com kettlebell (peso moderado; exemplo: 8-12kg)',
          '6 barras saltadas na barra (ou barra assistida)',
        ],
      },
      avatar: 'D',
      level: 'Iniciante',
    },
    {
      author: 'Alex Thompson',
      time: '1 dia atrás, 2025',
      workoutTitle: 'Força Membros Superiores',
      warmup: [
        '3 minutos de círculos com braços e rotação de ombros',
        '15 flexões na parede',
        '10 aberturas com elástico',
        '5 minhocas',
      ],
      mainWorkout: {
        title: 'CIRCUITO DE FORÇA (25 minutos - 5 rounds):',
        description: 'Complete 5 rounds com 2 minutos de descanso entre rounds:',
        exercises: [
          '8 flexões (modifique conforme necessário)',
          '12 remadas com halter por braço',
          '10 desenvolvimento',
          '15 mergulhos na cadeira',
          '30 segundos de prancha',
        ],
      },
      avatar: 'A',
      level: 'Intermediário',
    },
    {
      author: 'Maria Santos',
      time: '3 dias atrás, 2025',
      workoutTitle: 'HIIT Cardio Explosivo',
      warmup: [
        '2 minutos marchando no lugar',
        '10 polichinelos',
        '10 agachamentos livres',
        '5 burpees',
      ],
      mainWorkout: {
        title: 'TREINO HIIT (20 minutos - estilo Tabata):',
        description: '8 rounds de 20 segundos trabalho, 10 segundos descanso:',
        exercises: [
          'Escaladas',
          'Agachamentos saltados',
          'Joelho alto',
          'Burpees',
          'Prancha saltada',
          'Abdominais russos',
          'Afundos saltados',
          'Flexões',
        ],
      },
      avatar: 'M',
      level: 'Avançado',
    },
  ];


  const suggestions = [
    { name: 'Sophia Lee', avatar: 'S', time: '3 anos atrás' },
    { name: 'João Silva', avatar: 'J', time: '2 anos atrás' },
    { name: 'Ana Costa', avatar: 'A', time: '1 ano atrás' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
            <div className="xl:col-span-2 order-2 xl:order-1">
              {sharedPosts.map((p, idx) => (
                <div key={`shared-${p.id ?? idx}`} className="mb-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-base lg:text-lg">D</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Você</h3>
                          <p className="text-xs lg:text-sm text-gray-500">agora mesmo</p>
                        </div>
                      </div>
                      <span className="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-green-100 text-green-700">Compartilhado</span>
                    </div>
                    <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">{p.title}</h2>
                    {p.warmup && (
                      <div className="mb-3">
                        <h4 className="text-purple-600 font-semibold mb-2 lg:mb-3 flex items-center gap-2 text-sm lg:text-base">
                          <i className="ri-fire-line"></i>
                          {p.warmup.title}
                        </h4>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                          {p.warmup.items?.map((it: string, i: number) => (
                            <li key={i}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {p.main && (
                      <div>
                        <h4 className="text-purple-600 font-semibold mb-2 flex items-center gap-2 text-sm lg:text-base">
                          <i className="ri-heart-pulse-line"></i>
                          {p.main.title}
                        </h4>
                        <ul className="list-disc pl-6 text-gray-700 space-y-1">
                          {p.main.items?.map((it: string, i: number) => (
                            <li key={i}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {workoutPosts.map((post, index) => (
                <WorkoutPost key={index} {...post} />
              ))}
            </div>

            <div className="space-y-4 lg:space-y-6 order-1 xl:order-2">
              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3 lg:mb-4">Sugestões</h3>
                <div className="space-y-3 lg:space-y-4">
                  {suggestions.map((person, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs lg:text-sm">{person.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{person.name}</p>
                        <p className="text-gray-500 text-xs">{person.time}</p>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700 font-medium text-sm cursor-pointer whitespace-nowrap">
                        Seguir
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100 hidden lg:block">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Atividade Recente</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Alice</span> compartilhou um post
                      </p>
                      <p className="text-xs text-gray-500">3 dias, 23 horas atrás</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">A</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Alice</span> postou uma atualização
                      </p>
                      <p className="text-xs text-gray-500">4 dias, 3 horas atrás</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}





