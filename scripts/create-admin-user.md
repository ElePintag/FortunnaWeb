# Crear Usuario Administrador

Para crear el usuario administrador, sigue estos pasos:

## Opción 1: Desde el Dashboard de Supabase (Recomendado)

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Authentication" > "Users"
4. Click en "Add user" > "Create new user"
5. Completa los datos:
   - **Email**: `admin@fortunna.com`
   - **Password**: `admin`
   - **Auto Confirm User**: ✓ (marcar)
6. Click en "Create user"

## Opción 2: Desde SQL Editor

1. Ve a "SQL Editor" en el dashboard de Supabase
2. Ejecuta la siguiente consulta:

```sql
-- Crear usuario admin
SELECT extensions.create_user(
  'admin@fortunna.com',
  'admin',
  true
);
```

O si eso no funciona, usa:

```sql
-- Alternativa: Usar la API de Supabase Auth
-- Ejecuta esto desde tu terminal local:

curl -X POST 'https://zcdqcvarguctnvorwlgx.supabase.co/auth/v1/signup' \
-H "apikey: TU_ANON_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@fortunna.com",
  "password": "admin"
}'
```

## Opción 3: Auto-registro (Más fácil)

1. Inicia la aplicación: `npm run dev`
2. Ve a http://localhost:3000/admin/login
3. Usa el formulario de registro que se mostrará
4. Completa con:
   - Email: `admin@fortunna.com`
   - Password: `admin`

## Verificación

Una vez creado el usuario, podrás iniciar sesión en:
- http://localhost:3000/admin/login

Con las credenciales:
- **Email**: admin@fortunna.com
- **Password**: admin

**IMPORTANTE**: Cambia esta contraseña después del primer inicio de sesión en producción.
