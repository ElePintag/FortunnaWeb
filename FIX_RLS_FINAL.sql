/*
  # Arreglo FINAL de políticas RLS para tabla users

  Este script elimina TODAS las políticas existentes y las recrea correctamente
  para que:
  1. Cada usuario pueda ver su propio registro (necesario para obtener su rol)
  2. Los admins puedan ver todos los usuarios
  3. Los admins puedan crear, editar y eliminar usuarios
*/

-- ============================================
-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- ============================================

DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Users can view own record by email" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- ============================================
-- PASO 2: CREAR POLÍTICAS DE SELECT (LECTURA)
-- ============================================

-- Política 1: Permitir que cada usuario vea su propio registro
CREATE POLICY "Users can view own record"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Política 2: Permitir que los admins vean todos los usuarios
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND u.rol = 'admin'
    )
  );

-- ============================================
-- PASO 3: CREAR POLÍTICAS DE INSERT (CREAR)
-- ============================================

CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND u.rol = 'admin'
    )
  );

-- ============================================
-- PASO 4: CREAR POLÍTICAS DE UPDATE (EDITAR)
-- ============================================

CREATE POLICY "Admins can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND u.rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND u.rol = 'admin'
    )
  );

-- ============================================
-- PASO 5: CREAR POLÍTICAS DE DELETE (ELIMINAR)
-- ============================================

CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      AND u.rol = 'admin'
    )
  );

-- ============================================
-- PASO 6: VERIFICACIÓN
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

-- Verificar usuarios existentes
SELECT
  email as "Email",
  rol as "Rol",
  created_at as "Creado"
FROM users
ORDER BY created_at DESC;
