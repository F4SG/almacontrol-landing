import { useState } from 'react'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const sizeOptions = [
  { value: '', label: 'Selecciona el tamaño de empresa' },
  { value: '1-10', label: '1 - 10 empleados' },
  { value: '11-50', label: '11 - 50 empleados' },
  { value: '51-200', label: '51 - 200 empleados' },
  { value: '+200', label: 'Más de 200 empleados' },
]

const initialValues = {
  name: '',
  email: '',
  company: '',
  size: '',
}

export default function CaptureForm({ onSuccess }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!values.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!values.email.trim()) {
      newErrors.email = 'El correo es requerido'
    } else if (!emailRegex.test(values.email)) {
      newErrors.email = 'Ingresa un correo válido'
    }
    if (!values.company.trim()) newErrors.company = 'El nombre de empresa es requerido'
    if (!values.size) newErrors.size = 'Selecciona el tamaño de empresa'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSubmitting(true)
    // Simulate async submission
    setTimeout(() => {
      setSubmitting(false)
      setValues(initialValues)
      setErrors({})
      onSuccess()
    }, 800)
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl text-gray-900 bg-white border-2 text-sm placeholder-gray-400 focus:outline-none transition-colors duration-200 ${
      errors[field]
        ? 'border-red-400 focus:border-red-400'
        : 'border-transparent focus:border-[#F59E0B]'
    }`

  return (
    <section
      id="captura"
      className="py-20 lg:py-28"
      style={{ backgroundColor: '#1B4332' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Empieza gratis hoy. Sin tarjeta de crédito.
          </h2>
          <p className="text-green-200 text-lg">
            Únete a las distribuidoras bolivianas que ya dejaron el Excel.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Nombre */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-green-100">
                Nombre completo <span className="text-[#F59E0B]">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="ej. Carlos Mendoza"
                value={values.name}
                onChange={handleChange}
                className={inputClass('name')}
              />
              {errors.name && (
                <p className="text-red-300 text-xs font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-green-100">
                Correo electrónico <span className="text-[#F59E0B]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="carlos@empresa.com"
                value={values.email}
                onChange={handleChange}
                className={inputClass('email')}
              />
              {errors.email && (
                <p className="text-red-300 text-xs font-medium">{errors.email}</p>
              )}
            </div>

            {/* Empresa */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="company" className="text-sm font-semibold text-green-100">
                Nombre de empresa <span className="text-[#F59E0B]">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Distribuidora El Pino"
                value={values.company}
                onChange={handleChange}
                className={inputClass('company')}
              />
              {errors.company && (
                <p className="text-red-300 text-xs font-medium">{errors.company}</p>
              )}
            </div>

            {/* Tamaño */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="size" className="text-sm font-semibold text-green-100">
                Tamaño de empresa <span className="text-[#F59E0B]">*</span>
              </label>
              <select
                id="size"
                name="size"
                value={values.size}
                onChange={handleChange}
                className={inputClass('size')}
              >
                {sizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.size && (
                <p className="text-red-300 text-xs font-medium">{errors.size}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            id="form-submit-btn"
            type="submit"
            disabled={submitting}
            className="mt-8 w-full py-4 bg-[#F59E0B] text-gray-900 text-base font-bold rounded-xl hover:bg-[#D97706] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 hover:shadow-lg"
          >
            {submitting ? 'Enviando...' : 'Solicitar acceso gratuito'}
          </button>

          <p className="text-center text-green-300 text-xs mt-4">
            Al registrarte aceptas nuestros Términos de Servicio y Política de Privacidad.
          </p>
        </form>
      </div>
    </section>
  )
}
