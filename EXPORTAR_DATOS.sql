/*
  # SCRIPT PARA EXPORTAR DATOS ACTUALES

  Ejecuta estas consultas en el SQL Editor del proyecto ACTUAL de Supabase.
  Copia los resultados y guárdalos para importarlos después en el nuevo proyecto.

  IMPORTANTE: Ejecuta cada consulta por separado y guarda los resultados.
*/

-- ============================================================================
-- 1. EXPORTAR SLIDES
-- ============================================================================
SELECT
  titulo,
  subtitulo,
  imagen_url,
  link_opcional,
  orden,
  activo,
  created_at,
  updated_at
FROM slides
ORDER BY orden;

-- ============================================================================
-- 2. EXPORTAR TERRENOS
-- ============================================================================
SELECT
  nombre,
  slug,
  ubicacion,
  precio,
  superficie_m2,
  estado,
  descripcion,
  imagenes,
  destacado,
  fecha_publicacion,
  revisado,
  revisado_por,
  comentario_revision,
  contactado,
  contactado_por,
  detalle_contacto,
  created_at,
  updated_at
FROM terrenos
ORDER BY created_at;

-- ============================================================================
-- 3. EXPORTAR NOSOTROS
-- ============================================================================
SELECT
  tipo,
  titulo,
  contenido,
  imagenes,
  orden,
  activo,
  created_at,
  updated_at
FROM nosotros
ORDER BY orden;

-- ============================================================================
-- 4. EXPORTAR CONFIGURACION
-- ============================================================================
SELECT
  clave,
  valor,
  tipo,
  descripcion,
  updated_at
FROM configuracion
ORDER BY clave;

-- ============================================================================
-- 5. EXPORTAR TRABAJE_CON_NOSOTROS
-- ============================================================================
SELECT
  nombre_completo,
  email,
  telefono,
  area_interes,
  mensaje,
  estado,
  created_at
FROM trabaje_con_nosotros
ORDER BY created_at DESC;

-- ============================================================================
-- 6. EXPORTAR COMPRA_VENTA_PROPIEDADES
-- ============================================================================
SELECT
  nombre_completo,
  email,
  telefono,
  tipo_interes,
  mensaje,
  estado,
  created_at
FROM compra_venta_propiedades
ORDER BY created_at DESC;

-- ============================================================================
-- 7. EXPORTAR SYSTEM_LOGS (opcional - solo si quieres conservar el historial)
-- ============================================================================
SELECT
  tipo,
  modulo,
  mensaje,
  detalles,
  usuario_email,
  created_at
FROM system_logs
ORDER BY created_at DESC
LIMIT 1000; -- Limita a los últimos 1000 logs

-- ============================================================================
-- 8. CONTAR REGISTROS (para verificar)
-- ============================================================================
SELECT
  'slides' as tabla, COUNT(*) as total FROM slides
UNION ALL
SELECT 'terrenos', COUNT(*) FROM terrenos
UNION ALL
SELECT 'nosotros', COUNT(*) FROM nosotros
UNION ALL
SELECT 'configuracion', COUNT(*) FROM configuracion
UNION ALL
SELECT 'trabaje_con_nosotros', COUNT(*) FROM trabaje_con_nosotros
UNION ALL
SELECT 'compra_venta_propiedades', COUNT(*) FROM compra_venta_propiedades
UNION ALL
SELECT 'system_logs', COUNT(*) FROM system_logs;
