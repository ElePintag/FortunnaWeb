# Instrucciones para Implementar el Rol de Operador

## Resumen de Cambios

Se ha implementado un nuevo rol llamado **"operador"** que tiene acceso limitado al panel de administración. Este rol solo puede acceder a:

1. **Terrenos** (CRUD completo)
2. **Solicitudes de Compra/Venta** (lectura y actualización)

El rol **"admin"** mantiene acceso completo a todas las secciones.

---

## Paso 1: Aplicar la Migración SQL

### Opción A: Desde el Dashboard de Supabase (RECOMENDADO)

1. Ve a tu dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. En el menú lateral, haz clic en **SQL Editor**
4. Abre el archivo `AGREGAR_ROL_OPERADOR.sql` que está en la raíz del proyecto
5. Copia TODO el contenido del archivo
6. Pégalo en el editor SQL de Supabase
7. Haz clic en el botón **"Run"** (esquina inferior derecha)
8. Espera a que aparezca el mensaje "Success. No rows returned"

### Opción B: Desde la Terminal (Alternativa)

Si tienes el CLI de Supabase instalado:

```bash
supabase db push
```

---

## Paso 2: Verificar que la Migración se Aplicó Correctamente

En el SQL Editor de Supabase, ejecuta esta consulta para verificar:

```sql
-- Verificar que el constraint acepta 'operador'
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'users_rol_check';

-- Verificar que las funciones existen
SELECT routine_name
FROM information_schema.routines
WHERE routine_name IN ('is_admin', 'is_operador', 'is_admin_or_operador');

-- Verificar políticas actualizadas
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('terrenos', 'compra_venta_propiedades')
ORDER BY tablename, policyname;
```

Deberías ver:
- El constraint `users_rol_check` permitiendo 'admin', 'operador' y 'user'
- Las tres funciones creadas
- Políticas actualizadas con nombres como "Admin and Operador can..."

---

## Paso 3: Crear Usuarios con el Nuevo Rol

### Desde el Panel de Administración

1. Inicia sesión como administrador
2. Ve a la pestaña **"Usuarios"**
3. Haz clic en **"Nuevo Usuario"**
4. Completa el formulario:
   - **Email**: ejemplo@dominio.com
   - **Contraseña**: mínimo 6 caracteres
   - **Rol**: Selecciona "Operador" o "Administrador"
5. Haz clic en **"Crear Usuario"**

El sistema automáticamente:
- Creará el usuario en `auth.users`
- Asignará el rol en `app_metadata`
- Creará el registro en la tabla `users`

---

## Paso 4: Verificar el Funcionamiento

### Probar con Usuario Operador

1. Cierra sesión del administrador
2. Inicia sesión con las credenciales del operador
3. Verifica que SOLO veas las pestañas:
   - ✅ **Terrenos**
   - ✅ **Compra/Venta**
4. Verifica que NO veas:
   - ❌ Slides del Banner
   - ❌ Usuarios
   - ❌ Nosotros
   - ❌ Logs
   - ❌ Configuración

### Probar Permisos de Operador

**En Terrenos:**
- ✅ Puede crear propiedades
- ✅ Puede editar propiedades
- ✅ Puede eliminar propiedades
- ✅ Puede subir imágenes

**En Compra/Venta:**
- ✅ Puede ver todas las solicitudes
- ✅ Puede actualizar estado (pendiente, en proceso, completado, cancelado)
- ✅ Puede agregar notas administrativas
- ❌ NO puede eliminar solicitudes (solo admin)

---

## Diferencias entre Roles

### Rol: admin

| Sección | Permisos |
|---------|----------|
| Slides del Banner | ✅ CRUD completo |
| Terrenos | ✅ CRUD completo |
| Compra/Venta | ✅ CRUD completo |
| Trabaje Con Nosotros | ✅ CRUD completo |
| Configuración | ✅ CRUD completo |
| Nosotros | ✅ CRUD completo |
| Usuarios | ✅ CRUD completo |
| Logs | ✅ Lectura completa |

### Rol: operador

| Sección | Permisos |
|---------|----------|
| Slides del Banner | ❌ Sin acceso |
| Terrenos | ✅ CRUD completo |
| Compra/Venta | ✅ Lectura y actualización (no puede eliminar) |
| Trabaje Con Nosotros | ❌ Sin acceso |
| Configuración | ❌ Sin acceso |
| Nosotros | ❌ Sin acceso |
| Usuarios | ❌ Sin acceso |
| Logs | ❌ Sin acceso |

---

## Actualizar Usuarios Existentes

