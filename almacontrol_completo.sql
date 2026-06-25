-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 24-06-2026 a las 17:33:15
-- Versión del servidor: 11.4.12-MariaDB-cll-lve-log
-- Versión de PHP: 8.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `almakchh_almacontrol`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alerta`
--

CREATE TABLE `alerta` (
  `id_alerta` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_producto` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `tipo_alerta` enum('STOCK_MINIMO','VENCIMIENTO_PROXIMO','STOCK_CERO') NOT NULL,
  `mensaje` varchar(500) NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_generada` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_leida` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacen`
--

CREATE TABLE `almacen` (
  `id_almacen` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(300) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `almacen`
--

INSERT INTO `almacen` (`id_almacen`, `id_empresa`, `nombre`, `direccion`, `responsable`, `activo`) VALUES
(1, 1, 'AlmaCesar', 'Av los Cusis', 'Cesarini', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_producto`
--

CREATE TABLE `categoria_producto` (
  `id_categoria` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categoria_producto`
--

INSERT INTO `categoria_producto` (`id_categoria`, `id_empresa`, `nombre`, `descripcion`) VALUES
(1, 1, 'General', 'Productos sin categoría específica'),
(2, 1, 'Alimentos', 'Productos alimenticios y bebidas'),
(3, 1, 'Electrónica', 'Equipos y componentes electrónicos'),
(4, 1, 'Ferretería', 'Herramientas y materiales de construcción'),
(5, 1, 'Textil', 'Ropa y telas'),
(6, 1, 'Medicamentos', 'Productos farmacéuticos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conteo_inventario`
--

CREATE TABLE `conteo_inventario` (
  `id_conteo` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_almacen` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `estado` enum('EN_PROCESO','COMPLETADO','CANCELADO') NOT NULL DEFAULT 'EN_PROCESO',
  `fecha_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_fin` datetime DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_conteo`
--

CREATE TABLE `detalle_conteo` (
  `id_detalle_conteo` int(11) NOT NULL,
  `id_conteo` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_ubicacion` int(11) DEFAULT NULL,
  `cantidad_sistema` int(11) NOT NULL,
  `cantidad_contada` int(11) DEFAULT NULL,
  `diferencia` int(11) GENERATED ALWAYS AS (`cantidad_contada` - `cantidad_sistema`) STORED,
  `ajustado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_orden`
--

CREATE TABLE `detalle_orden` (
  `id_detalle` int(11) NOT NULL,
  `id_orden` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_lote` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id_empresa` int(11) NOT NULL,
  `razon_social` varchar(200) NOT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `direccion` varchar(300) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id_empresa`, `razon_social`, `nit`, `direccion`, `telefono`, `correo`, `logo_url`) VALUES
(1, 'Mi Empresa', '0', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura_sin`
--

CREATE TABLE `factura_sin` (
  `id_factura` int(11) NOT NULL,
  `id_orden` int(11) NOT NULL,
  `numero_factura` varchar(50) NOT NULL,
  `cuf` varchar(100) DEFAULT NULL,
  `nit_cliente` varchar(20) DEFAULT NULL,
  `razon_social_cliente` varchar(200) DEFAULT NULL,
  `monto_total` decimal(12,2) NOT NULL,
  `estado_siat` enum('PENDIENTE','ENVIADA','OBSERVADA','ANULADA') NOT NULL DEFAULT 'PENDIENTE',
  `fecha_emision` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_envio_siat` datetime DEFAULT NULL,
  `respuesta_siat` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `id_ubicacion` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id_inventario`, `id_producto`, `id_almacen`, `id_ubicacion`, `cantidad`, `ultima_actualizacion`) VALUES
(1, 1, 1, NULL, 20, '2026-06-18 20:48:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `leads`
--

CREATE TABLE `leads` (
  `id_lead` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `empresa` varchar(150) NOT NULL,
  `tamano_empresa` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `leads`
--

INSERT INTO `leads` (`id_lead`, `nombre`, `correo`, `empresa`, `tamano_empresa`, `created_at`, `updated_at`) VALUES
(10, 'Carlos Juanchi', 'franstorm352@gmail.com', 'El pepe', '11-50', '2026-06-24 22:47:42', '2026-06-24 22:47:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lote`
--

CREATE TABLE `lote` (
  `id_lote` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_producto` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `numero_lote` varchar(100) NOT NULL,
  `fecha_fabricacion` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `cantidad_inicial` int(11) NOT NULL DEFAULT 0,
  `cantidad_actual` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento_inventario`
--

CREATE TABLE `movimiento_inventario` (
  `id_movimiento` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_producto` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `id_lote` int(11) DEFAULT NULL,
  `id_orden` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_movimiento` enum('ENTRADA','SALIDA','AJUSTE_POSITIVO','AJUSTE_NEGATIVO','TRANSFERENCIA') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `stock_antes` int(11) NOT NULL,
  `stock_despues` int(11) NOT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `sincronizado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `movimiento_inventario`
--

INSERT INTO `movimiento_inventario` (`id_movimiento`, `id_empresa`, `id_producto`, `id_almacen`, `id_lote`, `id_orden`, `id_usuario`, `tipo_movimiento`, `cantidad`, `stock_antes`, `stock_despues`, `observaciones`, `fecha`, `sincronizado`) VALUES
(1, 1, 1, 1, NULL, NULL, 1, 'ENTRADA', 20, 0, 20, NULL, '2026-06-18 20:48:42', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id_orden` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_tipo_orden` int(11) NOT NULL,
  `id_almacen_origen` int(11) DEFAULT NULL,
  `id_almacen_destino` int(11) DEFAULT NULL,
  `id_usuario` int(11) NOT NULL,
  `numero_documento` varchar(50) DEFAULT NULL,
  `numero_factura_sin` varchar(50) DEFAULT NULL,
  `estado` enum('PENDIENTE','PROCESADA','ANULADA') NOT NULL DEFAULT 'PENDIENTE',
  `observaciones` text DEFAULT NULL,
  `fecha_orden` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_procesada` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_reposicion`
--

CREATE TABLE `orden_reposicion` (
  `id_reposicion` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_producto` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `cantidad_sugerida` int(11) NOT NULL,
  `estado` enum('SUGERIDA','APROBADA','ENVIADA','RECIBIDA','CANCELADA') NOT NULL DEFAULT 'SUGERIDA',
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT NULL,
  `observaciones` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(8, 'App\\Models\\Usuario', 3, 'almacontrol-token', 'f46c93d7bb8973baa85af2fc92547a2bfdb654c9d61f803b05366d41c220938e', '[\"*\"]', '2026-06-19 17:28:20', NULL, '2026-06-19 17:28:19', '2026-06-19 17:28:20'),
(9, 'App\\Models\\Usuario', 4, 'almacontrol-token', '1e79b751f1a3007626315b37c78cfd98164d94cbca3800e561ba9d399e9ad7b4', '[\"*\"]', '2026-06-19 17:30:55', NULL, '2026-06-19 17:29:48', '2026-06-19 17:30:55'),
(10, 'App\\Models\\Usuario', 5, 'almacontrol-token', '910cb897767790335eaccb853b6238dc73873bd51e4e4962b37d28db9be7fa4d', '[\"*\"]', NULL, NULL, '2026-06-24 18:54:19', '2026-06-24 18:54:19'),
(11, 'App\\Models\\Usuario', 6, 'almacontrol-token', 'abba2a023d3fe5e8df10f6dd72f862084fb4fbb24d4aee5de359bd9c2e88644f', '[\"*\"]', NULL, NULL, '2026-06-24 18:55:19', '2026-06-24 18:55:19'),
(12, 'App\\Models\\Usuario', 9, 'almacontrol-token', '4833ed37ebd391f25d2109a6a9369ecc395a7d79ae0e3dcd571159731bfa2376', '[\"*\"]', NULL, NULL, '2026-06-24 22:26:52', '2026-06-24 22:26:52'),
(13, 'App\\Models\\Usuario', 10, 'almacontrol-token', '3c23d6763db6bb4d0eb1ea2eea881fe09aeab9a1d69f168c2080bb1242e1d4b7', '[\"*\"]', NULL, NULL, '2026-06-24 22:28:23', '2026-06-24 22:28:23'),
(14, 'App\\Models\\Usuario', 11, 'almacontrol-token', 'a0d3c89164bae750f501cfa8caac70d0d6e85776354b682a73cd2c9176ba5608', '[\"*\"]', NULL, NULL, '2026-06-24 22:34:06', '2026-06-24 22:34:06'),
(19, 'App\\Models\\Usuario', 12, 'almacontrol-token', 'f67bb7b622783cf283b2d216e5dcf40ba4a76022093601ad8c3f09986474f1d4', '[\"*\"]', '2026-06-25 01:31:49', NULL, '2026-06-25 00:58:10', '2026-06-25 01:31:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `codigo_barras` varchar(100) DEFAULT NULL,
  `codigo_qr` varchar(100) DEFAULT NULL,
  `codigo_interno` varchar(50) DEFAULT NULL,
  `unidad_medida` varchar(30) NOT NULL DEFAULT 'UNIDAD',
  `precio_costo` decimal(12,2) DEFAULT NULL,
  `precio_venta` decimal(12,2) DEFAULT NULL,
  `stock_minimo` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `id_empresa`, `id_categoria`, `id_proveedor`, `nombre`, `descripcion`, `codigo_barras`, `codigo_qr`, `codigo_interno`, `unidad_medida`, `precio_costo`, `precio_venta`, `stock_minimo`, `activo`) VALUES
(1, 1, 2, NULL, 'Coca cola', 'Bebida Carbonatada', '7771609001660', NULL, '7771609001660', 'U', 8.00, 12.00, 20, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `nombre` varchar(200) NOT NULL,
  `nit` varchar(20) DEFAULT NULL,
  `contacto` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `direccion` varchar(300) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `id_empresa`, `nombre`, `nit`, `contacto`, `telefono`, `correo`, `direccion`, `activo`) VALUES
(1, 1, 'Tecman', NULL, 'Jose', '789456', NULL, 'Avenida Ejemplo 56', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte`
--

CREATE TABLE `reporte` (
  `id_reporte` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_almacen` int(11) DEFAULT NULL,
  `tipo_reporte` varchar(100) NOT NULL,
  `formato` enum('PDF','EXCEL') NOT NULL,
  `parametros` longtext DEFAULT NULL,
  `url_archivo` varchar(500) DEFAULT NULL,
  `fecha_generado` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'Administrador', 'Acceso total al sistema'),
(2, 'Encargado', 'Registro de entradas, salidas y conteos'),
(3, 'Vendedor', 'Consulta de inventario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_orden`
--

CREATE TABLE `tipo_orden` (
  `id_tipo_orden` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipo_orden`
--

INSERT INTO `tipo_orden` (`id_tipo_orden`, `nombre`) VALUES
(1, 'COMPRA'),
(2, 'VENTA'),
(3, 'TRANSFERENCIA'),
(4, 'AJUSTE'),
(5, 'DEVOLUCION');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicacion`
--

CREATE TABLE `ubicacion` (
  `id_ubicacion` int(11) NOT NULL,
  `id_almacen` int(11) NOT NULL,
  `pasillo` varchar(10) NOT NULL,
  `estante` varchar(10) NOT NULL,
  `nivel` varchar(10) NOT NULL,
  `capacidad_max` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ubicacion`
--

INSERT INTO `ubicacion` (`id_ubicacion`, `id_almacen`, `pasillo`, `estante`, `nivel`, `capacidad_max`) VALUES
(1, 1, '1', '1', '1', 15),
(2, 1, '1', '2', '2', 12),
(3, 1, '2', '5', '3', 300);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_empresa` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `id_rol`, `id_empresa`, `nombre`, `apellido`, `correo`, `contrasena`, `telefono`, `activo`, `fecha_creacion`) VALUES
(1, 1, 1, 'Admin', 'AlmaControl', 'admin@almacontrol.bo', '$2y$10$cM/NQ.K46f988lTcDn.zM.WGPL.twTpn33/IdE0xGbhHxdjCfjs5e', NULL, 1, '2026-06-18 11:25:35'),
(2, 2, 1, 'Mateo', 'Morales', 'mateouni3@gmail.com', '$2y$12$vUO5t2DeQPkvK3GDH7WNS.TqXxLxMs6aiNNkmnMT3TkQO.k9YT5uO', NULL, 1, '2026-06-19 13:28:01'),
(12, 1, 1, 'Carlos Juanchi', '', 'franstorm352@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, 1, '2026-06-24 18:48:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alerta`
--
ALTER TABLE `alerta`
  ADD PRIMARY KEY (`id_alerta`),
  ADD KEY `fk_alerta_producto` (`id_producto`),
  ADD KEY `fk_alerta_almacen` (`id_almacen`),
  ADD KEY `alerta_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD PRIMARY KEY (`id_almacen`),
  ADD KEY `fk_almacen_empresa` (`id_empresa`);

--
-- Indices de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  ADD PRIMARY KEY (`id_categoria`),
  ADD KEY `categoria_producto_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `conteo_inventario`
--
ALTER TABLE `conteo_inventario`
  ADD PRIMARY KEY (`id_conteo`),
  ADD KEY `fk_conteo_almacen` (`id_almacen`),
  ADD KEY `fk_conteo_usuario` (`id_usuario`),
  ADD KEY `conteo_inventario_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `detalle_conteo`
--
ALTER TABLE `detalle_conteo`
  ADD PRIMARY KEY (`id_detalle_conteo`),
  ADD KEY `fk_dc_conteo` (`id_conteo`),
  ADD KEY `fk_dc_producto` (`id_producto`),
  ADD KEY `fk_dc_ubicacion` (`id_ubicacion`);

--
-- Indices de la tabla `detalle_orden`
--
ALTER TABLE `detalle_orden`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_det_orden` (`id_orden`),
  ADD KEY `fk_det_producto` (`id_producto`),
  ADD KEY `fk_det_lote` (`id_lote`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_empresa`),
  ADD UNIQUE KEY `nit` (`nit`);

--
-- Indices de la tabla `factura_sin`
--
ALTER TABLE `factura_sin`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `fk_factura_orden` (`id_orden`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD UNIQUE KEY `uq_inventario` (`id_producto`,`id_almacen`,`id_ubicacion`),
  ADD KEY `fk_inv_almacen` (`id_almacen`),
  ADD KEY `fk_inv_ubicacion` (`id_ubicacion`);

--
-- Indices de la tabla `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id_lead`);

--
-- Indices de la tabla `lote`
--
ALTER TABLE `lote`
  ADD PRIMARY KEY (`id_lote`),
  ADD KEY `fk_lote_producto` (`id_producto`),
  ADD KEY `fk_lote_almacen` (`id_almacen`),
  ADD KEY `lote_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `movimiento_inventario`
--
ALTER TABLE `movimiento_inventario`
  ADD PRIMARY KEY (`id_movimiento`),
  ADD KEY `fk_mov_producto` (`id_producto`),
  ADD KEY `fk_mov_almacen` (`id_almacen`),
  ADD KEY `fk_mov_lote` (`id_lote`),
  ADD KEY `fk_mov_orden` (`id_orden`),
  ADD KEY `fk_mov_usuario` (`id_usuario`),
  ADD KEY `movimiento_inventario_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id_orden`),
  ADD KEY `fk_orden_tipo` (`id_tipo_orden`),
  ADD KEY `fk_orden_almacen_o` (`id_almacen_origen`),
  ADD KEY `fk_orden_almacen_d` (`id_almacen_destino`),
  ADD KEY `fk_orden_usuario` (`id_usuario`),
  ADD KEY `ordenes_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `orden_reposicion`
--
ALTER TABLE `orden_reposicion`
  ADD PRIMARY KEY (`id_reposicion`),
  ADD KEY `fk_repos_producto` (`id_producto`),
  ADD KEY `fk_repos_almacen` (`id_almacen`),
  ADD KEY `fk_repos_proveedor` (`id_proveedor`),
  ADD KEY `orden_reposicion_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`),
  ADD UNIQUE KEY `codigo_barras` (`codigo_barras`),
  ADD UNIQUE KEY `codigo_qr` (`codigo_qr`),
  ADD UNIQUE KEY `codigo_interno` (`codigo_interno`),
  ADD KEY `fk_producto_categoria` (`id_categoria`),
  ADD KEY `fk_producto_proveedor` (`id_proveedor`),
  ADD KEY `producto_id_empresa_foreign` (`id_empresa`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD KEY `fk_proveedor_empresa` (`id_empresa`);

--
-- Indices de la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `fk_reporte_usuario` (`id_usuario`),
  ADD KEY `fk_reporte_almacen` (`id_almacen`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `tipo_orden`
--
ALTER TABLE `tipo_orden`
  ADD PRIMARY KEY (`id_tipo_orden`);

--
-- Indices de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  ADD PRIMARY KEY (`id_ubicacion`),
  ADD UNIQUE KEY `uq_ubicacion` (`id_almacen`,`pasillo`,`estante`,`nivel`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_usuario_rol` (`id_rol`),
  ADD KEY `usuario_id_empresa_foreign` (`id_empresa`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alerta`
--
ALTER TABLE `alerta`
  MODIFY `id_alerta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `almacen`
--
ALTER TABLE `almacen`
  MODIFY `id_almacen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `conteo_inventario`
--
ALTER TABLE `conteo_inventario`
  MODIFY `id_conteo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_conteo`
--
ALTER TABLE `detalle_conteo`
  MODIFY `id_detalle_conteo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_orden`
--
ALTER TABLE `detalle_orden`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `factura_sin`
--
ALTER TABLE `factura_sin`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `leads`
--
ALTER TABLE `leads`
  MODIFY `id_lead` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `lote`
--
ALTER TABLE `lote`
  MODIFY `id_lote` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimiento_inventario`
--
ALTER TABLE `movimiento_inventario`
  MODIFY `id_movimiento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id_orden` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orden_reposicion`
--
ALTER TABLE `orden_reposicion`
  MODIFY `id_reposicion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `reporte`
--
ALTER TABLE `reporte`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tipo_orden`
--
ALTER TABLE `tipo_orden`
  MODIFY `id_tipo_orden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  MODIFY `id_ubicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alerta`
--
ALTER TABLE `alerta`
  ADD CONSTRAINT `alerta_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_alerta_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_alerta_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD CONSTRAINT `almacen_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_almacen_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`);

--
-- Filtros para la tabla `categoria_producto`
--
ALTER TABLE `categoria_producto`
  ADD CONSTRAINT `categoria_producto_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `conteo_inventario`
--
ALTER TABLE `conteo_inventario`
  ADD CONSTRAINT `conteo_inventario_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_conteo_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_conteo_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `detalle_conteo`
--
ALTER TABLE `detalle_conteo`
  ADD CONSTRAINT `fk_dc_conteo` FOREIGN KEY (`id_conteo`) REFERENCES `conteo_inventario` (`id_conteo`),
  ADD CONSTRAINT `fk_dc_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `fk_dc_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`);

--
-- Filtros para la tabla `detalle_orden`
--
ALTER TABLE `detalle_orden`
  ADD CONSTRAINT `fk_det_lote` FOREIGN KEY (`id_lote`) REFERENCES `lote` (`id_lote`),
  ADD CONSTRAINT `fk_det_orden` FOREIGN KEY (`id_orden`) REFERENCES `ordenes` (`id_orden`),
  ADD CONSTRAINT `fk_det_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`);

--
-- Filtros para la tabla `factura_sin`
--
ALTER TABLE `factura_sin`
  ADD CONSTRAINT `fk_factura_orden` FOREIGN KEY (`id_orden`) REFERENCES `ordenes` (`id_orden`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `fk_inv_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_inv_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `fk_inv_ubicacion` FOREIGN KEY (`id_ubicacion`) REFERENCES `ubicacion` (`id_ubicacion`);

--
-- Filtros para la tabla `lote`
--
ALTER TABLE `lote`
  ADD CONSTRAINT `fk_lote_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_lote_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `lote_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `movimiento_inventario`
--
ALTER TABLE `movimiento_inventario`
  ADD CONSTRAINT `fk_mov_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_mov_lote` FOREIGN KEY (`id_lote`) REFERENCES `lote` (`id_lote`),
  ADD CONSTRAINT `fk_mov_orden` FOREIGN KEY (`id_orden`) REFERENCES `ordenes` (`id_orden`),
  ADD CONSTRAINT `fk_mov_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `fk_mov_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `movimiento_inventario_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD CONSTRAINT `fk_orden_almacen_d` FOREIGN KEY (`id_almacen_destino`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_orden_almacen_o` FOREIGN KEY (`id_almacen_origen`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_orden_tipo` FOREIGN KEY (`id_tipo_orden`) REFERENCES `tipo_orden` (`id_tipo_orden`),
  ADD CONSTRAINT `fk_orden_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `ordenes_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `orden_reposicion`
--
ALTER TABLE `orden_reposicion`
  ADD CONSTRAINT `fk_repos_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_repos_producto` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `fk_repos_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`),
  ADD CONSTRAINT `orden_reposicion_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria_producto` (`id_categoria`),
  ADD CONSTRAINT `fk_producto_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`),
  ADD CONSTRAINT `producto_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD CONSTRAINT `fk_proveedor_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`),
  ADD CONSTRAINT `proveedor_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD CONSTRAINT `fk_reporte_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id_almacen`),
  ADD CONSTRAINT `fk_reporte_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  ADD CONSTRAINT `fk_ubicacion_almacen` FOREIGN KEY (`id_almacen`) REFERENCES `almacen` (`id_almacen`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`),
  ADD CONSTRAINT `usuario_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- =============================================================================
--  AlmaControl — Seed de 5 empresas del mercado boliviano (pequeñas/medianas)
--  Ejecutar en phpMyAdmin > pestaña SQL, dentro de almakchh_almacontrol
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ─── 1. LIMPIAR DATOS (sin tocar usuarios, roles, tipo_orden, leads ni tokens) ─
TRUNCATE TABLE `detalle_conteo`;
TRUNCATE TABLE `conteo_inventario`;
TRUNCATE TABLE `detalle_orden`;
TRUNCATE TABLE `factura_sin`;
TRUNCATE TABLE `orden_reposicion`;
TRUNCATE TABLE `movimiento_inventario`;
TRUNCATE TABLE `inventario`;
TRUNCATE TABLE `alerta`;
TRUNCATE TABLE `ordenes`;
TRUNCATE TABLE `lote`;
TRUNCATE TABLE `ubicacion`;
TRUNCATE TABLE `producto`;
TRUNCATE TABLE `categoria_producto`;
TRUNCATE TABLE `proveedor`;
TRUNCATE TABLE `almacen`;
TRUNCATE TABLE `empresa`;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- EMPRESAS (5)
-- =============================================================================
INSERT INTO `empresa` (`id_empresa`, `razon_social`, `nit`, `direccion`, `telefono`, `correo`, `logo_url`) VALUES
(1, 'Distribuidora El Coloso S.R.L.',    '1023847561', 'Av. Blanco Galindo Km 4, Cochabamba',     '4-4521890', 'contacto@elcoloso.com.bo',   NULL),
(2, 'Ferretería Don Remigio',            '2134958672', 'Calle Comercio 345, La Paz',              '2-2408567', 'donremigio@gmail.com',       NULL),
(3, 'Farmacia & Droguería San Lucas',    '3245069783', 'Av. 6 de Agosto 1278, Santa Cruz',       '3-3342210', 'sanlucas.farmacia@gmail.com',NULL),
(4, 'Abarrotes La Señora Paty',         '4356170894', 'Mercado Lanza Local 88, La Paz',          '70123456',  'lapaty.abarrotes@gmail.com', NULL),
(5, 'Textilería & Confecciones Rumbo',   '5467281905', 'Zona Sud, Calle Ingavi 234, El Alto',    '72987654',  'rumbo.textil@gmail.com',     NULL);

-- =============================================================================
-- CATEGORÍAS por empresa
-- =============================================================================
INSERT INTO `categoria_producto` (`id_categoria`, `id_empresa`, `nombre`, `descripcion`) VALUES
-- Empresa 1 - Distribuidora
(1,  1, 'Bebidas',            'Gaseosas, aguas, jugos y cervezas'),
(2,  1, 'Lácteos',            'Leche, yogurt, queso y mantequilla'),
(3,  1, 'Abarrotes Secos',    'Arroz, azúcar, harina y aceite'),
(4,  1, 'Snacks',             'Galletas, chizitos y papas fritas'),
-- Empresa 2 - Ferretería
(5,  2, 'Herramientas',       'Martillos, llaves, destornilladores'),
(6,  2, 'Materiales',         'Cemento, arena, ripio y ladrillos'),
(7,  2, 'Eléctrico',          'Cables, tomacorrientes, focos'),
(8,  2, 'Plomería',           'Tubos, llaves de paso, codos PVC'),
-- Empresa 3 - Farmacia
(9,  3, 'Medicamentos',       'Fármacos genéricos y de marca'),
(10, 3, 'Cosméticos',         'Cremas, shampoo y jabones'),
(11, 3, 'Higiene Personal',   'Papel higiénico, toallas sanitarias'),
(12, 3, 'Suplementos',        'Vitaminas y minerales'),
-- Empresa 4 - Abarrotes
(13, 4, 'Granos y Cereales',  'Arroz, maíz, quinua y cebada'),
(14, 4, 'Aceites y Grasas',   'Aceite de girasol, manteca y mantequilla'),
(15, 4, 'Condimentos',        'Sal, azúcar, pimienta y comino'),
-- Empresa 5 - Textilería
(16, 5, 'Telas',              'Telas por metro: denim, algodón, sarga'),
(17, 5, 'Ropa Terminada',     'Pantalones, camisas y blusas confeccionadas'),
(18, 5, 'Accesorios',         'Botones, cierres, hilos y agujas');

-- =============================================================================
-- PROVEEDORES por empresa
-- =============================================================================
INSERT INTO `proveedor` (`id_proveedor`, `id_empresa`, `nombre`, `nit`, `contacto`, `telefono`, `correo`, `direccion`, `activo`) VALUES
-- Empresa 1
(1, 1, 'CBN (Cervecería Boliviana)',     '1000023456', 'Rubén Tarqui',    '4-4231100', 'ventas@cbn.com.bo',         'Av. Blanco Galindo Km 3, Cbba',  1),
(2, 1, 'PIL Andina S.A.',               '1000034567', 'Rosario Vela',    '4-4265000', 'distribución@pilandina.bo', 'Colcapirhua, Cochabamba',         1),
(3, 1, 'Industrias Venado',             '1000045678', 'Jorge Mamani',    '72345678',  NULL,                        'Av. América, Cochabamba',         1),
-- Empresa 2
(4, 2, 'SOBOCE (Cementos)',             '2000012345', 'Alberto Chura',   '2-2440000', 'ventas@soboce.com.bo',      'Av. Montes 1456, La Paz',         1),
(5, 2, 'Electro Paz SRL',              '2000023456', 'Carmen Quispe',   '78901234',  NULL,                        'El Tejar, La Paz',                1),
-- Empresa 3
(6, 3, 'INTI Farma Bolivia',           '3000011122', 'Dra. Lupe Rojas', '3-3224455', 'pedidos@intifarma.bo',      'Av. Beni 2345, Santa Cruz',       1),
(7, 3, 'Procter & Gamble Bolivia',     '3000022233', 'Marco Peña',      '3-3421100', NULL,                        'Parque Industrial, Santa Cruz',   1),
-- Empresa 4
(8, 4, 'Depósito Mayorista Chávez',    '4000011234', 'Don Chávez',      '71234567',  NULL,                        'Mercado Rodríguez, La Paz',       1),
-- Empresa 5
(9, 5, 'Importadora Textil Oriente',   '5000011234', 'Ying Li',         '76543210',  'textil.oriente@gmail.com',  'Zona Franca, Santa Cruz',         1),
(10,5, 'Telas Bolivianas S.A.',        '5000022345', 'Patricia Choque', '71122334',  NULL,                        'Calle Illampu, El Alto',          1);

-- =============================================================================
-- ALMACENES por empresa
-- =============================================================================
INSERT INTO `almacen` (`id_almacen`, `id_empresa`, `nombre`, `direccion`, `responsable`, `activo`) VALUES
-- Empresa 1
(1, 1, 'Almacén Central Coloso',   'Av. Blanco Galindo Km 4, Cbba',     'Carlos Mendoza',   1),
(2, 1, 'Depósito Secundario',      'Calle Jordán 345, Cbba',             'René Flores',      1),
-- Empresa 2
(3, 2, 'Bodega Don Remigio',       'Calle Comercio 345, La Paz',         'Remigio Soria',    1),
-- Empresa 3
(4, 3, 'Depósito Farmacéutico',    'Av. 6 de Agosto 1278, Santa Cruz',  'Dra. Lupe Rojas',  1),
-- Empresa 4
(5, 4, 'Depósito La Señora Paty', 'Mercado Lanza Local 88, La Paz',     'Patricia Mamani',  1),
-- Empresa 5
(6, 5, 'Bodega Rumbo',             'Calle Ingavi 234, El Alto',          'Félix Condori',    1);

-- =============================================================================
-- UBICACIONES (pasillos/estantes)
-- =============================================================================
INSERT INTO `ubicacion` (`id_ubicacion`, `id_almacen`, `pasillo`, `estante`, `nivel`, `capacidad_max`) VALUES
-- Almacén 1
(1,  1, 'A', '1', '1', 200),
(2,  1, 'A', '1', '2', 200),
(3,  1, 'A', '2', '1', 150),
(4,  1, 'B', '1', '1', 300),
-- Almacén 2
(5,  2, 'A', '1', '1', 100),
-- Almacén 3
(6,  3, 'A', '1', '1', 500),
(7,  3, 'A', '2', '1', 400),
-- Almacén 4
(8,  4, 'A', '1', '1', 600),
-- Almacén 5
(9,  5, 'A', '1', '1', 200),
(10, 5, 'A', '1', '2', 200),
-- Almacén 6
(11, 6, 'A', '1', '1', 300),
(12, 6, 'B', '1', '1', 250);

-- =============================================================================
-- PRODUCTOS por empresa
-- =============================================================================
INSERT INTO `producto` (`id_producto`, `id_empresa`, `id_categoria`, `id_proveedor`, `nombre`, `descripcion`, `codigo_barras`, `codigo_interno`, `unidad_medida`, `precio_costo`, `precio_venta`, `stock_minimo`, `activo`) VALUES
-- ── Empresa 1: Distribuidora El Coloso ──────────────────────────────────────
(1,  1, 1, 1, 'Coca-Cola 2.5L',          'Gaseosa 2.5 litros',           '7791290012345', 'COL-001', 'UNIDAD',   7.50,  12.00, 30, 1),
(2,  1, 1, 1, 'Pepsi 2L',               'Gaseosa Pepsi 2 litros',        '7791290023456', 'COL-002', 'UNIDAD',   6.50,  10.00, 25, 1),
(3,  1, 1, 1, 'Cerveza Paceña Lata',    'Lata 350ml',                   '7791290034567', 'COL-003', 'UNIDAD',   6.00,  10.00, 50, 1),
(4,  1, 1, 1, 'Agua Mineral Vital 1.5L','Agua sin gas',                 '7791290045678', 'COL-004', 'UNIDAD',   3.00,   5.00, 40, 1),
(5,  1, 2, 2, 'Leche PIL Entera 1L',   'Leche pasteurizada PIL 1 litro','7791290056789', 'COL-005', 'UNIDAD',   5.50,   8.00, 30, 1),
(6,  1, 2, 2, 'Yogurt PIL Natural 1L', 'Yogurt sin azúcar 1 litro',    '7791290067890', 'COL-006', 'UNIDAD',   8.00,  12.00, 20, 1),
(7,  1, 3, 3, 'Arroz Supremo 5Kg',     'Arroz grano largo bolsa 5kg',   '7791290078901', 'COL-007', 'BOLSA',   22.00,  30.00, 20, 1),
(8,  1, 3, 3, 'Aceite Rico 1L',        'Aceite vegetal 1 litro',        '7791290089012', 'COL-008', 'UNIDAD',  10.00,  14.00, 25, 1),
(9,  1, 4, 3, 'Chizitos Mr. Chips 80g','Snack de maíz 80 gramos',      '7791290090123', 'COL-009', 'UNIDAD',   2.50,   4.00, 50, 1),
(10, 1, 4, 3, 'Galletas María 200g',   'Galletas clásicas bolsa 200g',  '7791290101234', 'COL-010', 'UNIDAD',   3.00,   5.00, 40, 1),

-- ── Empresa 2: Ferretería Don Remigio ───────────────────────────────────────
(11, 2, 5, 5, 'Martillo Carpintero',    '500g mango de madera',          '7792290012345', 'REM-001', 'UNIDAD',  18.00,  35.00,  5, 1),
(12, 2, 5, 5, 'Destornillador Plano',   'Plano 6 pulgadas',              '7792290023456', 'REM-002', 'UNIDAD',   8.00,  18.00,  8, 1),
(13, 2, 5, 5, 'Alicate Universal',      'Alicate 8 pulgadas',            '7792290034567', 'REM-003', 'UNIDAD',  20.00,  40.00,  5, 1),
(14, 2, 6, 4, 'Cemento Viacha 50Kg',   'Bolsa cemento Portland 50kg',   '7792290045678', 'REM-004', 'BOLSA',   45.00,  60.00, 10, 1),
(15, 2, 6, 4, 'Fierro Corrugado 3/8"', 'Varilla 6 metros',              '7792290056789', 'REM-005', 'VARILLA', 28.00,  45.00,  8, 1),
(16, 2, 7, 5, 'Cable Eléctrico 2.5mm', 'Cable THW por metro',           '7792290067890', 'REM-006', 'METRO',    2.50,   5.00, 20, 1),
(17, 2, 7, 5, 'Foco LED 9W',           'Foco rosca E27 luz blanca',     '7792290078901', 'REM-007', 'UNIDAD',  12.00,  22.00, 10, 1),
(18, 2, 8, 5, 'Tubo PVC 4" x 3m',     'Tubo desagüe liviano',          '7792290089012', 'REM-008', 'UNIDAD',  25.00,  42.00,  5, 1),
(19, 2, 8, 5, 'Pegamento PVC 250cc',   'Cemento solvente para PVC',     '7792290090123', 'REM-009', 'UNIDAD',  18.00,  30.00,  6, 1),

-- ── Empresa 3: Farmacia San Lucas ───────────────────────────────────────────
(20, 3, 9,  6, 'Amoxicilina 500mg',    'Caja 12 cápsulas',              '7793290012345', 'SL-001', 'CAJA',    18.00,  28.00, 20, 1),
(21, 3, 9,  6, 'Ibuprofeno 400mg',     'Caja 20 comprimidos',           '7793290023456', 'SL-002', 'CAJA',    12.00,  20.00, 20, 1),
(22, 3, 9,  6, 'Metformina 850mg',     'Caja 30 comprimidos',           '7793290034567', 'SL-003', 'CAJA',    15.00,  25.00, 15, 1),
(23, 3, 9,  6, 'Omeprazol 20mg',       'Caja 14 cápsulas',              '7793290045678', 'SL-004', 'CAJA',    10.00,  18.00, 15, 1),
(24, 3, 10, 7, 'Shampoo Head & Shoulders 400ml','Cabello graso',        '7793290056789', 'SL-005', 'UNIDAD',  22.00,  38.00, 10, 1),
(25, 3, 10, 7, 'Jabón Dove 90g',       'Jabón de tocador',              '7793290067890', 'SL-006', 'UNIDAD',   5.50,  10.00, 15, 1),
(26, 3, 11, 7, 'Papel Higiénico Elite x12', 'Doble hoja 12 rollos',    '7793290078901', 'SL-007', 'PAQUETE', 28.00,  40.00, 10, 1),
(27, 3, 12, 6, 'Vitamina C 1000mg',    'Frasco 30 tabletas efervescentes','7793290089012','SL-008','FRASCO',  25.00,  45.00,  8, 1),
(28, 3, 12, 6, 'Zinc 50mg',            'Frasco 60 cápsulas',            '7793290090123', 'SL-009', 'FRASCO',  20.00,  35.00,  8, 1),

-- ── Empresa 4: Abarrotes La Señora Paty ────────────────────────────────────
(29, 4, 13, 8, 'Arroz Carolina 5Kg',   'Arroz grano largo 5 kilos',     '7794290012345', 'PAT-001', 'BOLSA',  20.00,  28.00, 15, 1),
(30, 4, 13, 8, 'Quinua Real 1Kg',      'Quinua boliviana premium 1kg',  '7794290023456', 'PAT-002', 'BOLSA',  18.00,  28.00, 10, 1),
(31, 4, 13, 8, 'Maíz Blanco Pelado 5Kg','Para mote y chicha',          '7794290034567', 'PAT-003', 'BOLSA',  12.00,  18.00, 10, 1),
(32, 4, 14, 8, 'Aceite Fino 1L',       'Aceite vegetal puro',           '7794290045678', 'PAT-004', 'UNIDAD',  9.50,  14.00, 12, 1),
(33, 4, 14, 8, 'Manteca Camba 1Kg',    'Manteca vegetal 1 kilo',        '7794290056789', 'PAT-005', 'UNIDAD',  8.00,  12.00, 10, 1),
(34, 4, 15, 8, 'Sal Gruesa 1Kg',       'Sal de cocina 1 kilo',          '7794290067890', 'PAT-006', 'BOLSA',   1.50,   3.00, 20, 1),
(35, 4, 15, 8, 'Azúcar Guabirá 5Kg',  'Azúcar blanca refinada',        '7794290078901', 'PAT-007', 'BOLSA',  24.00,  32.00, 10, 1),
(36, 4, 15, 8, 'Pimienta Negra 100g', 'Pimienta molida bolsa',         '7794290089012', 'PAT-008', 'BOLSA',   4.00,   7.00, 10, 1),

-- ── Empresa 5: Textilería Rumbo ─────────────────────────────────────────────
(37, 5, 16,  9, 'Tela Denim 10oz Metro','Tela jeans por metro 150cm',  '7795290012345', 'RUM-001', 'METRO',  18.00,  32.00, 20, 1),
(38, 5, 16,  9, 'Tela Algodón Crudo Metro','100% algodón 140cm',       '7795290023456', 'RUM-002', 'METRO',  12.00,  22.00, 20, 1),
(39, 5, 16, 10, 'Tela Sarga Negra Metro', 'Gabardina pesada para ropa','7795290034567', 'RUM-003', 'METRO',  14.00,  25.00, 15, 1),
(40, 5, 17, 10, 'Pantalón Denim Hombre T.38','Jeans azul clásico',     '7795290045678', 'RUM-004', 'UNIDAD', 55.00, 110.00,  8, 1),
(41, 5, 17, 10, 'Camisa Cuadros M',    'Camisa manga larga talla M',   '7795290056789', 'RUM-005', 'UNIDAD', 40.00,  85.00,  8, 1),
(42, 5, 18,  9, 'Cierre Invisible 35cm','Cierre para ropa interior',   '7795290067890', 'RUM-006', 'UNIDAD',  1.00,   2.50, 50, 1),
(43, 5, 18,  9, 'Hilo Coats 100m Negro','Hilo de coser poliéster',     '7795290078901', 'RUM-007', 'CARRETE', 3.50,   7.00, 30, 1),
(44, 5, 18, 10, 'Botones Camisa x24', 'Set 24 botones blancos 12mm',   '7795290089012', 'RUM-008', 'SET',     2.50,   5.00, 20, 1);

-- =============================================================================
-- INVENTARIO inicial (stock realista)
-- =============================================================================
INSERT INTO `inventario` (`id_inventario`, `id_producto`, `id_almacen`, `id_ubicacion`, `cantidad`) VALUES
-- Empresa 1 (Almacén 1 y 2)
(1,  1,  1, 1, 120), (2,  2,  1, 1,  80), (3,  3,  1, 2, 200),
(4,  4,  1, 2,  90), (5,  5,  1, 3,  60), (6,  6,  1, 3,  35),
(7,  7,  2, 5,  45), (8,  8,  2, 5,  55), (9,  9,  2, 5, 130),
(10,10,  2, 5, 100),
-- Empresa 2 (Almacén 3)
(11,11,  3, 6,  18), (12,12,  3, 6,  25), (13,13,  3, 6,  12),
(14,14,  3, 7,  22), (15,15,  3, 7,  14), (16,16,  3, 7,  80),
(17,17,  3, 6,  30), (18,18,  3, 7,  10), (19,19,  3, 7,   8),
-- Empresa 3 (Almacén 4)
(20,20,  4, 8,  55), (21,21,  4, 8,  70), (22,22,  4, 8,  40),
(23,23,  4, 8,  60), (24,24,  4, 8,  25), (25,25,  4, 8,  45),
(26,26,  4, 8,  30), (27,27,  4, 8,  20), (28,28,  4, 8,  18),
-- Empresa 4 (Almacén 5)
(29,29,  5, 9,  38), (30,30,  5, 9,  22), (31,31,  5, 9,  28),
(32,32,  5, 9,  50), (33,33,  5, 9,  35), (34,34,  5, 9,  60),
(35,35,  5, 9,  40), (36,36,  5, 9,  18),
-- Empresa 5 (Almacén 6)
(37,37,  6,11,  85), (38,38,  6,11,  60), (39,39,  6,11,  45),
(40,40,  6,12,  20), (41,41,  6,12,  15), (42,42,  6,12, 110),
(43,43,  6,12,  80), (44,44,  6,12,  55);

-- =============================================================================
-- MOVIMIENTOS DE INVENTARIO — entradas iniciales
-- (id_usuario 1 = Admin del sistema)
-- =============================================================================
INSERT INTO `movimiento_inventario`
  (`id_movimiento`,`id_empresa`,`id_producto`,`id_almacen`,`id_lote`,`id_orden`,`id_usuario`,`tipo_movimiento`,`cantidad`,`stock_antes`,`stock_despues`,`observaciones`,`fecha`,`sincronizado`)
VALUES
-- Empresa 1
(1,  1,  1, 1,NULL,NULL,1,'ENTRADA',120,  0,120,'Stock inicial apertura','2026-05-10 08:00:00',1),
(2,  1,  2, 1,NULL,NULL,1,'ENTRADA', 80,  0, 80,'Stock inicial apertura','2026-05-10 08:05:00',1),
(3,  1,  3, 1,NULL,NULL,1,'ENTRADA',200,  0,200,'Stock inicial apertura','2026-05-10 08:10:00',1),
(4,  1,  4, 1,NULL,NULL,1,'ENTRADA', 90,  0, 90,'Stock inicial apertura','2026-05-10 08:15:00',1),
(5,  1,  5, 1,NULL,NULL,1,'ENTRADA', 60,  0, 60,'Stock inicial apertura','2026-05-10 08:20:00',1),
(6,  1,  6, 1,NULL,NULL,1,'ENTRADA', 35,  0, 35,'Stock inicial apertura','2026-05-10 08:25:00',1),
(7,  1,  7, 2,NULL,NULL,1,'ENTRADA', 45,  0, 45,'Stock inicial depósito 2','2026-05-10 09:00:00',1),
(8,  1,  8, 2,NULL,NULL,1,'ENTRADA', 55,  0, 55,'Stock inicial depósito 2','2026-05-10 09:05:00',1),
(9,  1,  9, 2,NULL,NULL,1,'ENTRADA',130,  0,130,'Stock inicial depósito 2','2026-05-10 09:10:00',1),
(10, 1, 10, 2,NULL,NULL,1,'ENTRADA',100,  0,100,'Stock inicial depósito 2','2026-05-10 09:15:00',1),
-- Empresa 2
(11, 2, 11, 3,NULL,NULL,1,'ENTRADA', 18,  0, 18,'Stock inicial apertura','2026-04-15 08:00:00',1),
(12, 2, 12, 3,NULL,NULL,1,'ENTRADA', 25,  0, 25,'Stock inicial apertura','2026-04-15 08:05:00',1),
(13, 2, 13, 3,NULL,NULL,1,'ENTRADA', 12,  0, 12,'Stock inicial apertura','2026-04-15 08:10:00',1),
(14, 2, 14, 3,NULL,NULL,1,'ENTRADA', 22,  0, 22,'Stock inicial apertura','2026-04-15 08:15:00',1),
(15, 2, 15, 3,NULL,NULL,1,'ENTRADA', 14,  0, 14,'Stock inicial apertura','2026-04-15 08:20:00',1),
(16, 2, 16, 3,NULL,NULL,1,'ENTRADA', 80,  0, 80,'Stock inicial apertura','2026-04-15 08:25:00',1),
(17, 2, 17, 3,NULL,NULL,1,'ENTRADA', 30,  0, 30,'Stock inicial apertura','2026-04-15 08:30:00',1),
(18, 2, 18, 3,NULL,NULL,1,'ENTRADA', 10,  0, 10,'Stock inicial apertura','2026-04-15 08:35:00',1),
(19, 2, 19, 3,NULL,NULL,1,'ENTRADA',  8,  0,  8,'Stock inicial apertura','2026-04-15 08:40:00',1),
-- Empresa 3
(20, 3, 20, 4,NULL,NULL,1,'ENTRADA', 55,  0, 55,'Apertura farmacia','2026-03-01 08:00:00',1),
(21, 3, 21, 4,NULL,NULL,1,'ENTRADA', 70,  0, 70,'Apertura farmacia','2026-03-01 08:05:00',1),
(22, 3, 22, 4,NULL,NULL,1,'ENTRADA', 40,  0, 40,'Apertura farmacia','2026-03-01 08:10:00',1),
(23, 3, 23, 4,NULL,NULL,1,'ENTRADA', 60,  0, 60,'Apertura farmacia','2026-03-01 08:15:00',1),
(24, 3, 24, 4,NULL,NULL,1,'ENTRADA', 25,  0, 25,'Apertura farmacia','2026-03-01 08:20:00',1),
(25, 3, 25, 4,NULL,NULL,1,'ENTRADA', 45,  0, 45,'Apertura farmacia','2026-03-01 08:25:00',1),
(26, 3, 26, 4,NULL,NULL,1,'ENTRADA', 30,  0, 30,'Apertura farmacia','2026-03-01 08:30:00',1),
(27, 3, 27, 4,NULL,NULL,1,'ENTRADA', 20,  0, 20,'Apertura farmacia','2026-03-01 08:35:00',1),
(28, 3, 28, 4,NULL,NULL,1,'ENTRADA', 18,  0, 18,'Apertura farmacia','2026-03-01 08:40:00',1),
-- Empresa 4
(29, 4, 29, 5,NULL,NULL,1,'ENTRADA', 38,  0, 38,'Stock inicial tienda','2026-05-20 08:00:00',1),
(30, 4, 30, 5,NULL,NULL,1,'ENTRADA', 22,  0, 22,'Stock inicial tienda','2026-05-20 08:05:00',1),
(31, 4, 31, 5,NULL,NULL,1,'ENTRADA', 28,  0, 28,'Stock inicial tienda','2026-05-20 08:10:00',1),
(32, 4, 32, 5,NULL,NULL,1,'ENTRADA', 50,  0, 50,'Stock inicial tienda','2026-05-20 08:15:00',1),
(33, 4, 33, 5,NULL,NULL,1,'ENTRADA', 35,  0, 35,'Stock inicial tienda','2026-05-20 08:20:00',1),
(34, 4, 34, 5,NULL,NULL,1,'ENTRADA', 60,  0, 60,'Stock inicial tienda','2026-05-20 08:25:00',1),
(35, 4, 35, 5,NULL,NULL,1,'ENTRADA', 40,  0, 40,'Stock inicial tienda','2026-05-20 08:30:00',1),
(36, 4, 36, 5,NULL,NULL,1,'ENTRADA', 18,  0, 18,'Stock inicial tienda','2026-05-20 08:35:00',1),
-- Empresa 5
(37, 5, 37, 6,NULL,NULL,1,'ENTRADA', 85,  0, 85,'Stock inicial taller','2026-06-01 08:00:00',1),
(38, 5, 38, 6,NULL,NULL,1,'ENTRADA', 60,  0, 60,'Stock inicial taller','2026-06-01 08:05:00',1),
(39, 5, 39, 6,NULL,NULL,1,'ENTRADA', 45,  0, 45,'Stock inicial taller','2026-06-01 08:10:00',1),
(40, 5, 40, 6,NULL,NULL,1,'ENTRADA', 20,  0, 20,'Stock inicial taller','2026-06-01 08:15:00',1),
(41, 5, 41, 6,NULL,NULL,1,'ENTRADA', 15,  0, 15,'Stock inicial taller','2026-06-01 08:20:00',1),
(42, 5, 42, 6,NULL,NULL,1,'ENTRADA',110,  0,110,'Stock inicial taller','2026-06-01 08:25:00',1),
(43, 5, 43, 6,NULL,NULL,1,'ENTRADA', 80,  0, 80,'Stock inicial taller','2026-06-01 08:30:00',1),
(44, 5, 44, 6,NULL,NULL,1,'ENTRADA', 55,  0, 55,'Stock inicial taller','2026-06-01 08:35:00',1);

-- =============================================================================
-- ALERTAS de stock bajo (algunos productos con stock ≤ mínimo)
-- =============================================================================
INSERT INTO `alerta` (`id_alerta`,`id_empresa`,`id_producto`,`id_almacen`,`tipo_alerta`,`mensaje`,`leida`,`fecha_generada`) VALUES
(1, 1,  5, 1,'STOCK_MINIMO','Leche PIL Entera 1L tiene stock 60, mínimo requerido 30.',  0,'2026-06-20 09:00:00'),
(2, 2, 18, 3,'STOCK_MINIMO','Tubo PVC 4x3m tiene stock 10, mínimo requerido 5.',         0,'2026-06-22 10:00:00'),
(3, 2, 19, 3,'STOCK_MINIMO','Pegamento PVC 250cc tiene stock 8, mínimo requerido 6.',    0,'2026-06-22 10:05:00'),
(4, 3, 27, 4,'STOCK_MINIMO','Vitamina C 1000mg tiene stock 20, mínimo requerido 8.',     0,'2026-06-23 08:00:00'),
(5, 4, 30, 5,'STOCK_MINIMO','Quinua Real 1Kg tiene stock 22, mínimo requerido 10.',      0,'2026-06-23 09:30:00'),
(6, 5, 40, 6,'STOCK_MINIMO','Pantalón Denim H T.38 tiene stock 20, mínimo requerido 8.',0,'2026-06-24 11:00:00');

-- =============================================================================
-- Ajustar AUTO_INCREMENT para no chocar con inserts futuros
-- =============================================================================
ALTER TABLE `empresa`              AUTO_INCREMENT = 10;
ALTER TABLE `categoria_producto`   AUTO_INCREMENT = 30;
ALTER TABLE `proveedor`            AUTO_INCREMENT = 20;
ALTER TABLE `almacen`              AUTO_INCREMENT = 10;
ALTER TABLE `ubicacion`            AUTO_INCREMENT = 20;
ALTER TABLE `producto`             AUTO_INCREMENT = 60;
ALTER TABLE `inventario`           AUTO_INCREMENT = 60;
ALTER TABLE `movimiento_inventario`AUTO_INCREMENT = 60;
ALTER TABLE `alerta`               AUTO_INCREMENT = 10;

-- =============================================================================
-- USUARIOS POR EMPRESA
-- Contraseña de TODOS los usuarios demo: "password"
-- Hash bcrypt de "password": $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- =============================================================================

-- Primero eliminamos usuarios de demo previos (excepto super-admin id=1)
-- y re-asignamos los existentes a empresa 1
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM `personal_access_tokens`
  WHERE `tokenable_id` NOT IN (1, 2, 12);

DELETE FROM `usuario`
  WHERE `id_usuario` NOT IN (1, 2, 12);

-- Re-asignar usuarios existentes a empresa 1 (Distribuidora El Coloso)
UPDATE `usuario` SET `id_empresa` = 1 WHERE `id_usuario` = 12; -- Carlos Juanchi → Admin Empresa 1
UPDATE `usuario` SET `id_empresa` = 1, `id_rol` = 2 WHERE `id_usuario` = 2; -- Mateo → Encargado Empresa 1

SET FOREIGN_KEY_CHECKS = 1;

-- ─── EMPRESA 1: Distribuidora El Coloso S.R.L. ──────────────────────────────
-- Admin ya existe: Carlos Juanchi (id=12, franstorm352@gmail.com)
-- Encargado ya existe: Mateo Morales (id=2, mateouni3@gmail.com)
INSERT INTO `usuario` (`id_usuario`,`id_rol`,`id_empresa`,`nombre`,`apellido`,`correo`,`contrasena`,`telefono`,`activo`,`fecha_creacion`) VALUES
(13, 3, 1, 'Alejandra', 'Quispe',   'ale.quispe.coloso@gmail.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '71234501', 1, '2026-05-15 09:00:00');
-- Rol 3 = Vendedor

-- ─── EMPRESA 2: Ferretería Don Remigio ───────────────────────────────────────
INSERT INTO `usuario` (`id_usuario`,`id_rol`,`id_empresa`,`nombre`,`apellido`,`correo`,`contrasena`,`telefono`,`activo`,`fecha_creacion`) VALUES
(14, 1, 2, 'Remigio',   'Soria Chura',     'remigio.soria@gmail.com',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '72345602', 1, '2026-04-20 08:30:00'),
(15, 2, 2, 'Alberto',   'Chura Limachi',   'alberto.chura.ferr@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '73456703', 1, '2026-04-20 09:00:00'),
(16, 3, 2, 'Carmen',    'Quispe Apaza',    'carmen.quispe.ferr@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '74567804', 1, '2026-04-20 09:30:00');

-- ─── EMPRESA 3: Farmacia & Droguería San Lucas ───────────────────────────────
INSERT INTO `usuario` (`id_usuario`,`id_rol`,`id_empresa`,`nombre`,`apellido`,`correo`,`contrasena`,`telefono`,`activo`,`fecha_creacion`) VALUES
(17, 1, 3, 'Lucía',     'Rojas Vásquez',   'lucia.rojas.sanlucas@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','75678905', 1, '2026-03-05 08:00:00'),
(18, 2, 3, 'Marco',     'Peña Jiménez',    'marco.pena.sanlucas@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','76789006', 1, '2026-03-05 08:30:00'),
(19, 3, 3, 'Sandra',    'Vargas Medina',   'sandra.vargas.slucas@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','77890107', 1, '2026-03-05 09:00:00');

-- ─── EMPRESA 4: Abarrotes La Señora Paty ────────────────────────────────────
INSERT INTO `usuario` (`id_usuario`,`id_rol`,`id_empresa`,`nombre`,`apellido`,`correo`,`contrasena`,`telefono`,`activo`,`fecha_creacion`) VALUES
(20, 1, 4, 'Patricia',  'Mamani Coari',    'paty.mamani.abarr@gmail.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','70123456', 1, '2026-05-22 08:00:00'),
(21, 2, 4, 'Gonzalo',   'Flores Huanca',   'gonza.flores.paty@gmail.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','71098765', 1, '2026-05-22 08:30:00'),
(22, 3, 4, 'Rosa',      'Condori Mamani',  'rosa.condori.paty@gmail.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','72098765', 1, '2026-05-22 09:00:00');

-- ─── EMPRESA 5: Textilería & Confecciones Rumbo ──────────────────────────────
INSERT INTO `usuario` (`id_usuario`,`id_rol`,`id_empresa`,`nombre`,`apellido`,`correo`,`contrasena`,`telefono`,`activo`,`fecha_creacion`) VALUES
(23, 1, 5, 'Félix',     'Condori Ticona',  'felix.condori.rumbo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','72987654', 1, '2026-06-03 08:00:00'),
(24, 2, 5, 'Natividad', 'Choque Laura',    'naty.choque.rumbo@gmail.com',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','73987654', 1, '2026-06-03 08:30:00'),
(25, 3, 5, 'Wilmer',    'Quispe Zenteno',  'wilmer.quispe.rumbo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','74987654', 1, '2026-06-03 09:00:00');

ALTER TABLE `usuario` AUTO_INCREMENT = 30;

-- =============================================================================
-- RESUMEN FINAL
-- =============================================================================
SELECT
  u.id_usuario,
  u.nombre,
  u.apellido,
  u.correo,
  r.nombre  AS rol,
  e.razon_social AS empresa
FROM `usuario` u
JOIN `rol` r ON r.id_rol = u.id_rol
LEFT JOIN `empresa` e ON e.id_empresa = u.id_empresa
ORDER BY u.id_empresa, u.id_rol;

