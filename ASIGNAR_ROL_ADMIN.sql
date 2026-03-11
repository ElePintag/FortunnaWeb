/*
  # Asignar Rol de Administrador a admin@fortunna.com

  Este script agrega o actualiza el usuario admin@fortunna.com
  con rol de administrador.

  Contraseña: admin123
*/

-- Insertar o actualizar usuario admin
INSERT INTO users (email, password, rol)
VALUES (
  'admin@fortunna.com',
  '$2a$10$rH8L9p7Vx4aYKGXxvKZXZOQxH6FZqN4vL8yC5wZ3jN2pQ1xR9tL6C',
  'admin'
)
ON CONFLICT (email)
DO UPDATE SET
  rol = 'admin',
  updated_at = now();

-- Verificar que se creó correctamente
SELECT id, email, rol, created_at, updated_at
FROM users
WHERE email = 'admin@fortunna.com';
