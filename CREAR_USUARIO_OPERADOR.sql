/*
  # Crear Usuario Operador

  Este script configura el sistema de roles y crea usuarios de ejemplo.

  ## Roles disponibles:
  - admin: Acceso completo (Slides, Terrenos, Compra/Venta, Usuarios, Nosotros, Logs, Configuración)
  - operador: Acceso limitado (Solo Terrenos y Compra/Venta)

  ## IMPORTANTE:
  Después de ejecutar este script, debes crear los usuarios en Supabase Auth manualmente.
*/

-- ============================================
-- PASO 1: DESHABILITAR RLS EN TABLA USERS
-- ============================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 2: ELIMINAR POLÍTICAS PROBLEMÁTICAS
-- ============================================

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

-- Eliminar función problemática
DROP FUNCTION IF EXISTS get_user_role();

-- ============================================
-- PASO 3: CREAR/ACTUALIZAR USUARIOS
-- ============================================

-- Usuario Admin (ya existe)
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
-- PASO 4: VERIFICACIÓN
-- ============================================

-- Ver todos los usuarios configurados
SELECT
  id,
  email,
  rol,
  CASE
    WHEN rol = 'admin' THEN '✅ ADMINISTRADOR - Acceso completo'
    WHEN rol = 'operador' THEN '✅ OPERADOR - Solo Terrenos y Compra/Venta'
    ELSE '⚠️  Usuario sin rol'
  END as permisos,
  created_at
FROM users
ORDER BY rol DESC, email;

-- Ver estado de RLS
SELECT
  tablename as "Tabla",
  CASE
    WHEN rowsecurity THEN '🔒 Habilitado'
    ELSE '🔓 Deshabilitado'
  END as "RLS"
FROM pg_tables
WHERE tablename = 'users';

-- ============================================
-- SIGUIENTE PASO: CREAR EN SUPABASE AUTH
-- ============================================

/*
  IMPORTANTE: Ahora debes crear el usuario en Supabase Auth

  Opción 1 - Desde Supabase Dashboard:
  ------------------------------------
  1. Ve a: Authentication > Users
  2. Click en "Add user" > "Create new user"
  3. Ingresa:
     - Email: operador@fortunna.com
     - Password: operador123
     - Auto Confirm User: ✅ (activado)
  4. Click en "Create user"

  Opción 2 - Desde tu aplicación (código):
  -----------------------------------------
  En la consola del navegador o desde un script:

  const { data, error } = await supabase.auth.signUp({
    email: 'operador@fortunna.com',
    password: 'operador123',
    options: {
      emailRedirectTo: undefined // No enviar email de confirmación
    }
  });

  console.log('Usuario creado:', data);

  NOTA: Si usas esta opción, el usuario necesitará confirmar su email
        a menos que desactives la confirmación de email en:
        Authentication > Settings > Email Auth > "Enable email confirmations"
*/
