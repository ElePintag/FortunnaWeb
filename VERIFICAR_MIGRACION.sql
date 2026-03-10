/*
  # SCRIPT DE VERIFICACIÓN POST-MIGRACIÓN

  Ejecuta este script en tu NUEVO proyecto de Supabase después de completar la migración.
  Te mostrará un resumen completo del estado de tu base de datos.

  ✅ = Todo está correcto
  ❌ = Hay un problema que debes revisar
*/

-- ============================================================================
-- 1. VERIFICAR QUE TODAS LAS TABLAS EXISTEN
-- ============================================================================
SELECT
  'Tablas Existentes' as verificacion,
  COUNT(*) as total,
  CASE
    WHEN COUNT(*) >= 7 THEN '✅ Correcto (7 tablas esperadas)'
    ELSE '❌ Faltan tablas'
  END as estado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'slides',
    'terrenos',
    'nosotros',
    'configuracion',
    'trabaje_con_nosotros',
    'compra_venta_propiedades',
    'system_logs'
  );

-- ============================================================================
-- 2. LISTAR TODAS LAS TABLAS CREADAS
-- ============================================================================
SELECT
  table_name as tabla,
  CASE
    WHEN table_name IN ('slides', 'terrenos', 'nosotros', 'configuracion', 'trabaje_con_nosotros', 'compra_venta_propiedades', 'system_logs')
    THEN '✅'
    ELSE '⚠️ Tabla extra'
  END as estado
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ============================================================================
-- 3. VERIFICAR QUE RLS ESTÁ HABILITADO EN TODAS LAS TABLAS
-- ============================================================================
SELECT
  tablename as tabla,
  CASE
    WHEN rowsecurity = true THEN '✅ RLS Habilitado'
    ELSE '❌ RLS NO Habilitado'
  END as estado_rls
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'slides',
    'terrenos',
    'nosotros',
    'configuracion',
    'trabaje_con_nosotros',
    'compra_venta_propiedades',
    'system_logs'
  )
ORDER BY tablename;

-- ============================================================================
-- 4. CONTAR POLÍTICAS RLS POR TABLA
-- ============================================================================
SELECT
  tablename as tabla,
  COUNT(*) as num_politicas,
  CASE
    WHEN COUNT(*) >= 1 THEN '✅ Tiene políticas'
    ELSE '❌ Sin políticas'
  END as estado
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ============================================================================
-- 5. VERIFICAR BUCKET DE STORAGE
-- ============================================================================
SELECT
  'Storage Bucket: images' as verificacion,
  CASE
    WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images')
    THEN '✅ Bucket existe'
    ELSE '❌ Bucket no existe'
  END as estado;

-- ============================================================================
-- 6. VERIFICAR POLÍTICAS DE STORAGE
-- ============================================================================
SELECT
  COUNT(*) as num_politicas_storage,
  CASE
    WHEN COUNT(*) >= 4 THEN '✅ Políticas de storage configuradas'
    ELSE '❌ Faltan políticas de storage'
  END as estado
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%images%';

-- ============================================================================
-- 7. CONTAR REGISTROS IMPORTADOS
-- ============================================================================
SELECT
  'slides' as tabla,
  COUNT(*) as registros,
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Tiene datos'
    ELSE '⚠️ Sin datos (¿importaste?)'
  END as estado
FROM slides
UNION ALL
SELECT
  'terrenos',
  COUNT(*),
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Tiene datos'
    ELSE '⚠️ Sin datos (¿importaste?)'
  END
FROM terrenos
UNION ALL
SELECT
  'nosotros',
  COUNT(*),
  CASE
    WHEN COUNT(*) > 0 THEN '✅ Tiene datos'
    ELSE '⚠️ Sin datos (¿importaste?)'
  END
FROM nosotros
UNION ALL
SELECT
  'configuracion',
  COUNT(*),
  CASE
    WHEN COUNT(*) >= 4 THEN '✅ Configuración inicial'
    ELSE '⚠️ Falta configuración'
  END
FROM configuracion
UNION ALL
SELECT
  'trabaje_con_nosotros',
  COUNT(*),
  CASE
    WHEN COUNT(*) >= 0 THEN '✅ Ok (puede estar vacío)'
    ELSE '⚠️'
  END
FROM trabaje_con_nosotros
UNION ALL
SELECT
  'compra_venta_propiedades',
  COUNT(*),
  CASE
    WHEN COUNT(*) >= 0 THEN '✅ Ok (puede estar vacío)'
    ELSE '⚠️'
  END
FROM compra_venta_propiedades
UNION ALL
SELECT
  'system_logs',
  COUNT(*),
  CASE
    WHEN COUNT(*) >= 0 THEN '✅ Ok (puede estar vacío)'
    ELSE '⚠️'
  END
FROM system_logs;

-- ============================================================================
-- 8. VERIFICAR ÍNDICES IMPORTANTES
-- ============================================================================
SELECT
  'Índices en terrenos' as verificacion,
  COUNT(*) as num_indices,
  CASE
    WHEN COUNT(*) >= 3 THEN '✅ Índices creados'
    ELSE '⚠️ Faltan índices'
  END as estado
FROM pg_indexes
WHERE tablename = 'terrenos'
  AND indexname IN ('idx_terrenos_slug', 'idx_terrenos_estado', 'idx_terrenos_destacado');

-- ============================================================================
-- 9. RESUMEN GENERAL
-- ============================================================================
SELECT
  '================================' as linea,
  'RESUMEN DE MIGRACIÓN' as titulo,
  '================================' as linea2
UNION ALL
SELECT
  '📊 Total de Tablas:',
  CAST(COUNT(*) as text),
  ''
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
UNION ALL
SELECT
  '🔒 Tablas con RLS:',
  CAST(COUNT(*) as text),
  ''
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true
UNION ALL
SELECT
  '📝 Total de Políticas RLS:',
  CAST(COUNT(*) as text),
  ''
FROM pg_policies
WHERE schemaname = 'public'
UNION ALL
SELECT
  '💾 Storage Buckets:',
  CAST(COUNT(*) as text),
  ''
FROM storage.buckets
UNION ALL
SELECT
  '📦 Total de Registros:',
  CAST(
    (SELECT COUNT(*) FROM slides) +
    (SELECT COUNT(*) FROM terrenos) +
    (SELECT COUNT(*) FROM nosotros) +
    (SELECT COUNT(*) FROM configuracion) +
    (SELECT COUNT(*) FROM trabaje_con_nosotros) +
    (SELECT COUNT(*) FROM compra_venta_propiedades) +
    (SELECT COUNT(*) FROM system_logs)
  as text),
  '';

-- ============================================================================
-- 10. VERIFICAR CONFIGURACIÓN POR DEFECTO
-- ============================================================================
SELECT
  'Configuración por defecto' as verificacion,
  clave,
  CASE
    WHEN valor IS NOT NULL AND valor != '' THEN '✅ Configurado'
    ELSE '⚠️ Sin configurar (normal al inicio)'
  END as estado
FROM configuracion
WHERE clave IN ('logo_url', 'whatsapp_number', 'email_contacto', 'email_rrhh')
ORDER BY clave;

-- ============================================================================
-- FIN DE LA VERIFICACIÓN
-- ============================================================================

-- Si todos los checks muestran ✅, ¡la migración fue exitosa!
-- Si ves ❌, revisa la sección correspondiente en GUIA_MIGRACION.md
