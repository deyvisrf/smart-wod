'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

interface SavedWod {
  id: string;
  title: string;
  warmup?: {
    title: string;
    items: string[];
  };
  main?: {
    title: string;
    items: string[];
  };
  cooldown?: {
    title: string;
    items: string[];
  };
  notes?: string;
  createdAt: string;
  equipment?: string[];
  style?: string;
  preset?: string;
  loadRecommendations?: string | object;
}

export default function WodsPage() {
  const [savedWods, setSavedWods] = useState<SavedWod[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWod, setEditingWod] = useState<SavedWod | null>(null);
  const [expandedWods, setExpandedWods] = useState<Record<string, boolean>>({});

  // Carrega WODs salvos do localStorage
  const loadSavedWods = () => {
    try {
      const saved = localStorage.getItem('saved_wods');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Salva WODs no localStorage
  const saveWods = (wods: SavedWod[]) => {
    localStorage.setItem('saved_wods', JSON.stringify(wods));
    setSavedWods(wods);
  };

  useEffect(() => {
    setSavedWods(loadSavedWods());
  }, []);

  // Filtra WODs por termo de busca
  const filteredWods = savedWods.filter(wod =>
    wod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wod.equipment?.some(eq => eq.toLowerCase().includes(searchTerm.toLowerCase())) ||
    wod.style?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Exclui um WOD
  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este WOD?')) {
      const updated = savedWods.filter(wod => wod.id !== id);
      saveWods(updated);
    }
  };

  // Inicia edição
  const handleEdit = (wod: SavedWod) => {
    setEditingWod({ ...wod });
  };

  // Salva edição
  const handleSaveEdit = () => {
    if (!editingWod) return;
    
    const updated = savedWods.map(wod => 
      wod.id === editingWod.id ? editingWod : wod
    );
    saveWods(updated);
    setEditingWod(null);
  };

  // Cancela edição
  const handleCancelEdit = () => {
    setEditingWod(null);
  };

  // Toggle expandir WOD
  const toggleExpand = (id: string) => {
    setExpandedWods(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header da página */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Meus WODs</h1>
            <p className="text-gray-600 text-sm lg:text-base">Gerencie sua biblioteca pessoal de treinos</p>
          </div>

          {/* Busca e estatísticas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-purple-600">
                  <i className="ri-dumbbell-fill text-xl"></i>
                  <span className="font-semibold">{savedWods.length} WODs salvos</span>
                </div>
              </div>
              
              <div className="relative w-full sm:w-80">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Buscar por título, equipamento ou estilo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Lista de WODs ou estado vazio */}
          {filteredWods.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12 text-center">
              {savedWods.length === 0 ? (
                <>
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-dumbbell-line text-3xl text-purple-500"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum WOD salvo ainda</h3>
                  <p className="text-gray-600 mb-6">Comece criando seu primeiro treino personalizado!</p>
                  <button 
                    onClick={() => window.dispatchEvent(new Event('open-create-modal'))}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    <i className="ri-add-line"></i>
                    Criar Primeiro WOD
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-search-line text-2xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-gray-600">Tente buscar por outros termos</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {filteredWods.map((wod) => {
                const isExpanded = expandedWods[wod.id];
                const isEditing = editingWod?.id === wod.id;
                
                return (
                  <div key={wod.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    {/* Header do card */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingWod.title}
                            onChange={(e) => setEditingWod({ ...editingWod, title: e.target.value })}
                            className="w-full text-lg lg:text-xl font-bold text-gray-900 border-b border-gray-200 focus:outline-none focus:border-purple-500 bg-transparent"
                          />
                        ) : (
                          <h3 className="text-lg lg:text-xl font-bold text-gray-900">{wod.title}</h3>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <i className="ri-calendar-line"></i>
                          <span>{new Date(wod.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => handleEdit(wod)}
                              className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(wod.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Salvar"
                            >
                              <i className="ri-check-line"></i>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancelar"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tags/Metadata */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {wod.style && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {wod.style}
                        </span>
                      )}
                      {wod.preset && (
                        <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                          {wod.preset}
                        </span>
                      )}
                      {wod.equipment?.map((eq, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {eq}
                        </span>
                      ))}
                    </div>

                    {/* Conteúdo do WOD */}
                    <div className="space-y-3">
                      {/* Aquecimento */}
                      {wod.warmup && (
                        <div>
                          <h4 className="text-purple-600 font-semibold mb-2 flex items-center gap-2 text-sm">
                            <i className="ri-fire-line"></i>
                            {wod.warmup.title}
                          </h4>
                          <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                            {(isExpanded ? wod.warmup.items : wod.warmup.items.slice(0, 2)).map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Treino Principal */}
                      {wod.main && (
                        <div>
                          <h4 className="text-purple-600 font-semibold mb-2 flex items-center gap-2 text-sm">
                            <i className="ri-heart-pulse-line"></i>
                            {wod.main.title}
                          </h4>
                          <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                            {(isExpanded ? wod.main.items : wod.main.items.slice(0, 3)).map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Cooldown (só quando expandido) */}
                      {isExpanded && wod.cooldown && (
                        <div>
                          <h4 className="text-purple-600 font-semibold mb-2 flex items-center gap-2 text-sm">
                            <i className="ri-drop-line"></i>
                            {wod.cooldown.title}
                          </h4>
                          <ul className="list-disc pl-6 text-gray-700 space-y-1 text-sm">
                            {wod.cooldown.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Notas (só quando expandido) */}
                      {isExpanded && wod.notes && (
                        <div>
                          <h4 className="text-purple-600 font-semibold mb-2 flex items-center gap-2 text-sm">
                            <i className="ri-sticky-note-line"></i>
                            Observações
                          </h4>
                          <p className="text-gray-600 text-sm">{wod.notes}</p>
                        </div>
                      )}

                      {/* Recomendações de carga (só quando expandido) */}
                      {isExpanded && wod.loadRecommendations && (
                        <div>
                          <h4 className="text-purple-600 font-semibold mb-2 flex items-center gap-2 text-sm">
                            <i className="ri-scales-3-line"></i>
                            Recomendações de Carga
                          </h4>
                          <div className="text-gray-600 text-sm">
                            {typeof wod.loadRecommendations === 'string' ? (
                              <p>{wod.loadRecommendations}</p>
                            ) : (
                              <div className="space-y-1">
                                {Object.entries(wod.loadRecommendations).map(([key, value]) => (
                                  <p key={key}><span className="font-medium">{key}:</span> {value}</p>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer do card */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                      <div className="flex items-center gap-4">
                        <button 
                          className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors text-sm"
                          title="Compartilhar"
                        >
                          <i className="ri-share-line"></i>
                          <span className="hidden sm:inline">Compartilhar</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => toggleExpand(wod.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 text-white text-xs shadow-md hover:from-purple-600 hover:to-pink-600"
                      >
                        {isExpanded ? 'Ver menos' : 'Ver mais'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
