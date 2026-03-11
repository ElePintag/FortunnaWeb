/*
  # Sistema de Roles: Admin y Operador

  ## Roles:
  - admin: Acceso completo a todo el dashboard
  - operador: Solo acceso a Terrenos y Compra/Venta

  ## Pasos:
  1. Deshabilitar RLS en la tabla users para evitar recursión
  2. Los permisos se manejarán en el frontend según el rol
*/

-- ============================================
-- PASO 1: DESHABILITAR RLS EN TABLA USERS
-- ============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Eliminar todas las políticas de users
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Eliminar la función problemática
DROP FUNCTION IF EXISTS get_user_role();

-- ============================================
-- PASO 2: VERIFICAR/CREAR USUARIOS DE EJEMPLO
-- ============================================

-- Usuario Admin
INSERT INTO users (email, rol, created_at, updated_at)
VALUES ('admin@fortunna.com', 'admin', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET rol = 'admin';

-- Usuario Operador de ejemplo
INSERT INTO users (email, rol, created_at, updated_at)
VALUES ('operador@fortunna.com', 'operador', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- PASO 3: CREAR USUARIOS EN AUTH.USERS
-- ============================================

-- Nota: Debes crear los usuarios en Supabase Auth manualmente:
-- 1. Ve a Authentication > Users en Supabase Dashboard
-- 2. Crea usuario: operador@fortunna.com con contraseña: operador123
--
-- O usa este código desde tu aplicación:
-- await supabase.auth.signUp({
--   email: 'operador@fortunna.com',
--   password: 'operador123'
-- })

-- ============================================
-- PASO 4: VERIFICACIÓN
-- ============================================

-- Ver todos los usuarios y sus roles
SELECT
  id,
  email,
  rol,
  CASE
    WHEN rol = 'admin' THEN '✅ Administrador - Acceso completo'
    WHEN rol = 'operador' THEN '✅ Operador - Solo Terrenos y Compra/Venta'
    ELSE '⚠️  Usuario regular'
  END as permisos
FROM users
ORDER BY rol, email;

-- Ver estado de RLS
SELECT
  schemaname,
  tablename,
  rowsecurity as "RLS Habilitado"
FROM pg_tables
WHERE tablename = 'users';
