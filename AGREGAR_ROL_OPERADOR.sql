/*
  # Sistema de Roles: Admin y Operador

  Este script configura el sistema de roles eliminando la columna password
  y deshabilitando RLS para evitar problemas de recursión.

  Roles:
  - admin: Acceso completo
  - operador: Solo Terrenos y Compra/Venta
*/

-- ============================================
-- PASO 1: ELIMINAR COLUMNA PASSWORD
-- ============================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users'
    AND column_name = 'password'
  ) THEN
    ALTER TABLE users DROP COLUMN password;
    RAISE NOTICE '✅ Columna password eliminada';
  END IF;
END $$;

-- ============================================
-- PASO 2: DESHABILITAR RLS EN TABLA USERS
-- ============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas de users
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Users can view own record by email" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Admin can insert users" ON users;
DROP POLICY IF EXISTS "Admin can update users" ON users;
DROP POLICY IF EXISTS "Admin can delete users" ON users;
DROP POLICY IF EXISTS "Only admin can read all users" ON users;
DROP POLICY IF EXISTS "Only admin can insert users" ON users;
DROP POLICY IF EXISTS "Only admin can update users" ON users;
DROP POLICY IF EXISTS "Only admin can delete users" ON users;

-- Eliminar funciones problemáticas
DROP FUNCTION IF EXISTS get_user_role();
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_operador();
DROP FUNCTION IF EXISTS is_admin_or_operador();

-- ============================================
-- PASO 3: ACTUALIZAR CONSTRAINT
-- ============================================

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_rol_check;
ALTER TABLE users ADD CONSTRAINT users_rol_check
CHECK (rol IN ('admin', 'operador', 'user'));

-- ============================================
-- PASO 4: CREAR/ACTUALIZAR USUARIOS
-- ============================================

-- Usuario Admin
INSERT INTO users (email, rol, created_at, updated_at)
VALUES ('admin@fortunna.com', 'admin', NOW(), NOW())
ON CONFLICT (email)
DO UPDATE SET rol = 'admin', updated_at = NOW();

-- Usuario Operador
INSERT INTO users (email, rol, created_at, updated_at)
VALUES ('operador@fortunna.com', 'operador', NOW(), NOW())
ON CONFLICT (email)
DO UPDATE SET rol = 'operador', updated_at = NOW();

-- ============================================
-- PASO 5: VERIFICACIÓN
-- ============================================

-- Ver usuarios
SELECT
  email,
  rol,
  CASE
    WHEN rol = 'admin' THEN '✅ ADMINISTRADOR'
    WHEN rol = 'operador' THEN '✅ OPERADOR'
    ELSE '⚠️  Sin rol'
  END as tipo
FROM users
ORDER BY rol DESC, email;

