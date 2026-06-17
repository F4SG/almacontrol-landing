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

El proyecto está unificado en un solo repositorio. Al clonarlo, verás esta estructura:

### 1. Raíz del proyecto (Frontend)
* **¿Qué es?** Es la cara visual del sistema y la Landing Page publicitaria.
* **¿Qué contiene?** Todo el código escrito en React (Vite), diseño (Tailwind CSS v4) y la lógica de interfaz de usuario.
* **¿Cómo arranca?** Ejecutando `npm run dev` desde la raíz.

### 2. Carpeta `backend/` (Backend)
* **¿Qué es?** Es el cerebro del sistema, la lógica de negocio y la API REST.
* **¿Qué contiene?** El código escrito en PHP (Laravel 12), las validaciones, reglas de seguridad y la conexión con la base de datos MySQL.
* **¿Cómo arranca?** Ejecutando `php artisan serve` desde dentro de la carpeta `backend/`.

---

## 🚀 INICIO RÁPIDO PARA CLONAR EL REPO

### Paso 1 — Iniciar MySQL con XAMPP

1. Abrir **XAMPP Control Panel**
2. Hacer clic en **Start** junto a **MySQL** y **Apache**
3. Verificar que el puerto de MySQL sea **3306**

### Paso 2 — Importar la base de datos

1. Abrir **http://localhost/phpmyadmin** en el navegador
2. Clic en **Nueva** (panel izquierdo)
3. Nombre: `almacontrol` → **Crear**
4. Seleccionar la base `almacontrol` → pestaña **Importar**
5. Elegir el archivo: `almacontrol (1).sql` (ubicado en la raíz del proyecto)
6. Clic en **Importar**

### Paso 3 — Configurar y arrancar el backend

Abre una terminal en la carpeta `backend/` del proyecto y ejecuta:

```powershell
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan db:seed --class=AdminSeeder
php artisan serve
```

El servidor de la API correrá en → **http://localhost:8000**

### Paso 4 — Configurar y arrancar el frontend

Abre **otra** terminal en la raíz del proyecto (fuera de la carpeta backend) y ejecuta:

```powershell
npm install
npm run dev
```

El frontend correrá en → **http://localhost:5173**

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
2. Abre tu navegador y entra a: [http://localhost/phpmyadmin](http://localhost/phpmyadmin) *(Si tu Apache usa el puerto 8012, entra a [http://localhost:8012/phpmyadmin](http://localhost:8012/phpmyadmin))*
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

## 📖 Guía de Uso del Sistema (Flujo Completo)

Para experimentar cómo funciona AlmaControl en la vida real, te recomendamos seguir este flujo paso a paso:

### 1. Registro y Acceso
1. Entra a **http://localhost:5173/register** y crea una cuenta nueva.
2. Inicia sesión. Serás redirigido al **Dashboard**, que inicialmente estará en ceros.

### 2. Configuración Inicial (Bases del Almacén)
1. Ve a **Almacenes** en el menú lateral. Haz clic en "Nuevo almacén" y créalo.
2. En la tarjeta del almacén, haz clic en **Ubicaciones** y agrega algunos espacios (ej: Pasillo 1, Estante 1, Nivel 1).
3. Ve a **Proveedores** y registra al menos un proveedor para tu mercadería.

### 3. Crear el Catálogo de Productos
1. Ve a **Productos** -> **Nuevo producto**.
2. Completa los datos. **💡 Puntos clave para probar:**
   - Escribe un **Código de barras** real (puedes tomar cualquier producto que tengas a mano).
   - Establece un **Stock mínimo** (ej. 10) para ver cómo funcionan las alertas automáticas.

### 4. Ingreso de Mercadería y Mapa Visual
1. Ve a **Inventario** -> **Registrar Movimiento**.
2. Selecciona tipo **Entrada**, elige tu producto, tu almacén y registra una cantidad inicial alta (ej. 50).
3. Vuelve a **Almacenes** y haz clic en **Ver mapa**. 
   - Verás el mapa en grilla 2D. La celda estará en **Verde (Normal)**.
   - Si haces clic en la celda, verás el detalle de los productos guardados en ese estante.

### 5. Escáner Móvil (Cámara)
1. Ve a la pestaña **Escáner** desde tu computadora (si tiene webcam) o desde tu celular.
2. Apunta la cámara al código de barras real del producto que registraste en el paso 3.
3. El sistema lo detectará automáticamente y te mostrará su stock actual.
4. Registra una **Salida** de stock rápidamente desde allí mismo, sin usar el teclado.

### 6. Alertas de Stock y Órdenes de Reposición a 1-Clic
1. Realiza más **Salidas** (desde el Escáner o Inventario) hasta que el stock de tu producto baje del mínimo que estableciste (ej. que queden 5 unidades).
2. Verás que la campana de **Alertas** (arriba a la derecha) se ilumina.
3. Ve a la página de **Alertas**. Ahí estará la notificación de *STOCK MÍNIMO*.
4. Haz clic en el botón **"Reponer"** dentro de la alerta. Te abrirá un modal rápido.
5. Elige la cantidad a pedir y haz clic. ¡Listo! El sistema habrá generado una **Orden de Compra** automáticamente y habrá marcado la alerta como leída.

### 7. Historial y Reportes en Excel
1. Ve a **Movimientos** para ver la bitácora completa de todo lo que acaba de suceder (Entradas, Salidas, quién lo hizo y a qué hora).
2. Haz clic en el botón **Exportar CSV** para descargar un reporte limpio y listo para abrir en Excel.

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
