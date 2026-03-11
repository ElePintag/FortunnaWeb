/*
  # Verificar y Configurar Usuario Operador

  IMPORTANTE: Primero debes crear el usuario en Supabase Auth
*/

-- ============================================
-- PASO 1: VERIFICAR USUARIOS EN AUTH.USERS
-- ============================================

SELECT
  id,
  email,
  email_confirmed_at as "Confirmado",
  created_at
FROM auth.users
WHERE email IN ('admin@fortunna.com', 'operador@fortunna.com')
ORDER BY email;

-- ============================================
-- PASO 2: VERIFICAR USUARIOS EN TABLA USERS
-- ============================================

SELECT
  email,
  rol,
  created_at
FROM users
WHERE email IN ('admin@fortunna.com', 'operador@fortunna.com')
ORDER BY email;

-- ============================================
-- PASO 3: VERIFICAR SI HAY DESCONEXIÓN
-- ============================================

-- Ver relación completa
SELECT
  au.id as "ID Auth",
  au.email as "Email Auth",
  au.email_confirmed_at IS NOT NULL as "Confirmado",
  u.id as "ID Users",
  u.email as "Email Users",
  u.rol as "Rol"
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE au.email IN ('admin@fortunna.com', 'operador@fortunna.com')
ORDER BY au.email;
