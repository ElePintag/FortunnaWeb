# Sistema de Roles - Fortunna

## Descripción

El sistema maneja dos tipos de usuarios con diferentes niveles de acceso:

### 👨‍💼 Administrador (admin)
**Acceso completo a:**
- ✅ Slides del Banner
- ✅ Terrenos
- ✅ Compra/Venta de Propiedades
- ✅ Usuarios (crear, editar, eliminar)
- ✅ Página Nosotros
- ✅ Logs del Sistema
- ✅ Configuración General

### 👤 Operador (operador)
**Acceso limitado a:**
- ✅ Terrenos (gestión completa)
- ✅ Compra/Venta de Propiedades (gestión completa)
- ❌ No puede acceder al resto de secciones

---

## Configuración Inicial

### Paso 1: Ejecutar Script SQL

Ejecuta el archivo `CREAR_USUARIO_OPERADOR.sql` en el SQL Editor de Supabase:

1. Ve a tu proyecto en Supabase
2. Abre: SQL Editor (menú lateral izquierdo)
3. Click en "New query"
4. Copia y pega el contenido de `CREAR_USUARIO_OPERADOR.sql`
5. Click en "Run" (botón verde)

Este script:
- Deshabilita RLS en la tabla `users` para evitar problemas de recursión
- Crea/actualiza los registros de usuarios con sus roles
- Verifica que todo esté configurado correctamente

### Paso 2: Crear Usuario en Supabase Auth

Los usuarios deben existir tanto en la tabla `users` como en `auth.users` de Supabase.

#### Opción A - Desde Supabase Dashboard (Recomendado):

1. Ve a: **Authentication > Users**
2. Click en **"Add user"**
3. Selecciona **"Create new user"**
4. Completa:
   - Email: `operador@fortunna.com`
   - Password: `operador123`
   - Auto Confirm User: ✅ (marcar el checkbox)
5. Click en **"Create user"**

#### Opción B - Usando código:

Puedes crear el usuario programáticamente:

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'operador@fortunna.com',
  password: 'operador123'
});

if (error) {
  console.error('Error:', error);
} else {
  console.log('Usuario creado:', data);
}
```

---

## Cómo Funciona

### Flujo de Autenticación:

1. **Login**: Usuario ingresa email y contraseña
2. **Validación**: Supabase Auth valida las credenciales
3. **Obtención de Rol**: El sistema busca el rol en la tabla `users` según el email
4. **Renderizado**: El dashboard muestra solo las secciones permitidas según el rol

### Verificación de Permisos:

El código verifica el rol del usuario en dos lugares:

1. **AuthContext** (`contexts/AuthContext.tsx`):
   - Obtiene el rol desde la base de datos
   - Expone `isAdmin` e `isOperador` para validaciones

2. **Dashboard** (`app/admin/dashboard/page.tsx`):
   - Renderiza solo las pestañas permitidas según el rol
   - Los operadores solo ven "Terrenos" y "Compra/Venta"

---

## Usuarios de Ejemplo

### Usuario Admin:
- **Email**: `admin@fortunna.com`
- **Password**: `admin123`
- **Acceso**: Completo

### Usuario Operador:
- **Email**: `operador@fortunna.com`
- **Password**: `operador123`
- **Acceso**: Solo Terrenos y Compra/Venta

---

## Agregar Más Usuarios

### Para agregar un nuevo Administrador:

1. Ejecuta en SQL Editor:
```sql
INSERT INTO users (email, rol, created_at, updated_at)
VALUES ('nuevo-admin@fortunna.com', 'admin', NOW(), NOW())
ON CONFLICT (email)
DO UPDATE SET rol = 'admin', updated_at = NOW();
```

2. Crea el usuario en Authentication > Users (Supabase Dashboard)

### Para agregar un nuevo Operador:

1. Ejecuta en SQL Editor:
```sql
INSERT INTO users (email, rol, created_at, updated_at)
VALUES ('nuevo-operador@fortunna.com', 'operador', NOW(), NOW())
ON CONFLICT (email)
DO UPDATE SET rol = 'operador', updated_at = NOW();
```

2. Crea el usuario en Authentication > Users (Supabase Dashboard)

---

## Verificación

Para verificar que los usuarios están correctamente configurados:

```sql
-- Ver todos los usuarios y sus roles
SELECT
  id,
  email,
  rol,
  CASE
    WHEN rol = 'admin' THEN '✅ ADMINISTRADOR'
    WHEN rol = 'operador' THEN '✅ OPERADOR'
    ELSE '⚠️  Sin rol'
  END as tipo,
  created_at
FROM users
ORDER BY rol DESC, email;
```

---

## Solución de Problemas

### Error: "permission denied for table users"

**Causa**: RLS está habilitado en la tabla users y causa problemas de recursión.

**Solución**: Ejecuta:
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

### El usuario no puede iniciar sesión

**Verifica**:
1. El usuario existe en Authentication > Users
2. El email está confirmado (o "Auto Confirm" está activado)
3. El usuario tiene un rol asignado en la tabla `users`

### El operador ve todas las pestañas

**Verifica**:
1. El rol en la base de datos está correctamente asignado
2. Cierra sesión y vuelve a iniciar sesión
3. Revisa la consola del navegador para ver el estado de autenticación

---

## Notas Técnicas

- **RLS Deshabilitado**: La tabla `users` tiene RLS deshabilitado para evitar recursión
- **Seguridad**: Los permisos se manejan en el frontend según el rol
- **Sin Políticas**: No se usan políticas RLS en la tabla `users`
- **Simplicidad**: La verificación de roles es directa y sin complejidades

---

## Próximos Pasos

Si necesitas agregar más roles en el futuro:

1. Agrega el nuevo rol a la tabla `users`
2. Actualiza el tipo `userRole` en `AuthContext.tsx`
3. Agrega las validaciones necesarias en el dashboard
4. Documenta los permisos del nuevo rol
