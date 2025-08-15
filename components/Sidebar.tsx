
'use client';

import Link from 'next/link';

export default function Sidebar() {
  const menuItems = [
    { icon: 'ri-home-fill', label: 'Feed', href: '/home', active: true },
    { icon: 'ri-dumbbell-fill', label: 'Meus WODs', href: '/wods' },
    { icon: 'ri-group-line', label: 'Grupos', href: '/groups' },
    { icon: 'ri-trophy-line', label: 'Desafios', href: '/challenges' },
    { icon: 'ri-message-3-line', label: 'Mensagens', href: '/messages', hasNotification: true },
    { icon: 'ri-user-line', label: 'Perfil', href: '/profile' },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 shadow-sm hidden lg:block">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <i className="ri-dumbbell-fill text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-900">SmartWod</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap relative ${
                item.active
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <i className={`${item.icon} text-lg text-current`}></i>
              <span className="font-medium">{item.label}</span>
              {item.hasNotification && (
                <div className="absolute right-3 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>


      </div>
    </div>
  );
}
