'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';

type Message = { id: string; from: string; to: string; text: string; time: string };

export default function MessagesPage() {
  const router = useRouter();
  const [threadWith, setThreadWith] = useState<string>('Mike');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    try {
      const v = localStorage.getItem('isLoggedIn');
      if (v !== '1') router.replace('/login');
    } catch {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('messages') || '[]') as Message[];
      setMessages(stored);
    } catch {
      setMessages([]);
    }
  }, []);

  const threads = useMemo(() => {
    const byUser: Record<string, Message[]> = {};
    for (const m of messages) {
      const other = m.from === 'Você' ? m.to : m.from;
      byUser[other] = byUser[other] || [];
      byUser[other].push(m);
    }
    return Object.entries(byUser).map(([user, msgs]) => ({ user, last: msgs[msgs.length - 1] }));
  }, [messages]);

  const send = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      from: 'Você',
      to: threadWith,
      text,
      time: new Date().toISOString(),
    };
    const next = [...messages, msg];
    setMessages(next);
    localStorage.setItem('messages', JSON.stringify(next));
    setText('');
  };

  const currentThread = messages.filter(
    (m) => m.from === 'Você' ? m.to === threadWith : m.from === threadWith
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Sidebar />
      <Header />
      <main className="lg:ml-72 pt-20 lg:pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h2 className="font-semibold mb-3">Conversas</h2>
            <div className="space-y-2">
              {threads.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma conversa. Envie uma mensagem!</p>
              ) : (
                threads.map((t) => (
                  <button
                    key={t.user}
                    onClick={() => setThreadWith(t.user)}
                    className={`w-full text-left p-3 rounded-xl border ${threadWith === t.user ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full grid place-items-center text-white font-bold">
                        {t.user.slice(0,1)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{t.user}</p>
                        <p className="text-xs text-gray-500 truncate">{t.last?.text}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col h-[70vh]">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full grid place-items-center text-white font-bold">
                {threadWith.slice(0,1)}
              </div>
              <h2 className="font-semibold">{threadWith}</h2>
            </div>
            <div className="flex-1 overflow-auto space-y-3">
              {currentThread.map((m) => (
                <div key={m.id} className={`max-w-[70%] p-3 rounded-xl text-sm ${m.from === 'Você' ? 'ml-auto bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p>{m.text}</p>
                  <p className="text-[10px] opacity-70 mt-1">{new Date(m.time).toLocaleString('pt-BR')}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                placeholder="Escreva uma mensagem..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-200 bg-gray-50"
              />
              <button onClick={send} className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">Enviar</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


