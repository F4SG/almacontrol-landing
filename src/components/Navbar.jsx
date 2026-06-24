import { useState, useEffect } from 'react'
import { Package, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Problema', href: '#problema' },
  { label: 'Características', href: '#caracteristicas' },
  { label: 'Precios', href: '#precios' },
  { label: 'Contacto', href: '#captura' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={(e) => handleNavClick(e, '#inicio')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-[#1B4332] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1B4332] tracking-tight">
              AlmaControl
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-gray-600 hover:text-[#1B4332] transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#1B4332] transition-all duration-200 group-hover:w-full rounded-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/login"
              className="text-sm font-semibold text-[#1B4332] hover:underline transition-colors"
            >
              Iniciar Sesión
            </a>
            <a
              href="/register"
              className="inline-flex items-center px-5 py-2.5 bg-[#F59E0B] text-gray-900 text-sm font-semibold rounded-lg hover:bg-[#D97706] transition-all duration-200 hover:shadow-md active:scale-95"
            >
              Registrarse
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#1B4332] hover:bg-gray-100 transition-colors"
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-[#1B4332] hover:bg-green-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className="mt-2 px-4 py-3 text-[#1B4332] text-sm font-semibold rounded-lg text-center hover:bg-green-50 transition-colors"
            >
              Iniciar Sesión
            </a>
            <a
              href="/register"
              className="mt-1 px-4 py-3 bg-[#F59E0B] text-gray-900 text-sm font-semibold rounded-lg text-center hover:bg-[#D97706] transition-colors"
            >
              Registrarse
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
