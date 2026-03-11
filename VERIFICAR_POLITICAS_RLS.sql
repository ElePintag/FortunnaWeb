-- Script para verificar las políticas RLS de la tabla users

-- 1. Ver todas las políticas de la tabla users
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- 2. Verificar que RLS está habilitado
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'users';

-- 3. Verificar usuarios en la tabla
SELECT id, email, rol, created_at
FROM users
ORDER BY created_at DESC;
