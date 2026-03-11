/*
  # Crear Tabla de Usuarios

  Este script crea la tabla 'users' para gestionar usuarios del sistema
  con sus roles (admin, operador, user)
*/

-- 1. Crear la tabla users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear índice para búsquedas rápidas por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Crear índice para filtrar por rol
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);

-- 4. Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Política: Los admins pueden ver todos los usuarios
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.rol = 'admin'
    )
  );

-- 6. Política: Los admins pueden insertar usuarios
CREATE POLICY "Admins can insert users"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.rol = 'admin'
    )
  );

-- 7. Política: Los admins pueden actualizar usuarios
CREATE POLICY "Admins can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.rol = 'admin'
    )
  );

-- 8. Política: Los admins pueden eliminar usuarios
CREATE POLICY "Admins can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.rol = 'admin'
    )
  );

-- 9. Crear el usuario administrador inicial
INSERT INTO users (email, password, rol)
VALUES ('admin@fortunna.com', '$2a$10$rH8L9p7Vx4aYKGXxvKZXZOQxH6FZqN4vL8yC5wZ3jN2pQ1xR9tL6C', 'admin')
ON CONFLICT (email) DO UPDATE
SET rol = 'admin';

-- 10. Verificar que se creó correctamente
SELECT id, email, rol, created_at FROM users;
