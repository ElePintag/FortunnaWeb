/*
  # Asignar Rol de Administrador

  Este script:
  1. Agrega la columna 'rol' a la tabla users si no existe
  2. Asigna el rol 'admin' al usuario admin@fortunna.com

  Ejecutar este script en el SQL Editor de Supabase
*/

-- 1. Agregar columna 'rol' si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'rol'
  ) THEN
    ALTER TABLE users ADD COLUMN rol VARCHAR(20) DEFAULT 'user';
    COMMENT ON COLUMN users.rol IS 'Rol del usuario: admin, operador, o user';
  END IF;
END $$;

-- 2. Asignar rol de admin al usuario admin@fortunna.com
UPDATE users
SET rol = 'admin'
WHERE email = 'admin@fortunna.com';

-- 3. Verificar que se aplicó correctamente
SELECT id, email, rol, created_at
FROM users
WHERE email = 'admin@fortunna.com';
