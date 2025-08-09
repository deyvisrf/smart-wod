
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const v = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') : null;
      setIsLoggedIn(v === '1');
    } catch {
      setIsLoggedIn(false);
    }
  }, []);

  // Fecha o menu de perfil ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 lg:left-72 z-40 shadow-sm">
      <div className="px-4 sm:px-6 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Menu mobile */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <i className="ri-menu-line text-xl text-gray-600"></i>
            </button>
            
            {/* Logo mobile */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <i className="ri-dumbbell-fill text-white text-lg"></i>
              </div>
              <h1 className="text-lg font-bold text-gray-900">WOD Connect</h1>
            </div>
            
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 hidden lg:block">Feed</h2>
            
            {/* Barra de pesquisa - Oculta no mobile */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <i className="ri-search-line text-gray-500 mr-2"></i>
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Busca mobile */}
            <button className="lg:hidden w-8 h-8 flex items-center justify-center cursor-pointer">
              <i className="ri-search-line text-xl text-gray-600"></i>
            </button>
            
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 lg:px-6 lg:py-2 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer whitespace-nowrap shadow-md text-sm lg:text-base">
              <span className="hidden sm:inline">+ Criar Treino</span>
              <span className="sm:hidden">+</span>
            </button>
            {!isLoggedIn && (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center px-4 lg:px-5 py-2 rounded-full border border-purple-300 text-purple-600 hover:bg-purple-50 transition-colors text-sm lg:text-base whitespace-nowrap"
              >
                Entrar
              </Link>
            )}
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer relative"
              >
                <i className="ri-notification-line text-lg lg:text-xl text-gray-600"></i>
                <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </span>
              </button>
              
              {showNotifications && (
                <div className="absolute top-10 lg:top-12 right-0 w-72 lg:w-80 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 z-50">
                  <h3 className="font-semibold mb-3 text-gray-900">Notificações</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">M</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Mike curtiu seu treino</p>
                        <p className="text-xs text-gray-500">2 horas atrás</p>
                      </div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">S</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sarah comentou no seu post</p>
                        <p className="text-xs text-gray-500">4 horas atrás</p>
                      </div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu((s) => !s)}
                  aria-haspopup="menu"
                  aria-expanded={showProfileMenu}
                  className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer shadow-md"
                >
                  <span className="text-white font-bold text-sm lg:text-base">D</span>
                </button>
                {showProfileMenu && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-sm shadow-lg"
                  >
                    <a href="/profile" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50" role="menuitem">
                      <i className="ri-user-line" /> Perfil
                    </a>
                    <a href="/settings" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50" role="menuitem">
                      <i className="ri-settings-3-line" /> Configurações
                    </a>
                    <div className="my-1 h-px bg-gray-100" />
                    <button
                      onClick={() => {
                        try { localStorage.removeItem('isLoggedIn'); } catch {}
                        window.location.href = '/login';
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50"
                      role="menuitem"
                    >
                      <i className="ri-logout-box-r-line" /> Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-default">
                <i className="ri-user-line text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu mobile overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="w-72 bg-white h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <i className="ri-dumbbell-fill text-white text-xl"></i>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">WOD Connect</h1>
                </div>
                <button onClick={() => setShowMobileMenu(false)} className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-close-line text-xl text-gray-600"></i>
                </button>
              </div>
              
              <nav className="space-y-2">
                <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
                  <i className="ri-home-fill text-lg"></i>
                  <span className="font-medium">Feed</span>
                </a>
                <a href="/wods" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100">
                  <i className="ri-dumbbell-line text-lg"></i>
                  <span className="font-medium">Meus WODs</span>
                </a>
                <a href="/groups" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100">
                  <i className="ri-group-line text-lg"></i>
                  <span className="font-medium">Grupos</span>
                </a>
                <a href="/challenges" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100">
                  <i className="ri-trophy-line text-lg"></i>
                  <span className="font-medium">Desafios</span>
                </a>
                <a href="/messages" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 relative">
                  <i className="ri-message-3-line text-lg"></i>
                  <span className="font-medium">Mensagens</span>
                  <div className="absolute right-3 w-2 h-2 bg-red-500 rounded-full"></div>
                </a>
                <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100">
                  <i className="ri-user-line text-lg"></i>
                  <span className="font-medium">Perfil</span>
                </a>
                {!isLoggedIn && (
                  <a href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100">
                    <i className="ri-login-circle-line text-lg"></i>
                    <span className="font-medium">Entrar</span>
                  </a>
                )}
              </nav>

              <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Deyvis Ferreira</p>
                    <p className="text-gray-500 text-xs">Fitness Enthusiast</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <p className="font-bold text-purple-600">127</p>
                    <p className="text-gray-500 text-xs">Seguidores</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-purple-600">89</p>
                    <p className="text-gray-500 text-xs">Seguindo</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-purple-600">45</p>
                    <p className="text-gray-500 text-xs">WODs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
