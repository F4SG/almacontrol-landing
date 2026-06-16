# AlmaControl — Sistema SaaS de Gestión de Inventario

Sistema de inventario y almacenes para PYME bolivianas.  
**Stack:** Laravel 12 + Sanctum (API REST) · React 19 + Vite + Tailwind CSS v4

---

## Requisitos previos

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| PHP | 8.2 | Incluido en XAMPP |
| MySQL / MariaDB | 10.4+ | Incluido en XAMPP |
| Composer | 2.x | [getcomposer.org](https://getcomposer.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| XAMPP | 3.x | [apachefriends.org](https://www.apachefriends.org) |

---

## Estructura del proyecto

```
c:\AlmaControl\           ← Frontend (este repo) — Landing + App interna
c:\almacontrol-backend\   ← Backend Laravel 12 API
```

---

## 🚀 INICIO RÁPIDO

### Paso 1 — Iniciar MySQL con XAMPP

1. Abrir **XAMPP Control Panel**
2. Hacer clic en **Start** junto a **MySQL**
3. Verificar que el puerto sea **3306**

### Paso 2 — Importar la base de datos

1. Abrir **http://localhost/phpmyadmin** en el navegador
2. Clic en **Nueva** (panel izquierdo)
3. Nombre: `almacontrol` → **Crear**
4. Seleccionar la base `almacontrol` → pestaña **Importar**
5. Elegir el archivo: `c:\AlmaControl\almacontrol (1).sql`
6. Clic en **Importar**

> ✅ La BD incluye los seeds de: roles, categorías y tipos de orden

### Paso 3 — Configurar y arrancar el backend

```powershell
# Terminal 1 — desde c:\almacontrol-backend\
php artisan migrate --path=database/migrations/2026_06_16_194426_create_personal_access_tokens_table.php --force
php artisan db:seed --class=AdminSeeder
php artisan serve
```

El servidor corre en → **http://localhost:8000**

### Paso 4 — Arrancar el frontend

```powershell
# Terminal 2 — desde c:\AlmaControl\
npm run dev
```

El frontend corre en → **http://localhost:5173**

---

## 🔐 Credenciales de prueba

| Campo | Valor |
|---|---|
| Correo | `admin@almacontrol.bo` |
| Contraseña | `Admin123!` |
| Rol | Administrador |

---

## 🌐 URLs del sistema

| URL | Descripción |
|---|---|
| http://localhost:5173 | Landing page |
| http://localhost:5173/login | Iniciar sesión |
| http://localhost:5173/register | Registrar nueva cuenta |
| http://localhost:5173/dashboard | Panel principal (requiere login) |
| http://localhost:5173/productos | Gestión de productos |
| http://localhost:5173/inventario | Entradas y salidas de stock |
| http://localhost:5173/movimientos | Historial de movimientos |
| http://localhost:5173/almacenes | Gestión de almacenes |
| http://localhost:5173/ordenes | Órdenes de compra/venta |
| http://localhost:5173/alertas | Alertas de stock |
| http://localhost:8000/api | API REST base |

---

## 🗄️ ¿Cómo visualizar y gestionar la Base de Datos?

### Opción A — phpMyAdmin (Interfaz Gráfica - RECOMENDADO)

Dado que estás usando XAMPP, la forma más fácil y visual de ver todos los datos, usuarios, contraseñas y tablas es usando phpMyAdmin:

1. Asegúrate de que **MySQL** y **Apache** estén corriendo en tu panel de XAMPP.
2. Abre tu navegador y entra a: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
3. En la barra lateral izquierda, busca y haz clic en la base de datos llamada **`almacontrol`**.
4. ¡Listo! Ahí verás todas las tablas. Puedes hacer clic en `usuario` para ver las contraseñas encriptadas, o en `producto` para ver tu inventario.

**Tablas principales que te pueden interesar:**
| Tabla | Descripción |
|---|---|
| `usuario` | Usuarios del sistema, sus correos y contraseñas (encriptadas) |
| `producto` | Tu catálogo de productos |
| `inventario` | Stock actual separado por almacén |
| `movimiento_inventario` | Historial de todas las entradas y salidas de stock |
| `alerta` | Alertas generadas de stock mínimo o agotado |
| `ordenes` + `detalle_orden` | Órdenes de compra y venta |
| `personal_access_tokens` | Tokens de sesión activos (Sanctum) |

### Opción B — MySQL desde terminal

```powershell
# Conectar
mysql -u root -p almacontrol

# Consultas útiles
SELECT * FROM usuario;
SELECT * FROM producto WHERE activo = 1;
SELECT * FROM inventario;
SELECT * FROM movimiento_inventario ORDER BY fecha DESC LIMIT 10;
SELECT * FROM alerta WHERE leida = 0;
SELECT * FROM personal_access_tokens;
```

---

## 🧪 Probar la API con Postman / Thunder Client

### 1 — Registrar usuario nuevo
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "nombre": "Carlos",
  "apellido": "Mendoza",
  "correo": "carlos@empresa.com",
  "contrasena": "password123",
  "telefono": "70123456"
}
```
**Respuesta esperada (201):**
```json
{ "token": "1|abc...", "user": { "id_usuario": 2, "nombre": "Carlos", ... } }
```

### 2 — Login
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "correo": "admin@almacontrol.bo",
  "contrasena": "Admin123!"
}
```
**Respuesta esperada (200):**
```json
{ "token": "2|Qkr7...", "user": { "id_usuario": 1, "rol": { "nombre": "Administrador" } } }
```

