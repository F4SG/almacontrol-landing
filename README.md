# AlmaControl — Sistema SaaS de Gestión de Inventario

> Sistema de Inventario y Almacenes para PYMEs Bolivianas.  
> **Monorepo:** Frontend (React) + Backend (Laravel 11) en un solo repositorio.

🌐 **Landing Page + App:** [https://almacontrol.shop](https://almacontrol.shop)  
⚙️ **API REST:** [https://api.almacontrol.shop](https://api.almacontrol.shop)

---

## Estructura del Repositorio

```
almacontrol-landing/
├── src/                        # Frontend — React + Vite + Tailwind
│   ├── components/             # Componentes de la Landing Page
│   ├── app/
│   │   ├── pages/              # Páginas del sistema interno (Dashboard, Productos, etc.)
│   │   ├── components/         # Layout, Sidebar, Rutas privadas
│   │   ├── context/            # AuthContext (estado global del usuario)
│   │   └── services/           # api.js (cliente HTTP hacia el backend)
│   └── App.jsx                 # Rutas principales
├── backend/                    # Backend — Laravel 11 + MySQL + Sanctum
│   ├── app/
│   │   ├── Http/Controllers/Api/  # Controladores REST
│   │   ├── Models/             # Modelos Eloquent
│   │   └── Mail/               # Clases de correos electrónicos
│   ├── resources/views/emails/ # Templates HTML de correos (Blade)
│   ├── routes/api.php          # Definición de todas las rutas de la API
│   └── README.md               # Documentación detallada del backend
├── README.md                   # Este archivo (visión general del proyecto)
└── almacontrol (1).sql         # Dump de la base de datos con datos de prueba
```

---

## ¿Qué es AlmaControl?

AlmaControl es una plataforma SaaS B2B Multi-Tenant que permite a distribuidoras y comercios bolivianos gestionar su inventario en tiempo real. Cada empresa cliente tiene su propio espacio completamente aislado de datos.

**Funcionalidades:**
- 📦 Gestión de Productos con fotos y códigos de barras/QR
- 🏪 Almacenes con mapas de ubicaciones interactivos
- 📊 Control de Inventario con entradas y salidas en tiempo real
- 🛒 Órdenes de Compra y Venta
- 🔔 Alertas automáticas de stock crítico
- 🚚 Gestión de Proveedores
- 👤 Gestión de Personal con roles y permisos
- 📋 Exportación de reportes en CSV
- 📸 Escáner de código de barras por cámara del celular

---

## 🔄 Flujo Completo SaaS — Cómo entra una empresa nueva

```
1. El cliente llena el formulario en almacontrol.shop
   (Nombre, Correo, Empresa, Tamaño de empresa)

2. El sistema guarda el Lead en la base de datos
   → Se envía email de notificación al Super-Admin

3. El Super-Admin inicia sesión y va a "Aprobar Leads"
   → Ve la tabla de solicitudes pendientes
   → Hace clic en "Aprobar"

4. Al aprobar, el sistema automáticamente:
   ✓ Crea la Empresa en la base de datos
   ✓ Crea un Usuario con rol de Administrador
   ✓ Genera una contraseña aleatoria temporal (8 caracteres)
   ✓ Envía un correo al cliente con sus credenciales

5. El cliente recibe el correo con su contraseña temporal
   → Al iniciar sesión por primera vez, la contraseña
     cambia automáticamente a "password"

6. El cliente gestiona su inventario en su espacio aislado
   → Puede crear su propio personal (Encargados, Vendedores)
```

---

## 👤 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso total: productos, almacenes, proveedores, órdenes, alertas, personal, inventario, reportes |
| **Encargado** | Productos (lectura/escritura), inventario, movimientos, órdenes, alertas |
| **Vendedor** | Solo lectura: productos, inventario |

---

## 🔐 Usuarios y Accesos Pre-creados (Multi-Tenant Demo)

La contraseña por defecto para todos los usuarios es **`password`**.

---

### ⭐ Super-Admin del Sistema

| Correo | Contraseña | Descripción |
|--------|------------|-------------|
| `admin@almacontrol.bo` | `admin123` | Acceso total. Aprueba Leads desde `/leads`. |

---

### 🏢 Empresa 1 — Distribuidora El Coloso

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `inventario@gmail.com` | `password` |
| Encargado | `bodega@gmail.com` | `password` |
| Vendedor | `distribuidora.coloso0@gmail.com` | `password` |

---

### 🏢 Empresa 2 — Ferretería Don Remigio

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `remigio@gmail.com` | `password` |
| Encargado | `alberto.obrer.0@gmail.com` | `password` |
| Vendedor | `lineker.campos.0@gmail.com` | `password` |

---

### 🏢 Empresa 3 — Farmacia San Lucas

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `farcia.sanlucas@gmail.com` | `password` |
| Vendedor | `garcia.fharma.0@gmail.com` | `password` |

---

### 🏢 Empresa 4 — Almacenes La Señora Betty

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `betty.almacenes@gmail.com` | `password` |
| Encargado | `operaciones.betty.0@gmail.com` | `password` |

---

### 🏢 Empresa 5 — Wartaz *(creada por flujo SaaS real)*

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `sgf6002402@est.univalle.edu` | `password` |

> ✅ Esta empresa fue creada a través del flujo completo SaaS: formulario → aprobación → correo automático → primer login con cambio automático de contraseña.

---

## 🏗️ Arquitectura Multi-Tenant

```
┌─────────────────────────────────────────────┐
│           almacontrol.shop                  │
│     Landing Page + App (React/Vite)         │
└──────────────────┬──────────────────────────┘
                   │ HTTPS (Bearer Token)
┌──────────────────▼──────────────────────────┐
│         api.almacontrol.shop                │
│       Backend REST API (Laravel 11)         │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  │
│  │Empresa 1│  │Empresa 2 │  │Empresa N │  │
│  │id = 1   │  │id = 2    │  │id = N    │  │
│  └─────────┘  └──────────┘  └──────────┘  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│      almakchh_almacontrol (MySQL)           │
│  Aislamiento por columna id_empresa         │
└─────────────────────────────────────────────┘
```

---

## Instalación Local

### Frontend
```bash
npm install
npm run dev
# Disponible en http://localhost:5173
```

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
# API disponible en http://localhost:8000/api
```

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Laravel 11, PHP 8.2, Laravel Sanctum |
| Base de datos | MySQL 8.0 |
| Hosting | cPanel (server166.web-hosting.com) |
| Correos | SMTP (admin@almacontrol.shop) |

---

*© 2026 AlmaControl — Sistema de Gestión de Inventario SaaS para PYMEs Bolivianas*
