import { Scan, Map, WifiOff, Bell, FileText } from 'lucide-react'

const features = [
  {
    id: 1,
    icon: Scan,
    title: 'Escaneo QR / Código de barras',
    description:
      'Registra entradas y salidas desde el celular. Sin teclado, sin errores de tipeo.',
  },
  {
    id: 2,
    icon: Map,
    title: 'Mapa digital del almacén',
    description:
      'Ubica cualquier producto por pasillo, estante y nivel en menos de 10 segundos.',
  },
  {
    id: 3,
    icon: WifiOff,
    title: 'Modo offline',
    description:
      'Funciona sin internet. Se sincroniza automáticamente al recuperar conexión.',
  },
  {
    id: 4,
    icon: Bell,
    title: 'Alertas de stock mínimo',
    description:
      'Recibe alertas antes de quedarte sin mercadería. Genera órdenes de reposición con un clic.',
  },
  {
    id: 5,
    icon: FileText,
    title: 'Reportes en PDF y Excel',
    description:
      'Genera reportes de inventario en segundos. Sin contar, sin esperar.',
  },
]

export default function Features() {
  return (
    <section id="caracteristicas" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-[#F59E0B] uppercase tracking-widest mb-3">
            Características
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Todo lo que necesita tu almacén, sin complicaciones
          </h2>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-[#1B4332]"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#F59E0B]/20 transition-colors duration-200">
                  <Icon className="w-6 h-6 text-[#F59E0B]" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2.5 leading-snug">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}

          {/* CTA card */}
          <div className="sm:col-span-2 lg:col-span-1 bg-[#1B4332] rounded-2xl p-7 flex flex-col justify-between min-h-[200px]">
            <div>
              <p className="text-green-200 text-sm font-medium mb-2">¿Listo para empezar?</p>
              <h3 className="text-white text-xl font-bold leading-snug">
                Prueba AlmaControl 14 días sin costo ni tarjeta.
              </h3>
            </div>
            <a
              href="#captura"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('captura')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center justify-center mt-6 px-5 py-3 bg-[#F59E0B] text-gray-900 text-sm font-bold rounded-xl hover:bg-[#D97706] transition-colors active:scale-95"
            >
              Iniciar prueba gratis →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
