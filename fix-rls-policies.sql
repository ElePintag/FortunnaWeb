-- ============================================================================
-- SCRIPT PARA CORREGIR POLÍTICAS RLS DEL PANEL DE ADMINISTRACIÓN
-- ============================================================================
--
-- INSTRUCCIONES:
-- 1. Ve a https://supabase.com/dashboard
-- 2. Selecciona tu proyecto
-- 3. Ve a SQL Editor (menú lateral izquierdo)
-- 4. Copia y pega TODO este archivo
-- 5. Clic en "Run" (o Ctrl+Enter / Cmd+Enter)
-- 6. Espera a que termine (1-2 segundos)
-- 7. Cierra sesión del admin y vuelve a iniciar sesión
-- 8. ¡Prueba guardar cambios!
--
-- ============================================================================

-- SLIDES
-- Permite a usuarios autenticados crear, actualizar y eliminar slides
DROP POLICY IF EXISTS "Authenticated users can insert slides" ON slides;
DROP POLICY IF EXISTS "Authenticated users can update slides" ON slides;
DROP POLICY IF EXISTS "Authenticated users can delete slides" ON slides;

CREATE POLICY "Authenticated users can insert slides"
  ON slides FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update slides"
  ON slides FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete slides"
  ON slides FOR DELETE
  TO authenticated
  USING (true);

-- TERRENOS
-- Permite a usuarios autenticados crear, actualizar y eliminar terrenos
DROP POLICY IF EXISTS "Authenticated users can insert terrenos" ON terrenos;
DROP POLICY IF EXISTS "Authenticated users can update terrenos" ON terrenos;
DROP POLICY IF EXISTS "Authenticated users can delete terrenos" ON terrenos;

CREATE POLICY "Authenticated users can insert terrenos"
  ON terrenos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update terrenos"
  ON terrenos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete terrenos"
  ON terrenos FOR DELETE
  TO authenticated
  USING (true);

-- NOSOTROS
-- Permite a usuarios autenticados crear, actualizar y eliminar secciones de "Nosotros"
DROP POLICY IF EXISTS "Authenticated users can insert nosotros" ON nosotros;
DROP POLICY IF EXISTS "Authenticated users can update nosotros" ON nosotros;
DROP POLICY IF EXISTS "Authenticated users can delete nosotros" ON nosotros;

CREATE POLICY "Authenticated users can insert nosotros"
  ON nosotros FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update nosotros"
  ON nosotros FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete nosotros"
  ON nosotros FOR DELETE
  TO authenticated
  USING (true);

-- CONFIGURACION
-- Permite a usuarios autenticados crear, actualizar y eliminar configuraciones
DROP POLICY IF EXISTS "Authenticated users can insert configuration" ON configuracion;
DROP POLICY IF EXISTS "Authenticated users can update configuration" ON configuracion;
DROP POLICY IF EXISTS "Authenticated users can delete configuration" ON configuracion;

CREATE POLICY "Authenticated users can insert configuration"
  ON configuracion FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update configuration"
  ON configuracion FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete configuration"
  ON configuracion FOR DELETE
  TO authenticated
  USING (true);

-- TRABAJE_CON_NOSOTROS
-- Permite a usuarios autenticados actualizar y eliminar aplicaciones de trabajo
DROP POLICY IF EXISTS "Authenticated users can update job applications" ON trabaje_con_nosotros;
DROP POLICY IF EXISTS "Authenticated users can delete job applications" ON trabaje_con_nosotros;

CREATE POLICY "Authenticated users can update job applications"
  ON trabaje_con_nosotros FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job applications"
  ON trabaje_con_nosotros FOR DELETE
  TO authenticated
  USING (true);

-- COMPRA_VENTA_PROPIEDADES
-- Permite a usuarios autenticados actualizar y eliminar solicitudes de compra/venta
DROP POLICY IF EXISTS "Authenticated users can update property interests" ON compra_venta_propiedades;
DROP POLICY IF EXISTS "Authenticated users can delete property interests" ON compra_venta_propiedades;

CREATE POLICY "Authenticated users can update property interests"
  ON compra_venta_propiedades FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete property interests"
  ON compra_venta_propiedades FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
--
-- Si el script se ejecutó sin errores, las políticas RLS están ahora configuradas.
--
-- IMPORTANTE: Cierra sesión del panel de admin y vuelve a iniciar sesión para
-- que los cambios surtan efecto.
--
-- Para verificar que funcionó, ejecuta esta query:
--
-- SELECT tablename, policyname, cmd as operacion
-- FROM pg_policies
-- WHERE schemaname = 'public' AND roles = '{authenticated}'
-- ORDER BY tablename, cmd;
--
-- Deberías ver políticas INSERT, UPDATE y DELETE para cada tabla.
--
-- ============================================================================
