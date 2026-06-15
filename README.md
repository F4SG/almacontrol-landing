# AlmaControl — WMS SaaS Landing Page

Landing page comercial para **AlmaControl**, un Sistema de Gestión de Almacenes (WMS) SaaS diseñado para PYME y distribuidoras bolivianas.

## 🚀 Demo en vivo

> Ejecutar localmente con los pasos de abajo.

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | UI framework |
| Vite | 8 | Build tool y dev server |
| Tailwind CSS | v4 | Estilos utilitarios |
| lucide-react | latest | Íconos |

## 📦 Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/F4SG/almacontrol-landing.git
→ En Windows, buscar la carpeta del usuario (ej: C:\Users\ykira\almacontrol-landing)
cd almacontrol-landing
# 2. Instalar dependencias
npm install
# 3. Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173/**

## 📄 Estructura del Proyecto

```
src/
├── components/
│   ├── Navbar.jsx          # Navbar sticky con menú hamburguesa
│   ├── Hero.jsx            # Sección principal con CTA
│   ├── ProblemSolution.jsx # Pain points y soluciones
│   ├── Features.jsx        # 5 características principales
│   ├── Pricing.jsx         # 3 planes con toggle mensual/anual
│   ├── Testimonials.jsx    # Testimonios y métricas de éxito
│   ├── CaptureForm.jsx     # Formulario de registro con validaciones
│   ├── Modal.jsx           # Modal de confirmación con imagen
│   └── Footer.jsx          # Footer con links legales
├── App.jsx                 # Componente raíz
├── main.jsx                # Entry point
└── index.css               # Estilos globales + Tailwind
```

## 🎯 Secciones de la Landing Page

1. **Hero** — Titular, subtítulo, CTAs y foto de almacén real
2. **Problema / Solución** — 3 pain points → 3 soluciones
3. **Características** — 5 funcionalidades clave con íconos
4. **Precios** — Gratuito / Pro / Enterprise con toggle mensual-anual
5. **Testimonios** — 3 testimonios simulados + métricas de éxito
6. **Formulario de captura** — Validación client-side + modal de agradecimiento
7. **Footer** — Links de producto, empresa y legales

## ✅ Funcionalidades Técnicas

- **Responsivo**: Mobile-first (375px → 768px → 1024px+)
- **Formulario**: Validación de campos obligatorios + formato de email con regex
- **Modal**: Con imagen, cierra con X, Escape o clic fuera del card
- **Sin backend**: `e.preventDefault()`, sin fetch a ninguna API
- **Scroll suave**: `scroll-behavior: smooth` + listeners de scroll en Navbar
- **Sin errores en consola**: Keys en listas, props válidas

## 👥 Equipo

> Proyecto desarrollado en Bolivia 🇧🇴

---

© 2026 AlmaControl. Todos los derechos reservados.
