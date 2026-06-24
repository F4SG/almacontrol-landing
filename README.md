# AlmaControl — Sistema SaaS de Gestión de Inventario

> Sistema de Inventario y Almacenes para PYMEs Bolivianas.  
> Stack: **Laravel 11** · **React 18** · **Vite** · **Tailwind CSS**

🌐 **Landing Page (Frontend):** [https://almacontrol.shop](https://almacontrol.shop)  
⚙️ **API REST (Backend):** [https://api.almacontrol.shop](https://api.almacontrol.shop)

---

## ¿Qué es AlmaControl?

AlmaControl es una plataforma SaaS B2B Multi-Tenant que permite a distribuidoras y comercios bolivianos gestionar su inventario en tiempo real desde cualquier dispositivo. Cada empresa cliente tiene su propio espacio completamente aislado de datos.

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

## Accesos en Producción (Nube)

El sistema se encuentra desplegado en la nube y listo para usar. No es necesario configurarlo localmente para probarlo.

| Recurso | URL |
|---------|-----|
| Landing Page (Frontend) | [https://almacontrol.shop](https://almacontrol.shop) |
| API REST (Backend) | [https://api.almacontrol.shop/api](https://api.almacontrol.shop/api) |

---

## 🔐 Usuarios y Accesos Pre-creados (Multi-Tenant Demo)

El sistema funciona como una plataforma SaaS Multi-Empresa. Existen 5 empresas de prueba creadas. En cada una, la contraseña por defecto para todos los usuarios es **`password`**.

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

> ✅ Esta empresa fue creada a través del **flujo completo SaaS**: formulario en la Landing Page → aprobación de Lead por el Super-Admin → correo automático con credenciales → primer login con cambio automático de contraseña.

---

### ⭐ Super-Admin del Sistema

| Correo | Contraseña | Descripción |
|--------|------------|-------------|
| `admin@almacontrol.bo` | `admin123` | Acceso total. Puede ver y aprobar Leads desde `/leads`. |

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

5. El cliente recibe el correo con:
   → Su correo electrónico y contraseña temporal
   → Botón de acceso directo a almacontrol.shop/login
   → Aviso: en el primer ingreso la contraseña cambia a "password"

6. El cliente inicia sesión con la contraseña temporal
   → El sistema detecta que es su primer acceso
   → Cambia automáticamente la contraseña a "password"
   → El cliente queda dentro de su empresa aislada
```

---

## 👤 Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso total: productos, almacenes, proveedores, órdenes, alertas, personal, inventario, reportes |
| **Encargado** | Productos (lectura/escritura), inventario, movimientos, órdenes, alertas |
| **Vendedor** | Solo lectura: productos, inventario |

---

## 🏗️ Arquitectura Multi-Tenant

El aislamiento de datos se implementa mediante la columna `id_empresa` en todas las tablas. Cada request al servidor filtra automáticamente por la empresa del usuario autenticado.

```
Cliente A (Empresa 1) ─┐
Cliente B (Empresa 2) ─┼──► API REST (Laravel 11) ──► BD MySQL
Cliente C (Empresa 3) ─┘         (api.almacontrol.shop)    (Multi-Tenant)
```

---

## Instalación Local

```bash
# Frontend (este repositorio)
git clone https://github.com/F4SG/almacontrol-landing.git
cd almacontrol-landing
npm install
npm run dev
# Disponible en http://localhost:5173

# Backend (repositorio separado)
# Ver: /almacontrol-backend
```

---

*© 2026 AlmaControl — Sistema de Gestión de Inventario SaaS para PYMEs Bolivianas*
