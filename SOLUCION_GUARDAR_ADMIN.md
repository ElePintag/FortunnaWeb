# 🔧 Solución: Error al Guardar en el Panel Admin

Si ves el error **"Error al actualizar la sección"** o cualquier problema al guardar cambios en el panel de administración, sigue esta guía.

---

## 🎯 Causa Más Común

El problema es que las **políticas RLS (Row Level Security)** de Supabase no permiten que usuarios autenticados creen o actualicen registros.

---

## ✅ Solución Rápida (5 minutos)

### Paso 1: Acceder al SQL Editor de Supabase

1. Ve a https://supabase.com/dashboard
2. Inicia sesión
3. Selecciona tu proyecto
4. Clic en **"SQL Editor"** en el menú lateral izquierdo
5. Clic en **"New query"**

### Paso 2: Ejecutar Script de Corrección

Copia y pega este SQL completo en el editor:

```sql
-- ============================================================================
-- CORREGIR POLÍTICAS RLS PARA EL PANEL DE ADMINISTRACIÓN
-- ============================================================================

-- SLIDES
DROP POLICY IF EXISTS "Authenticated users can insert slides" ON slides;
DROP POLICY IF EXISTS "Authenticated users can update slides" ON slides;
DROP POLICY IF EXISTS "Authenticated users can delete slides" ON slides;

CREATE POLICY "Authenticated users can insert slides"
  ON slides FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update slides"
  ON slides FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete slides"
  ON slides FOR DELETE
  TO authenticated
  USING (true);

-- TERRENOS
DROP POLICY IF EXISTS "Authenticated users can insert terrenos" ON terrenos;
DROP POLICY IF EXISTS "Authenticated users can update terrenos" ON terrenos;
DROP POLICY IF EXISTS "Authenticated users can delete terrenos" ON terrenos;

CREATE POLICY "Authenticated users can insert terrenos"
  ON terrenos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update terrenos"
  ON terrenos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete terrenos"
  ON terrenos FOR DELETE
  TO authenticated
  USING (true);

-- NOSOTROS
DROP POLICY IF EXISTS "Authenticated users can insert nosotros" ON nosotros;
DROP POLICY IF EXISTS "Authenticated users can update nosotros" ON nosotros;
DROP POLICY IF EXISTS "Authenticated users can delete nosotros" ON nosotros;

CREATE POLICY "Authenticated users can insert nosotros"
  ON nosotros FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update nosotros"
  ON nosotros FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete nosotros"
  ON nosotros FOR DELETE
  TO authenticated
  USING (true);

-- CONFIGURACION
DROP POLICY IF EXISTS "Authenticated users can insert configuration" ON configuracion;
DROP POLICY IF EXISTS "Authenticated users can update configuration" ON configuracion;
DROP POLICY IF EXISTS "Authenticated users can delete configuration" ON configuracion;

CREATE POLICY "Authenticated users can insert configuration"
  ON configuracion FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update configuration"
  ON configuracion FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete configuration"
  ON configuracion FOR DELETE
  TO authenticated
  USING (true);

-- TRABAJE_CON_NOSOTROS
DROP POLICY IF EXISTS "Authenticated users can update job applications" ON trabaje_con_nosotros;
DROP POLICY IF EXISTS "Authenticated users can delete job applications" ON trabaje_con_nosotros;

CREATE POLICY "Authenticated users can update job applications"
  ON trabaje_con_nosotros FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job applications"
  ON trabaje_con_nosotros FOR DELETE
  TO authenticated
  USING (true);

-- COMPRA_VENTA_PROPIEDADES
DROP POLICY IF EXISTS "Authenticated users can update property interests" ON compra_venta_propiedades;
DROP POLICY IF EXISTS "Authenticated users can delete property interests" ON compra_venta_propiedades;

CREATE POLICY "Authenticated users can update property interests"
  ON compra_venta_propiedades FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete property interests"
  ON compra_venta_propiedades FOR DELETE
  TO authenticated
  USING (true);
```

### Paso 3: Ejecutar

1. Clic en **"Run"** (o presiona `Ctrl+Enter` / `Cmd+Enter`)
2. Espera a que termine (debería tomar 1-2 segundos)
3. Verifica que no haya errores

### Paso 4: Probar

1. Vuelve al panel de administración
2. **Cierra sesión** y vuelve a **iniciar sesión**
3. Intenta crear o editar un slide/terreno/sección
4. ¡Debería funcionar! ✅

---

## 🔍 Verificar que Funcionó

Si después de ejecutar el script quieres verificar que las políticas están bien:

```sql
-- Ver todas las políticas de RLS
SELECT
  tablename,
  policyname,
  cmd as operacion,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

Deberías ver políticas para `INSERT`, `UPDATE` y `DELETE` en cada tabla para el rol `authenticated`.

---

## 🐛 Si Sigue Sin Funcionar

### Problema 1: No estás autenticado

**Síntomas:** Error "Verifica que estés autenticado"

**Solución:**
1. Cierra sesión del panel admin
2. Vuelve a iniciar sesión
3. Intenta de nuevo

### Problema 2: Usuario no existe

**Síntomas:** No puedes iniciar sesión

**Solución:** Crea el usuario admin:

1. Ve a **Authentication** → **Users** en Supabase Dashboard
2. Clic en **"Add user"** → **"Create new user"**
3. Completa:
   - Email: `admin@fortunna.com`
   - Password: `admin123`
   - **Auto Confirm User:** ✓ (importante!)
4. Clic en **"Create user"**

### Problema 3: Error en la consola del navegador

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Captura el error completo
4. El error te dirá exactamente qué está fallando

Los errores comunes:

- **`new row violates row-level security policy`** → Las políticas RLS no están configuradas (ejecuta el script de arriba)
- **`JWT expired`** → Tu sesión expiró (cierra sesión y vuelve a iniciar)
- **`Invalid API key`** → Las variables de entorno están mal configuradas

---

## 💡 Mejoras Aplicadas

He mejorado el código para que ahora:

1. **Mensajes más claros:** Ahora verás exactamente qué error ocurrió
2. **Confirmación de éxito:** Te dice cuando algo se guardó correctamente
3. **Mejor manejo de errores:** Los errores incluyen información detallada

Ejemplo de mensaje:
- ✅ "Sección actualizada exitosamente"
- ❌ "Error al actualizar sección: new row violates row-level security policy"

---

## 📋 Checklist de Verificación

Antes de pedir ayuda, verifica que:

- [ ] Ejecutaste el script SQL completo sin errores
- [ ] Cerraste sesión y volviste a iniciar sesión
- [ ] Tu usuario está creado y confirmado en Authentication → Users
- [ ] Las variables de entorno están configuradas correctamente
- [ ] Revisaste la consola del navegador (F12) para ver el error exacto

---

## 📞 ¿Necesitas Más Ayuda?

Si después de seguir todos estos pasos el problema persiste:

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta guardar un cambio
4. Captura el error completo que aparece
5. Comparte el error y te ayudaré a solucionarlo

---

¡Éxito! 🚀
