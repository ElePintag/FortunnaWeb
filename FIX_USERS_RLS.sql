/*
  # Arreglar políticas RLS para tabla users

  Este script agrega una política que permite a los usuarios autenticados
  ver su propio registro en la tabla users (necesario para obtener su rol)
*/

-- 1. Eliminar la política existente de SELECT si existe
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- 2. Crear política para que usuarios vean su propio registro por email
CREATE POLICY "Users can view own record by email"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 3. Crear política para que admins puedan ver todos los usuarios
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

-- 4. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users';
