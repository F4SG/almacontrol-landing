ALTER TABLE `usuario` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_rol`;
ALTER TABLE `usuario` ADD CONSTRAINT `usuario_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `usuario` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `almacen` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_almacen`;
ALTER TABLE `almacen` ADD CONSTRAINT `almacen_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `almacen` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `producto` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_producto`;
ALTER TABLE `producto` ADD CONSTRAINT `producto_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `producto` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `categoria_producto` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_categoria_producto`;
ALTER TABLE `categoria_producto` ADD CONSTRAINT `categoria_producto_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `categoria_producto` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `proveedor` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_proveedor`;
ALTER TABLE `proveedor` ADD CONSTRAINT `proveedor_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `proveedor` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `alerta` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_alerta`;
ALTER TABLE `alerta` ADD CONSTRAINT `alerta_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `alerta` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `conteo_inventario` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_conteo_inventario`;
ALTER TABLE `conteo_inventario` ADD CONSTRAINT `conteo_inventario_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `conteo_inventario` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `movimiento_inventario` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_movimiento_inventario`;
ALTER TABLE `movimiento_inventario` ADD CONSTRAINT `movimiento_inventario_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `movimiento_inventario` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `ordenes` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_ordenes`;
ALTER TABLE `ordenes` ADD CONSTRAINT `ordenes_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `ordenes` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `orden_reposicion` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_orden_reposicion`;
ALTER TABLE `orden_reposicion` ADD CONSTRAINT `orden_reposicion_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `orden_reposicion` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;

ALTER TABLE `lote` ADD `id_empresa` bigint unsigned DEFAULT NULL AFTER `id_lote`;
ALTER TABLE `lote` ADD CONSTRAINT `lote_id_empresa_foreign` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE;
UPDATE `lote` SET `id_empresa` = 1 WHERE `id_empresa` IS NULL;