Si tienes usuarios existentes que quieres convertir en operadores:

### Desde SQL Editor de Supabase

```sql
-- Cambiar un usuario a operador
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"rol": "operador"}'::jsonb
WHERE email = 'usuario@ejemplo.com';

-- Actualizar también en la tabla users
UPDATE users
SET rol = 'operador'
WHERE email = 'usuario@ejemplo.com';
```

### Verificar el Cambio

```sql
-- Ver el rol actual de un usuario
SELECT email, raw_app_meta_data->>'rol' as rol
FROM auth.users
WHERE email = 'usuario@ejemplo.com';
```

---

## Estructura de app_metadata

Cuando creas un usuario, el `app_metadata` debe tener esta estructura:

```json
{
  "rol": "operador"
}
```

o

```json
{
  "rol": "admin"
}
```

Esto se configura automáticamente cuando creas usuarios desde el panel.

---

## Solución de Problemas

### Problema: Usuario operador puede ver secciones de admin

**Causa**: El `app_metadata` no tiene el rol correcto.

**Solución**:
```sql
UPDATE auth.users
SET raw_app_meta_data = '{"rol": "operador"}'::jsonb
WHERE email = 'usuario@ejemplo.com';
```

### Problema: Usuario operador no puede editar terrenos

**Causa**: Las políticas RLS no se aplicaron correctamente.

**Solución**: Vuelve a ejecutar la migración completa desde el SQL Editor.

### Problema: Usuario operador puede eliminar solicitudes de compra/venta

**Causa**: La política de DELETE no se aplicó correctamente.

**Solución**:
```sql
DROP POLICY IF EXISTS "Only admin can delete compra_venta" ON compra_venta_propiedades;

CREATE POLICY "Only admin can delete compra_venta"
ON compra_venta_propiedades FOR DELETE
TO authenticated
USING ((auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin');
```

### Problema: Error "rol" does not exist al crear usuario

**Causa**: El constraint de la tabla users no se actualizó.

**Solución**:
```sql
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_rol_check;
ALTER TABLE users ADD CONSTRAINT users_rol_check
CHECK (rol IN ('admin', 'operador', 'user'));
```

---

## Verificación Final: Checklist

Antes de dar por completada la implementación, verifica:

- [ ] La migración SQL se ejecutó sin errores
- [ ] El constraint `users_rol_check` incluye 'operador'
- [ ] Las funciones `is_admin()`, `is_operador()`, `is_admin_or_operador()` existen
- [ ] Las políticas RLS de `terrenos` permiten admin y operador
- [ ] Las políticas RLS de `compra_venta_propiedades` permiten admin y operador (lectura/escritura)
- [ ] La política DELETE de `compra_venta_propiedades` solo permite admin
- [ ] Puedes crear un usuario con rol "operador" desde el panel
- [ ] El operador solo ve las pestañas "Terrenos" y "Compra/Venta"
- [ ] El operador puede crear/editar/eliminar terrenos
- [ ] El operador puede actualizar estado de solicitudes de compra/venta
- [ ] El operador NO puede eliminar solicitudes de compra/venta
- [ ] El operador NO puede acceder a otras secciones
- [ ] El administrador sigue teniendo acceso completo a todo

---

## Resumen de Archivos Modificados

### Backend (Base de Datos)
- **AGREGAR_ROL_OPERADOR.sql** - Script SQL para aplicar manualmente

### Frontend (Código)
- **contexts/AuthContext.tsx** - Agregado `isAdmin`, `isOperador`, `userRole`
- **components/admin/UsersManager.tsx** - Selector de rol al crear usuario
- **app/admin/dashboard/page.tsx** - Pestañas condicionales según rol

---

## Próximos Pasos Recomendados

1. **Documentar en el manual de usuario**: Actualizar el `MANUAL_USUARIO.md` con información sobre los roles
2. **Crear usuarios operadores**: Agregar los usuarios que necesiten este rol
3. **Capacitar al personal**: Explicar las diferencias de permisos
4. **Monitorear logs**: Revisar que los operadores solo accedan a lo permitido

---

## Contacto para Soporte

Si encuentras problemas durante la implementación:

1. Verifica los logs del navegador (F12 → Console)
2. Revisa los errores de Supabase en el Dashboard → Logs
3. Ejecuta las consultas de verificación arriba mencionadas
4. Contacta al equipo de desarrollo con capturas de pantalla

---

**Versión**: 1.0
**Fecha**: Marzo 2026
**Autor**: Equipo de Desarrollo Fortunna Inmobiliaria
