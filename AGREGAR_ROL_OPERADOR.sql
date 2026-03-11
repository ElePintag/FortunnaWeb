/*
  # Agregar rol de operador al sistema

  1. Cambios
    - Modificar constraint de la tabla users para incluir rol 'operador'
    - Actualizar políticas RLS para soportar rol operador
    - El rol operador tendrá acceso a:
      - Terrenos (CRUD completo)
      - Compra/Venta de Propiedades (lectura y actualización de estado)

  2. Roles del sistema
    - admin: Acceso completo a todo
    - operador: Acceso limitado a Terrenos y Compra/Venta
    - user: Sin acceso al panel (futuro uso)

  3. Seguridad
    - Las políticas RLS se actualizan para validar ambos roles
    - Los operadores NO pueden modificar usuarios, configuración, slides, nosotros ni ver logs

  4. INSTRUCCIONES PARA APLICAR ESTA MIGRACIÓN:
    - Ve a tu dashboard de Supabase: https://app.supabase.com
    - Abre tu proyecto
    - Ve a SQL Editor
    - Copia y pega TODO este script
    - Haz clic en "Run"
*/

-- Eliminar el constraint anterior que solo permitía 'admin' y 'user'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_rol_check;

-- Agregar nuevo constraint que incluye 'operador'
ALTER TABLE users ADD CONSTRAINT users_rol_check
CHECK (rol IN ('admin', 'operador', 'user'));

-- Actualizar función helper para verificar si es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función helper para verificar si es admin u operador
CREATE OR REPLACE FUNCTION is_admin_or_operador()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'rol') IN ('admin', 'operador');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función helper para verificar si es operador
CREATE OR REPLACE FUNCTION is_operador()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'rol') = 'operador';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ACTUALIZAR POLÍTICAS DE TERRENOS
-- Admin y Operador tienen acceso completo
-- =============================================

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Admin can insert terrenos" ON terrenos;
DROP POLICY IF EXISTS "Admin can update terrenos" ON terrenos;
DROP POLICY IF EXISTS "Admin can delete terrenos" ON terrenos;

-- Crear nuevas políticas para admin y operador
CREATE POLICY "Admin and Operador can insert terrenos"
ON terrenos FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_operador());

CREATE POLICY "Admin and Operador can update terrenos"
ON terrenos FOR UPDATE
TO authenticated
USING (is_admin_or_operador())
WITH CHECK (is_admin_or_operador());

CREATE POLICY "Admin and Operador can delete terrenos"
ON terrenos FOR DELETE
TO authenticated
USING (is_admin_or_operador());

-- =============================================
-- ACTUALIZAR POLÍTICAS DE COMPRA_VENTA_PROPIEDADES
-- Admin y Operador pueden leer y actualizar
-- Solo admin puede eliminar
-- =============================================

DROP POLICY IF EXISTS "Admin can read compra_venta" ON compra_venta_propiedades;
DROP POLICY IF EXISTS "Admin can update compra_venta" ON compra_venta_propiedades;
DROP POLICY IF EXISTS "Admin can delete compra_venta" ON compra_venta_propiedades;

CREATE POLICY "Admin and Operador can read compra_venta"
ON compra_venta_propiedades FOR SELECT
TO authenticated
USING (is_admin_or_operador());

CREATE POLICY "Admin and Operador can update compra_venta"
ON compra_venta_propiedades FOR UPDATE
TO authenticated
USING (is_admin_or_operador())
WITH CHECK (is_admin_or_operador());

CREATE POLICY "Only admin can delete compra_venta"
ON compra_venta_propiedades FOR DELETE
TO authenticated
USING (is_admin());

-- =============================================
-- ASEGURAR QUE OTRAS TABLAS SEAN SOLO ADMIN
-- =============================================

-- Slides: Solo admin
DROP POLICY IF EXISTS "Admin can insert slides" ON slides;
DROP POLICY IF EXISTS "Admin can update slides" ON slides;
DROP POLICY IF EXISTS "Admin can delete slides" ON slides;

CREATE POLICY "Only admin can insert slides"
ON slides FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update slides"
ON slides FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete slides"
ON slides FOR DELETE
TO authenticated
USING (is_admin());

-- Configuración: Solo admin
DROP POLICY IF EXISTS "Admin can insert configuracion" ON configuracion;
DROP POLICY IF EXISTS "Admin can update configuracion" ON configuracion;
DROP POLICY IF EXISTS "Admin can delete configuracion" ON configuracion;

CREATE POLICY "Only admin can insert configuracion"
ON configuracion FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update configuracion"
ON configuracion FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete configuracion"
ON configuracion FOR DELETE
TO authenticated
USING (is_admin());

-- Nosotros: Solo admin
DROP POLICY IF EXISTS "Admin can insert nosotros" ON nosotros;
DROP POLICY IF EXISTS "Admin can update nosotros" ON nosotros;
DROP POLICY IF EXISTS "Admin can delete nosotros" ON nosotros;

CREATE POLICY "Only admin can insert nosotros"
ON nosotros FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update nosotros"
ON nosotros FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete nosotros"
ON nosotros FOR DELETE
TO authenticated
USING (is_admin());

-- Trabaje con nosotros: Solo admin puede gestionar
DROP POLICY IF EXISTS "Admin can read trabaje_con_nosotros" ON trabaje_con_nosotros;
DROP POLICY IF EXISTS "Admin can update trabaje_con_nosotros" ON trabaje_con_nosotros;
DROP POLICY IF EXISTS "Admin can delete trabaje_con_nosotros" ON trabaje_con_nosotros;

CREATE POLICY "Only admin can read trabaje_con_nosotros"
ON trabaje_con_nosotros FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admin can update trabaje_con_nosotros"
ON trabaje_con_nosotros FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete trabaje_con_nosotros"
ON trabaje_con_nosotros FOR DELETE
TO authenticated
USING (is_admin());

-- Users: Solo admin
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Admin can insert users" ON users;
DROP POLICY IF EXISTS "Admin can update users" ON users;
DROP POLICY IF EXISTS "Admin can delete users" ON users;

CREATE POLICY "Only admin can read all users"
ON users FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admin can insert users"
ON users FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update users"
ON users FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete users"
ON users FOR DELETE
TO authenticated
USING (is_admin());

-- Logs: Solo admin
DROP POLICY IF EXISTS "Admin can read logs" ON logs;

CREATE POLICY "Only admin can read logs"
ON logs FOR SELECT
TO authenticated
USING (is_admin());

-- =============================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =============================================

COMMENT ON FUNCTION is_admin() IS
'Verifica si el usuario autenticado tiene rol de administrador';

COMMENT ON FUNCTION is_operador() IS
'Verifica si el usuario autenticado tiene rol de operador';

COMMENT ON FUNCTION is_admin_or_operador() IS
'Verifica si el usuario autenticado es admin u operador';
