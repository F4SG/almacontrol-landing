import { useState } from 'react'
import { X, Play } from 'lucide-react'

function DemoModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Demo — AlmaControl en acción</h3>
            <p className="text-sm text-gray-500">Así funciona el sistema en un almacén real</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar demo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video placeholder / pantalla del sistema */}
        <div className="relative bg-gray-900" style={{ aspectRatio: '16/9' }}>
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=85&auto=format&fit=crop"
            alt="Demo del sistema AlmaControl en almacén"
            className="w-full h-full object-cover opacity-60"
          />
          {/* Overlay con UI simulada */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-[#F59E0B] rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-gray-900 ml-1" />
            </div>
            <p className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
              Demo interactiva disponible al registrarte
            </p>
          </div>

          {/* Simulated UI elements */}
          <div className="absolute top-4 left-4 bg-[#1B4332] text-white text-xs font-bold px-3 py-1.5 rounded-lg">
            AlmaControl v2.0
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 text-xs font-semibold text-green-700 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            En vivo
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
          {[
            { icon: '📦', label: '1,842 productos', sub: 'en tiempo real' },
            { icon: '📱', label: 'Modo offline', sub: 'sincronización auto' },
            { icon: '⚡', label: '< 10 segundos', sub: 'para ubicar un item' },
          ].map((stat, i) => (
            <div key={i} className="py-4 px-5 text-center">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-sm font-bold text-gray-900 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-500">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <p className="text-sm text-gray-500">¿Te convenciste? Prueba 14 días sin costo.</p>
          <button
            onClick={() => {
              onClose()
              setTimeout(() => {
                document.getElementById('captura')?.scrollIntoView({ behavior: 'smooth' })
              }, 200)
            }}
            className="px-6 py-2.5 bg-[#F59E0B] text-gray-900 text-sm font-bold rounded-xl hover:bg-[#D97706] transition-colors active:scale-95 whitespace-nowrap"
          >
            Inicia tu prueba gratis →
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Hero({ onCTAClick }) {
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <>
      <section
        id="inicio"
        className="pt-16 min-h-screen flex items-center bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column — text */}
            <div className="flex flex-col gap-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 w-fit px-4 py-1.5 bg-green-50 border border-green-200 rounded-full">
                <span className="text-[#1B4332] text-sm font-semibold">✦ WMS para PYME bolivianas</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-gray-900 leading-tight tracking-tight">
                Tu almacén bajo control.{' '}
                <span className="text-[#1B4332]">Sin hojas de Excel,</span>{' '}
                sin pérdidas.
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                AlmaControl es el WMS SaaS diseñado para distribuidoras bolivianas. Controla tu inventario en tiempo real desde el celular, sin depender del encargado de turno.
              </p>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block" />
                  Sin tarjeta de crédito
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block" />
                  14 días gratis
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] inline-block" />
                  Soporte en español
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  id="hero-cta-primary"
                  onClick={onCTAClick}
                  className="inline-flex items-center justify-center px-7 py-4 bg-[#F59E0B] text-gray-900 text-base font-bold rounded-xl hover:bg-[#D97706] transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  Inicia tu prueba gratis — 14 días sin costo
                </button>
                <button
                  id="hero-cta-secondary"
                  onClick={() => setDemoOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-[#1B4332] text-[#1B4332] text-base font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 active:scale-95"
                >
                  <Play className="w-4 h-4" />
                  Ver demo
                </button>
              </div>
            </div>

            {/* Right column — image */}
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute -inset-4 bg-green-50 rounded-3xl -z-10" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80&auto=format&fit=crop"
                  alt="Almacén industrial organizado con estantes y productos"
                  className="w-full h-[420px] object-cover"
                  loading="eager"
                />
                {/* Overlay card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Stock actualizado</p>
                      <p className="text-sm font-bold text-gray-900">1,842 productos sincronizados</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-green-700">En vivo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 hidden lg:block bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
                <p className="text-2xl font-black text-[#1B4332]">80%</p>
                <p className="text-xs text-gray-500">menos errores</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo modal */}
      {demoOpen && <DemoModal onClose={() => setDemoOpen(false)} />}
    </>
  )
}
