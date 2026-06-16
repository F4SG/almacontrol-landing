import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/api'
import { Package, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]       = useState({ correo: '', contrasena: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.correo || !form.contrasena) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    try {
      const data = await login(form.correo, form.contrasena)
      loginUser(data.token, data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.error || err?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B4332] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#F59E0B] rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Package className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">AlmaControl</h1>
          <p className="text-green-300 text-sm mt-1">Sistema de Gestión de Inventario</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Iniciar sesión</h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="login-email"
                name="correo"
                type="email"
                autoComplete="email"
                placeholder="usuario@empresa.com"
                value={form.correo}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="contrasena"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.contrasena}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#163829] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95 mt-2"
            >
              {loading ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-[#1B4332] font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <p className="text-center text-green-400 text-xs mt-6">
          © {new Date().getFullYear()} AlmaControl — Sistema SaaS para PYME bolivianas
        </p>
      </div>
    </div>
  )
}
