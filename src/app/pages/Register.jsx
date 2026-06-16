import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register } from '../services/api'
import { Package, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '', apellido: '', correo: '', contrasena: '', telefono: '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
    setErrors((p) => ({ ...p, [e.target.name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.nombre.trim())    newErrors.nombre    = 'El nombre es requerido'
    if (!form.apellido.trim())  newErrors.apellido  = 'El apellido es requerido'
    if (!form.correo.trim())    newErrors.correo    = 'El correo es requerido'
    if (!form.contrasena)       newErrors.contrasena= 'La contraseña es requerida'
    else if (form.contrasena.length < 6) newErrors.contrasena = 'Mínimo 6 caracteres'

    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const data = await register({
        nombre:     form.nombre,
        apellido:   form.apellido,
        correo:     form.correo,
        contrasena: form.contrasena,
        telefono:   form.telefono || null,
      })
      loginUser(data.token, data.user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (err?.errors) {
        // Errores de validación del backend
        const mapped = {}
        Object.entries(err.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : v
        })
        setErrors(mapped)
      } else {
        setErrors({ correo: err?.message || 'Error al registrar' })
      }
    } finally {
      setLoading(false)
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={`reg-${name}`}
          name={name}
          type={name === 'contrasena' ? (showPwd ? 'text' : 'password') : type}
          placeholder={placeholder}
          autoComplete={name === 'correo' ? 'email' : name === 'contrasena' ? 'new-password' : 'off'}
          value={form[name]}
          onChange={handleChange}
          className={`w-full px-4 py-3 ${name === 'contrasena' ? 'pr-11' : ''} border-2 rounded-xl text-sm focus:outline-none transition-colors ${
            errors[name] ? 'border-red-400' : 'border-gray-200 focus:border-[#1B4332]'
          }`}
        />
        {name === 'contrasena' && (
          <button
            type="button"
            onClick={() => setShowPwd((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B4332] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#F59E0B] rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Package className="w-8 h-8 text-gray-900" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">AlmaControl</h1>
          <p className="text-green-300 text-sm mt-1">Crear cuenta nueva</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Registrarse</h2>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {field('nombre',   'Nombre',   'text', 'Carlos')}
              {field('apellido', 'Apellido', 'text', 'Mendoza')}
            </div>
            {field('correo',     'Correo electrónico', 'email',    'carlos@empresa.com')}
            {field('contrasena', 'Contraseña',         'password', '••••••••')}
            {field('telefono',   'Teléfono (opcional)', 'tel',     '+591 70000000')}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#F59E0B] text-gray-900 font-bold rounded-xl hover:bg-[#D97706] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg active:scale-95 mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#1B4332] font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
