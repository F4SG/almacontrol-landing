import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        id="modal-card"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative animate-[fadeInScale_0.25s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close button */}
        <button
          id="modal-close-btn"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header image strip */}
        <div className="relative h-44 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80&auto=format&fit=crop"
            alt="Almacén organizado AlmaControl"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(27,67,50,0.4) 0%, rgba(27,67,50,0.85) 100%)',
            }}
          />
          {/* Success badge over image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1B4332"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="text-white font-bold text-lg tracking-wide drop-shadow">
              ¡Registro exitoso!
            </p>
          </div>
        </div>

        {/* Body content */}
        <div className="p-7 flex flex-col gap-5 text-center">
          <div>
            <h3
              id="modal-title"
              className="text-xl font-extrabold text-gray-900 mb-2"
            >
              Bienvenido/a a AlmaControl 🎉
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Te contactaremos en las próximas{' '}
              <span className="font-semibold text-gray-700">24 horas</span> con tus
              credenciales de acceso y el link para comenzar tu prueba gratuita de 14 días.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl text-sm text-gray-500">
            <p>📧 Revisa también tu carpeta de spam</p>
            <p>📱 Te contactaremos también por WhatsApp</p>
            <p>🇧🇴 Soporte en español, desde Bolivia</p>
          </div>

          <button
            id="modal-close-primary-btn"
            onClick={onClose}
            className="w-full py-3.5 bg-[#1B4332] text-white font-bold rounded-xl hover:bg-[#163829] transition-colors active:scale-95 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
