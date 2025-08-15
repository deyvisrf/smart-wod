import Link from 'next/link'

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-error-warning-line text-2xl text-red-600"></i>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Erro na autenticação</h1>
        <p className="text-gray-600 mb-6">
          Houve um problema ao processar sua autenticação. Tente novamente.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <i className="ri-arrow-left-line"></i>
          Voltar ao login
        </Link>
      </div>
    </div>
  )
}
