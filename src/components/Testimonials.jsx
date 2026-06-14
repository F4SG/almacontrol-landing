import { Star } from 'lucide-react'

const metrics = [
  { value: '80%', label: 'menos errores de despacho' },
  { value: '3×', label: 'más rápido el picking' },
  { value: '100%', label: 'trazabilidad de movimientos' },
]

const testimonials = [
  {
    id: 1,
    quote:
      'Antes perdíamos mercadería cada semana y ni nos enterábamos hasta el inventario. Ahora sé el stock exacto desde el celular.',
    name: 'Carlos Mendoza',
    role: 'Jefe de Logística',
    company: 'Distribuidora El Pino',
    city: 'Santa Cruz',
    avatar: 'https://i.pravatar.cc/60?img=1',
  },
  {
    id: 2,
    quote:
      'La integración con el SIN fue clave. Ya no cargo los datos dos veces. AlmaControl lo hace automáticamente.',
    name: 'Patricia Quispe',
    role: 'Contadora',
    company: 'Comercializadora Andina',
    city: 'La Paz',
    avatar: 'https://i.pravatar.cc/60?img=2',
  },
  {
    id: 3,
    quote:
      'El modo offline fue lo que nos convenció. Nuestro almacén no siempre tiene WiFi y funciona igual de bien.',
    name: 'Roberto Flores',
    role: 'Gerente General',
    company: 'Distribuidora Norte',
    city: 'Cochabamba',
    avatar: 'https://i.pravatar.cc/60?img=3',
  },
]

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonios" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-[#F59E0B] uppercase tracking-widest mb-3">
            Prueba social
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Distribuidoras bolivianas que ya controlan su almacén
          </h2>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <p className="text-4xl font-black text-[#1B4332] mb-1">{m.value}</p>
              <p className="text-sm text-gray-500 font-medium">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-5"
            >
              {/* Stars */}
              <StarRating />

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed italic text-sm flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <img
                  src={t.avatar}
                  alt={`Foto de ${t.name}`}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.role} · {t.company}
                  </p>
                  <p className="text-xs text-[#1B4332] font-medium">🇧🇴 {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
