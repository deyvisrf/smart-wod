'use client';

import React from 'react';

type Toast = {
  id: number;
  message: string;
  variant?: 'success' | 'error' | 'info';
};

export default function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ message: string; variant?: Toast['variant'] }>;
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message: ce.detail?.message ?? '', variant: ce.detail?.variant }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
    window.addEventListener('toast:show', handler as EventListener);
    return () => window.removeEventListener('toast:show', handler as EventListener);
  }, []);

  const bgFor = (variant?: Toast['variant']) => {
    switch (variant) {
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'error':
        return 'from-red-500 to-rose-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`text-white px-4 py-2 rounded-xl shadow-lg bg-gradient-to-r ${bgFor(t.variant)}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}