> ⚠️ Copia el `token` de la respuesta para los siguientes requests.

### 3 — Dashboard (requiere token)
```http
GET http://localhost:8000/api/dashboard
Authorization: Bearer 2|Qkr7...
```

### 4 — Listar productos
```http
GET http://localhost:8000/api/productos
Authorization: Bearer 2|Qkr7...
```

### 5 — Crear producto
```http
POST http://localhost:8000/api/productos
Authorization: Bearer 2|Qkr7...
Content-Type: application/json

{
  "nombre": "Arroz 1kg",
  "id_categoria": 2,
  "precio_costo": 8.50,
  "precio_venta": 12.00,
  "stock_minimo": 10,
  "unidad_medida": "kg"
}
```

### 6 — Registrar entrada de inventario
```http
POST http://localhost:8000/api/inventario/entrada
Authorization: Bearer 2|Qkr7...
Content-Type: application/json

{
  "id_producto": 1,
  "id_almacen": 1,
  "cantidad": 50,
  "observaciones": "Compra inicial"
}
```

### 7 — Registrar salida (genera alerta si llega al mínimo)
```http
POST http://localhost:8000/api/inventario/salida
Authorization: Bearer 2|Qkr7...
Content-Type: application/json

{
  "id_producto": 1,
  "id_almacen": 1,
  "cantidad": 5
}
```

### 8 — Ver alertas
```http
GET http://localhost:8000/api/alertas
Authorization: Bearer 2|Qkr7...
```

### 9 — Logout
```http
POST http://localhost:8000/api/auth/logout
Authorization: Bearer 2|Qkr7...
```

---

## ⚡ Comandos útiles de Laravel

```powershell
# Ver todas las rutas API
php artisan route:list --path=api

# Limpiar caché de configuración
php artisan config:clear && php artisan cache:clear

# Acceder a la consola interactiva
php artisan tinker

# Verificar usuario admin en consola
# (dentro de tinker)
App\Models\Usuario::with('rol')->find(1)

# Ver tokens activos
DB::table('personal_access_tokens')->get()
```

---

## 🏗️ Arquitectura

```
request → routes/api.php → Controller → Model (Eloquent) → MySQL → JSON → React
```

### Backend (`c:\almacontrol-backend\`)

```
app/
├── Http/Controllers/Api/
│   ├── AuthController.php        ← register, login, logout, me
│   ├── DashboardController.php   ← estadísticas + stock crítico
│   ├── ProductoController.php    ← CRUD productos
│   ├── AlmacenController.php     ← CRUD almacenes
│   ├── ProveedorController.php   ← CRUD proveedores
│   ├── InventarioController.php  ← entrada, salida, movimientos
│   ├── OrdenController.php       ← órdenes con DB::transaction
│   ├── AlertaController.php      ← alertas de stock
│   └── CategoriaController.php   ← listar categorías
├── Models/                       ← 20 modelos Eloquent
│   ├── Usuario.php   (tabla: usuario, PK: id_usuario)
│   ├── Producto.php  (tabla: producto, PK: id_producto)
│   ├── Almacen.php   (tabla: almacen, PK: id_almacen)
│   └── ...
└── Http/Requests/
    └── ProductoRequest.php       ← validaciones
```

### Frontend (`c:\AlmaControl\src\`)

```
app/
├── context/AuthContext.jsx       ← estado global de autenticación
├── components/
│   ├── PrivateRoute.jsx          ← redirige a /login sin token
│   ├── AppLayout.jsx             ← sidebar + header
│   └── Spinner.jsx
├── services/api.js               ← todas las llamadas HTTP
└── pages/
    ├── Login.jsx / Register.jsx  ← auth
    ├── Dashboard.jsx             ← estadísticas reales
    ├── Productos.jsx             ← lista paginada
    ├── ProductoForm.jsx          ← crear/editar
    ├── Almacenes.jsx
    ├── Inventario.jsx            ← tabla stock + formulario entrada/salida
    ├── Movimientos.jsx           ← historial con filtros
    ├── Ordenes.jsx               ← crear órdenes con detalles
    └── Alertas.jsx               ← alertas de stock
```

---

## 🔧 Solución de problemas

| Error | Causa | Solución |
|---|---|---|
| `Connection refused` en login | Backend no corre | Ejecutar `php artisan serve` en `c:\almacontrol-backend` |
| `Error de conexión` en la landing | Backend no corre | Ídem arriba |
| `SQLSTATE[HY000] [2002]` | MySQL no está activo | Iniciar MySQL en XAMPP |
| `401 No autenticado` | Token expirado o inválido | Hacer logout y login de nuevo |
| `422` en registro | Correo ya existe | Usar otro correo o verificar en phpMyAdmin |
| `No puedo ver /dashboard` | Sin token | Hacer login primero en `/login` |

---

## 📋 Checklist de entrega

- [x] Autenticación Sanctum (register/login/logout/me)
- [x] Modelos Eloquent con `$table` y `$primaryKey` en español
- [x] CRUD Productos con validaciones y soft-delete
- [x] CRUD Almacenes y Proveedores
- [x] Inventario: entradas, salidas, alertas automáticas
- [x] Dashboard con datos reales de la BD
- [x] Órdenes con transacción DB
- [x] Alertas STOCK_MINIMO y STOCK_CERO automáticas
- [x] PrivateRoute en frontend (rutas protegidas)
- [x] CaptureForm conectada al backend real
- [x] Navbar con botones Login/Registrarse
- [x] CORS configurado para localhost:5173
- [x] Cero datos hardcodeados — todo desde la BD
