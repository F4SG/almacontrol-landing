export default function Hero({ onCTAClick }) {
  return (
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
              <a
                href="#demo"
                id="hero-cta-secondary"
                className="inline-flex items-center justify-center px-7 py-4 border-2 border-[#1B4332] text-[#1B4332] text-base font-semibold rounded-xl hover:bg-green-50 transition-all duration-200 active:scale-95"
              >
                Ver demo
              </a>
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
  )
}
