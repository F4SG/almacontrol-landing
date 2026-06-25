# AlmaControl — Backend (WMS SaaS)

> Sistema de Gestión de Inventario (Warehouse Management System) multi-tenant para PYMEs bolivianas.  
> Backend construido en **Laravel 11** + **MySQL** + **Laravel Sanctum** (API tokens).  
> Frontend React en: [almacontrol.shop](https://almacontrol.shop) | API en: [api.almacontrol.shop](https://api.almacontrol.shop)

---

## Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura Multi-Tenant](#arquitectura-multi-tenant)
3. [Flujos de Usuario](#flujos-de-usuario)
4. [Roles y Permisos](#roles-y-permisos)
5. [Empresas y Usuarios de Prueba](#empresas-y-usuarios-de-prueba)
6. [Endpoints de la API](#endpoints-de-la-api)
7. [Instalación Local](#instalación-local)
8. [Variables de Entorno](#variables-de-entorno)
9. [Estructura del Proyecto](#estructura-del-proyecto)

---

## Descripción General

AlmaControl es una plataforma SaaS B2B que permite a distribuidoras y comercios bolivianos gestionar su inventario en tiempo real desde el celular o PC. Cada empresa cliente tiene su propio espacio aislado de datos (Multi-Tenancy por columna `id_empresa`).

**Funcionalidades principales:**
- 📦 Gestión de Productos con fotos y códigos de barras/QR
- 🏪 Gestión de Almacenes con mapas de ubicaciones
- 📊 Control de Inventario con entradas y salidas
- 🛒 Órdenes de Compra y Venta
- 🔔 Alertas automáticas de stock crítico
- 🚚 Gestión de Proveedores
- 👤 Gestión de Personal con roles
- 📋 Exportación de reportes CSV
- 📸 Escáner de código de barras por cámara

---

## Arquitectura Multi-Tenant

El aislamiento de datos se implementa mediante la columna `id_empresa` en todas las tablas principales. **Cada consulta al servidor filtra automáticamente por la empresa del usuario autenticado.**

```
┌─────────────────────────────────────────────┐
│              almacontrol.shop               │
│           (Frontend React/Vite)             │
└──────────────────┬──────────────────────────┘
                   │ HTTPS (JWT Bearer Token)
┌──────────────────▼──────────────────────────┐
│           api.almacontrol.shop              │
│         (Laravel 11 REST API)               │
│                                             │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  │
│  │Empresa A│  │Empresa B │  │Empresa C │  │
│  │id = 1   │  │id = 2    │  │id = 3    │  │
│  └─────────┘  └──────────┘  └──────────┘  │
│                                             │
│         almakchh_almacontrol (MySQL)        │
└─────────────────────────────────────────────┘
```

**Tablas con aislamiento por empresa:**
- `producto` → `id_empresa`
- `inventario` → (via producto)
- `almacen` → `id_empresa`
- `proveedor` → `id_empresa`
- `orden` → `id_empresa`
- `alerta` → `id_empresa`
- `usuario` → `id_empresa`

---

## Flujos de Usuario

### 🏢 Flujo 1: Registro de Nueva Empresa (SaaS)

```
1. El cliente llena el formulario en almacontrol.shop (Landing Page)
   → Nombre, Correo, Empresa, Tamaño de empresa

2. El sistema guarda el Lead en la base de datos
   → Tabla: leads
   → Se envía email de notificación a admin@almacontrol.bo

3. El Super-Admin revisa los leads en /leads dentro del dashboard
   → Ve la tabla de solicitudes pendientes
   → Da clic en "Aprobar"

4. Al aprobar, el sistema automáticamente:
   a) Crea la Empresa en la tabla `empresa`
   b) Crea un Usuario Admin con rol id_rol=1
   c) Genera una contraseña aleatoria temporal (8 caracteres)
   d) Envía un correo al cliente con sus credenciales

5. El cliente recibe el correo con:
   → Correo electrónico (su correo registrado)
   → Contraseña temporal aleatoria
   → Botón de acceso directo a almacontrol.shop/login
   → Nota: la contraseña cambia a "password" en el primer ingreso

6. El cliente inicia sesión con la contraseña temporal
   → El sistema detecta primer_acceso = true
   → Cambia automáticamente la contraseña a "password"
   → El usuario queda activo con su empresa y datos aislados
```

### 👤 Flujo 2: Creación de Personal Interno

```
1. El Admin de la empresa va a la sección "Personal"
2. Hace clic en "Nuevo Usuario"
3. Llena el formulario: nombre, correo, rol (Admin/Encargado/Vendedor)
4. El sistema crea el usuario asignado a la misma empresa (id_empresa)
5. El nuevo empleado inicia sesión con las credenciales creadas
```

### ❌ Flujo 3: Registro Público — BLOQUEADO

```
El endpoint POST /api/auth/register devuelve 403.
El registro directo está deshabilitado por diseño.
Los nuevos clientes DEBEN pasar por el formulario de la Landing Page.
Los empleados DEBEN ser creados por el Admin de su empresa.
Esto evita usuarios "huérfanos" sin empresa asignada.
```

---

## Roles y Permisos

| Rol | id_rol | Permisos |
|-----|--------|----------|
| **Administrador** | 1 | Acceso total: productos, almacenes, proveedores, órdenes, alertas, personal, inventario |
| **Encargado** | 2 | Productos (lectura/escritura), inventario, movimientos, órdenes, alertas |
| **Vendedor** | 3 | Solo lectura: productos, inventario |

---

## Empresas y Usuarios Pre-creados (Entorno SaaS Multi-Tenant)

### ⭐ Empresa 1 — AlmaControl (Super-Admin)

| Correo | Contraseña | Descripción |
|--------|------------|-------------|
| `admin@almacontrol.bo` | `admin123` | Acceso total. Aprueba Leads desde `/leads`. (Rol 1) |
| `mateouni3@gmail.com` | `password` | Encargado (Rol 2) |
| `franstorm352@gmail.com` | `password` | Administrador (Rol 1) |
| `ale.quispe.coloso@gmail.com` | `password` | Vendedor (Rol 3) |

---

### 🏢 Empresa 2 — Ferretería Don Remigio

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `remigio.soria@gmail.com` | `password` |
| Encargado | `alberto.chura.ferr@gmail.com` | `password` |
| Vendedor | `carmen.quispe.ferr@gmail.com` | `password` |

---

### 🏢 Empresa 3 — Farmacia San Lucas

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `lucia.rojas.sanlucas@gmail.com` | `password` |
| Encargado | `marco.pena.sanlucas@gmail.com` | `password` |
| Vendedor | `sandra.vargas.slucas@gmail.com` | `password` |

---

### 🏢 Empresa 4 — Abarrotes Doña Paty

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `paty.mamani.abarr@gmail.com` | `password` |
| Encargado | `gonza.flores.paty@gmail.com` | `password` |
| Vendedor | `rosa.condori.paty@gmail.com` | `password` |

---

### 🏢 Empresa 5 — Comercial Rumbo

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `felix.condori.rumbo@gmail.com` | `password` |
| Encargado | `naty.choque.rumbo@gmail.com` | `password` |
| Vendedor | `wilmer.quispe.rumbo@gmail.com` | `password` |

---

### 🏢 Empresa 10 — Wartaz *(creada por flujo SaaS real)*

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | `sgf6002402@est.univalle.edu` | `password` |

> ✅ Esta empresa fue creada a través del flujo completo SaaS: formulario en Landing → aprobación de Lead → correo automático con credenciales → primer login con cambio automático de contraseña.

---

## Endpoints de la API

### 🔓 Públicos (sin autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Iniciar sesión |
| `POST` | `/api/auth/register` | **BLOQUEADO** (devuelve 403) |
| `POST` | `/api/leads` | Registrar solicitud de nueva empresa |
| `GET`  | `/api/leads` | Listar leads pendientes de aprobación |
| `GET`  | `/api/leads/{id}/approve` | Aprobar un lead (crea empresa + usuario + envía correo) |

### 🔐 Protegidos (requieren Bearer Token)

| Método | Endpoint | Roles | Descripción |
|--------|----------|-------|-------------|
| `GET` | `/api/auth/me` | Todos | Datos del usuario autenticado |
| `POST` | `/api/auth/logout` | Todos | Cerrar sesión |
| `GET` | `/api/dashboard` | Todos | Resumen del sistema |
| `GET` | `/api/productos` | Todos | Listar productos (filtrado por empresa) |
| `POST` | `/api/productos` | Admin, Encargado | Crear producto |
| `PUT` | `/api/productos/{id}` | Admin, Encargado | Actualizar producto |
| `DELETE` | `/api/productos/{id}` | Admin, Encargado | Eliminar producto |
| `GET` | `/api/almacenes` | Todos | Listar almacenes |
| `POST` | `/api/almacenes` | Admin | Crear almacén |
| `GET` | `/api/proveedores` | Todos | Listar proveedores |
| `GET` | `/api/inventario` | Todos | Ver inventario actual |
| `POST` | `/api/inventario/entrada` | Admin, Encargado | Registrar entrada de stock |
| `POST` | `/api/inventario/salida` | Admin, Encargado | Registrar salida de stock |
| `GET` | `/api/movimientos` | Todos | Historial de movimientos |
| `GET` | `/api/ordenes` | Todos | Listar órdenes |
| `POST` | `/api/ordenes` | Admin, Encargado | Crear orden |
| `GET` | `/api/alertas` | Todos | Ver alertas de stock |
| `GET` | `/api/usuarios` | Admin | Listar personal de la empresa |
| `POST` | `/api/usuarios` | Admin | Crear nuevo usuario |
| `GET` | `/api/reportes/inventario-csv` | Admin, Encargado | Exportar inventario CSV |
| `GET` | `/api/reportes/movimientos-csv` | Admin, Encargado | Exportar movimientos CSV |

---

## Instalación Local

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd almacontrol-backend

# 2. Instalar dependencias PHP
composer install

# 3. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de base de datos y correo

# 4. Generar clave de aplicación
php artisan key:generate

# 5. Ejecutar migraciones y seeders
php artisan migrate --seed

# 6. Iniciar servidor de desarrollo
php artisan serve
```

La API estará disponible en `http://localhost:8000/api`

---

## Variables de Entorno

```env
APP_NAME=AlmaControl
APP_ENV=production
APP_URL=https://api.almacontrol.shop

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=almakchh_almacontrol
DB_USERNAME=almakchh_admin
DB_PASSWORD=***

MAIL_MAILER=smtp
MAIL_HOST=server166.web-hosting.com   # Host del servidor de hosting
MAIL_PORT=465
MAIL_USERNAME=admin@almacontrol.shop
MAIL_PASSWORD=***
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=admin@almacontrol.shop
MAIL_FROM_NAME="AlmaControl Sistema"
MAIL_ADMIN_ADDRESS=franquito2712@gmail.com  # Recibe notificaciones de leads

SANCTUM_STATEFUL_DOMAINS=almacontrol.shop
SESSION_DOMAIN=.almacontrol.shop
```

---

## Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/Api/
│   │   ├── AuthController.php        # Login, logout, me, register (bloqueado)
│   │   ├── LeadController.php        # index, store, approve (flujo SaaS)
│   │   ├── DashboardController.php   # Resumen del sistema
│   │   ├── ProductoController.php    # CRUD productos (filtrado por empresa)
│   │   ├── AlmacenController.php     # CRUD almacenes
│   │   ├── InventarioController.php  # Stock, entradas, salidas, movimientos
│   │   ├── OrdenController.php       # Órdenes de compra/venta
│   │   ├── AlertaController.php      # Alertas de stock crítico
│   │   ├── ProveedorController.php   # CRUD proveedores
│   │   ├── UsuarioController.php     # Gestión de personal
│   │   ├── ReporteController.php     # Exportación CSV
│   │   └── UbicacionController.php  # Mapa de almacenes
│   └── Middleware/
│       └── CheckRole.php             # Middleware de control de roles
├── Mail/
│   ├── LeadNotification.php          # Email al admin cuando llega un lead
│   └── WelcomeCredentials.php        # Email al cliente al aprobar su lead
└── Models/
    ├── Usuario.php                   # Auth + relaciones (Sanctum)
    ├── Empresa.php                   # Tenant principal
    ├── Lead.php                      # Solicitudes de acceso
    ├── Producto.php
    ├── Inventario.php
    ├── Almacen.php
    ├── Orden.php
    ├── Alerta.php
    └── Proveedor.php

resources/views/emails/
├── lead_notification.blade.php       # Diseño del email de notificación de lead
└── welcome_credentials.blade.php     # Diseño del email de bienvenida al cliente

routes/
└── api.php                           # Definición de todas las rutas de la API
```

---

## Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Laravel | 11 | Framework principal del backend |
| MySQL | 8.0 | Base de datos relacional |
| Laravel Sanctum | 4.x | Autenticación por API tokens |
| PHP | 8.2 | Lenguaje del servidor |
| Blade | — | Templates para correos electrónicos |
| Dominio | — | GoDaddy (`almacontrol.shop`) |
| cPanel / Hosting | — | Namecheap (Servidor Web de Producción) |

---

## Despliegue en Producción (cPanel)

1. Subir archivos vía FTP o File Manager a `public_html/almacontrol-backend/`
2. Configurar el `.env` con las credenciales de producción
3. Verificar que `public/index.php` sea el punto de entrada del subdominio `api.almacontrol.shop`
4. Asegurarse de que el `MAIL_HOST` sea el hostname del servidor (no el subdominio de correo)
5. Limpiar caché: `php artisan config:cache && php artisan route:cache`

---

*© 2026 AlmaControl — Sistema de Gestión de Inventario SaaS para PYMEs Bolivianas*
