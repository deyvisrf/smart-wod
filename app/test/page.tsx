export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">🎉 Next.js funcionando!</h1>
        <p className="text-gray-600">Agora vamos configurar o Supabase corretamente</p>
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-2">Próximos passos:</h2>
          <ol className="text-left text-sm space-y-1">
            <li>1. Executar scripts SQL no Supabase</li>
            <li>2. Configurar Auth settings</li>
            <li>3. Testar autenticação</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
