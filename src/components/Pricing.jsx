import { useState } from 'react'
import { Check } from 'lucide-react'

const plans = [
  {
    id: 'gratuito',
    name: 'Gratuito',
    tagline: 'Para probar sin riesgo',
    monthlyPrice: 0,
    annualPrice: 0,
    currency: 'Bs.',
    popular: false,
    features: [
      'Hasta 500 productos',
      '1 usuario',
      'Reportes básicos',
      'Soporte por email',
    ],
    cta: 'Crear cuenta gratis',
    ctaHref: '#captura',
    cardClass: 'border-gray-200 bg-white',
    ctaClass: 'border-2 border-[#1B4332] text-[#1B4332] hover:bg-green-50',
    priceClass: 'text-gray-900',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Para distribuidoras en crecimiento',
    monthlyPrice: 290,
    annualPrice: 232,
    currency: 'Bs.',
    popular: true,
    features: [
      'Productos ilimitados',
      'Hasta 5 usuarios',
      'Modo offline',
      'Alertas automáticas',
      'Integración SIAT',
      'Soporte prioritario',
    ],
    cta: 'Iniciar prueba Pro — 14 días gratis',
    ctaHref: '#captura',
    cardClass: 'border-[#1B4332] bg-[#1B4332] text-white',
    ctaClass: 'bg-[#F59E0B] text-gray-900 hover:bg-[#D97706]',
    priceClass: 'text-white',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Para operaciones con múltiples almacenes',
    monthlyPrice: null,
    annualPrice: null,
    currency: '',
    popular: false,
    features: [
      'Todo lo del plan Pro',
      'Múltiples almacenes',
      'API REST',
      'Gerente de cuenta dedicado',
      'Capacitación in-house',
    ],
    cta: 'Contactar ventas',
    ctaHref: '#captura',
    cardClass: 'border-[#F59E0B] bg-white',
    ctaClass: 'border-2 border-[#F59E0B] text-[#D97706] hover:bg-amber-50',
    priceClass: 'text-gray-900',
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  const getPrice = (plan) => {
    if (plan.monthlyPrice === null) return 'A consultar'
    if (plan.monthlyPrice === 0) return `${plan.currency} 0`
    const price = annual ? plan.annualPrice : plan.monthlyPrice
    return `${plan.currency} ${price}`
  }

  return (
    <section id="precios" className="py-20 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold text-[#F59E0B] uppercase tracking-widest mb-3">
            Precios
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Planes pensados para PYME bolivianas
          </h2>
          <p className="text-gray-500">
            Sin costos de implementación. Sin contratos anuales obligatorios.
          </p>
        </div>

        {/* Toggle mensual / anual */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!annual ? 'text-gray-900' : 'text-gray-400'}`}>
            Mensual
          </span>
          <button
            id="pricing-toggle"
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
              annual ? 'bg-[#1B4332]' : 'bg-gray-300'
            }`}
            aria-label="Toggle facturación anual"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                annual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-2 ${annual ? 'text-gray-900' : 'text-gray-400'}`}>
            Anual
            <span className="bg-green-100 text-[#1B4332] text-xs font-bold px-2 py-0.5 rounded-full">
              Ahorra 20%
            </span>
          </span>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border-2 p-8 shadow-sm transition-all duration-200 hover:shadow-lg ${plan.cardClass}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#F59E0B] text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    ★ MÁS POPULAR
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <h3
                  className={`text-xl font-bold mb-1 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.popular ? 'text-green-200' : 'text-gray-500'
                  }`}
                >
                  {plan.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className={`text-4xl font-black ${plan.priceClass}`}>
                  {getPrice(plan)}
                </div>
                {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
                  <p
                    className={`text-sm mt-1 ${
                      plan.popular ? 'text-green-200' : 'text-gray-400'
                    }`}
                  >
                    / mes {annual ? '(facturado anualmente)' : '(mes a mes)'}
                  </p>
                )}
              </div>

              {/* Features list */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-[#F59E0B]' : 'text-[#1B4332]'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.popular ? 'text-green-100' : 'text-gray-600'
                      }`}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.ctaHref}
                id={`pricing-cta-${plan.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('captura')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`w-full text-center py-3.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${plan.ctaClass}`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
