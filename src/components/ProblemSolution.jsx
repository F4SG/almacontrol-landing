import { CheckCircle2, ArrowDown } from 'lucide-react'

const painPoints = [
  {
    id: 1,
    text: 'Inventario en cuadernos y Excel que nadie puede consultar en tiempo real',
  },
  {
    id: 2,
    text: 'Errores de despacho frecuentes porque no se sabe dónde está cada producto',
  },
  {
    id: 3,
    text: 'Mercadería vencida o extraviada que solo se descubre en el conteo semestral',
  },
]

const solutions = [
  {
    id: 1,
    text: 'Stock en tiempo real consultable desde cualquier celular, en segundos',
  },
  {
    id: 2,
    text: 'Mapa digital del almacén: cada producto tiene su pasillo, estante y nivel',
  },
  {
    id: 3,
    text: 'Alertas automáticas de vencimiento y stock mínimo antes de que sea un problema',
  },
]

export default function ProblemSolution() {
  return (
    <section id="problema" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sm font-semibold text-[#F59E0B] uppercase tracking-widest mb-3">
            El problema real
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Las distribuidoras bolivianas pierden hasta el{' '}
            <span className="text-red-600">15%</span> de sus pedidos por gestión manual
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: pain + solution */}
          <div className="flex flex-col gap-8">
            {/* Pain points */}
            <div className="flex flex-col gap-4">
              {painPoints.map((point) => (
                <div
                  key={point.id}
                  className="bg-white rounded-xl p-5 border-l-4 border-red-400 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-lg mt-0.5 flex-shrink-0">✗</span>
                    <p className="text-gray-700 font-medium leading-snug">{point.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <ArrowDown className="w-6 h-6 text-[#1B4332]" />
                <span className="text-sm font-bold text-[#1B4332] bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  La solución
                </span>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Solutions */}
            <div className="flex flex-col gap-4">
              {solutions.map((sol) => (
                <div
                  key={sol.id}
                  className="bg-white rounded-xl p-5 border-l-4 border-[#1B4332] shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1B4332] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 font-medium leading-snug">{sol.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: warehouse image */}
          <div className="relative">
            <div className="absolute -inset-3 bg-[#1B4332]/5 rounded-3xl -z-10" />
            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-gray-200">
              <img
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=700&q=80&auto=format&fit=crop"
                alt="Bodega ordenada y organizada con sistema digital"
                className="w-full h-[480px] object-cover"
                loading="lazy"
              />
            </div>
            {/* Stat badge */}
            <div className="absolute -bottom-5 -left-5 hidden lg:block bg-[#1B4332] text-white rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-3xl font-black">15%</p>
              <p className="text-green-200 text-xs font-medium">de pedidos perdidos</p>
              <p className="text-green-300 text-xs">por gestión manual</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
