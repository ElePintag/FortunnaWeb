/*
  # Arreglo de recursión infinita en políticas RLS

  El problema: Las políticas actuales causan recursión infinita porque
  para verificar si un usuario es admin, consultan la tabla users,
  pero esa consulta requiere verificar permisos, lo que causa un bucle.

  La solución: Crear una función que use security definer para
  obtener el rol sin recursión.
*/

-- ============================================
-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- ============================================

DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Users can view own record by email" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- ============================================
-- PASO 2: CREAR FUNCIÓN PARA OBTENER ROL SIN RECURSIÓN
-- ============================================

-- Primero eliminar la función si existe
DROP FUNCTION IF EXISTS get_user_role();

-- Crear la función que obtiene el rol del usuario actual
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER -- Esto permite que la función se ejecute con permisos de superusuario
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Obtener el email del usuario autenticado
  SELECT rol INTO user_role
  FROM public.users
  WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  LIMIT 1;

  -- Si no se encuentra el usuario, retornar 'user' por defecto
  RETURN COALESCE(user_role, 'user');
END;
$$;

-- ============================================
-- PASO 3: CREAR POLÍTICAS USANDO LA FUNCIÓN
-- ============================================

-- Política para SELECT: Usuarios ven su propio registro, admins ven todo
CREATE POLICY "users_select_policy"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    -- El usuario puede ver su propio registro
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    -- O si es admin, puede ver todos
    get_user_role() = 'admin'
  );

-- Política para INSERT: Solo admins pueden crear usuarios
CREATE POLICY "users_insert_policy"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_role() = 'admin'
  );

-- Política para UPDATE: Solo admins pueden actualizar usuarios
CREATE POLICY "users_update_policy"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    get_user_role() = 'admin'
  )
  WITH CHECK (
    get_user_role() = 'admin'
  );

-- Política para DELETE: Solo admins pueden eliminar usuarios
CREATE POLICY "users_delete_policy"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    get_user_role() = 'admin'
  );

-- ============================================
-- PASO 4: VERIFICACIÓN
-- ============================================

-- Ver todas las políticas creadas
SELECT
  policyname as "Política",
  cmd as "Comando",
  CASE
    WHEN cmd = 'SELECT' THEN '✅ Lectura'
    WHEN cmd = 'INSERT' THEN '✅ Crear'
    WHEN cmd = 'UPDATE' THEN '✅ Editar'
    WHEN cmd = 'DELETE' THEN '✅ Eliminar'
  END as "Tipo"
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- Verificar que la función existe
SELECT routine_name as "Función"
FROM information_schema.routines
WHERE routine_name = 'get_user_role'
AND routine_schema = 'public';
