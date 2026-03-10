# 🔄 Guía Completa de Migración a Tu Cuenta de Supabase

Esta guía te ayudará a transferir completamente el proyecto de Supabase desde la cuenta de Bolt a tu propia cuenta personal.

---

## 📋 Paso 1: Crear Nuevo Proyecto en Supabase

1. **Accede a Supabase Dashboard:**
   - Ve a: https://supabase.com/dashboard
   - Inicia sesión con tu cuenta de **GitHub** (recomendado)

2. **Crear Nuevo Proyecto:**
   - Clic en **"New Project"**
   - Completa los datos:
     - **Name:** `terrenos-app` (o el nombre que prefieras)
     - **Database Password:** Genera una contraseña segura y **guárdala en un lugar seguro**
     - **Region:** Selecciona la región más cercana a tus usuarios (ej: `South America (São Paulo)`)
     - **Plan:** Selecciona `Free` (o el plan que prefieras)

3. **Espera a que se complete:**
   - Toma aproximadamente **1-2 minutos**
   - Verás una barra de progreso
   - Cuando esté listo, verás el dashboard del proyecto

---

## 📦 Paso 2: Aplicar Estructura de Base de Datos

1. **Abre el SQL Editor:**
   - En el menú lateral izquierdo, ve a **SQL Editor**
   - Clic en **"New query"**

2. **Ejecutar Script de Migración:**
   - Abre el archivo **`MIGRACION_COMPLETA.sql`** de este proyecto
   - **Copia TODO el contenido** del archivo
   - Pégalo en el SQL Editor de tu nuevo proyecto
   - Clic en **"Run"** (o presiona `Ctrl+Enter` / `Cmd+Enter`)

3. **Verificar que no hubo errores:**
   - Deberías ver un mensaje de éxito
   - Si hay errores, revisa el mensaje y corrígelo (no debería haber errores)

---

## 💾 Paso 3: Exportar Datos del Proyecto Actual

1. **Accede al proyecto ACTUAL de Bolt:**
   - Ve a: https://supabase.com/dashboard/project/zcdqcvarguctnvorwlgx
   - Abre el **SQL Editor**

2. **Ejecutar Script de Exportación:**
   - Abre el archivo **`EXPORTAR_DATOS.sql`** de este proyecto
   - **Ejecuta cada consulta POR SEPARADO** (están numeradas del 1 al 8)
   - Para cada consulta:
     - Copia la consulta
     - Pégala en el SQL Editor
     - Clic en "Run"
     - Clic en **"Download CSV"** o copia los resultados
     - Guarda el archivo CSV con un nombre descriptivo (ej: `slides.csv`, `terrenos.csv`, etc.)

3. **Consultas importantes a exportar:**
   - ✅ Slides (carrusel)
   - ✅ Terrenos (propiedades)
   - ✅ Nosotros (sobre nosotros)
   - ✅ Configuración (logo, contacto, etc.)
   - ✅ Trabaje con Nosotros (aplicaciones de empleo)
   - ✅ Compra/Venta Propiedades (solicitudes de contacto)
   - ⚠️ System Logs (opcional - solo si quieres conservar el historial)

---

## 📥 Paso 4: Importar Datos al Nuevo Proyecto

### Opción A: Importar usando Table Editor (Recomendado - Más Fácil)

1. **Ir a Table Editor:**
   - En tu nuevo proyecto, ve a **Table Editor** en el menú lateral
   - Selecciona la tabla donde quieres importar datos (ej: `slides`)

2. **Importar CSV:**
   - Clic en **"Insert"** → **"Import data from CSV"**
   - Selecciona el archivo CSV correspondiente
   - Mapea las columnas correctamente
   - Clic en **"Import"**

3. **Repetir para cada tabla:**
   - Repite el proceso para todas las tablas que exportaste

### Opción B: Importar usando SQL (Más Rápido para Grandes Volúmenes)

Si tienes muchos datos, puedes crear scripts SQL de INSERT. Ejemplo:

```sql
-- Ejemplo de importación manual (ajusta los valores según tus datos)
INSERT INTO slides (titulo, subtitulo, imagen_url, link_opcional, orden, activo)
VALUES
  ('Título 1', 'Subtítulo 1', 'https://...', NULL, 1, true),
  ('Título 2', 'Subtítulo 2', 'https://...', NULL, 2, true);
```

---

## 🔑 Paso 5: Obtener las Nuevas Credenciales

1. **Ir a Project Settings:**
   - En tu nuevo proyecto, ve a **Settings** → **API**

2. **Copiar las credenciales:**
   - **Project URL:** `https://tu-proyecto.supabase.co`
   - **anon public key:** Una clave larga que empieza con `eyJ...`

3. **Guardar estas credenciales** (las usarás en el siguiente paso)

---

## ⚙️ Paso 6: Actualizar Variables de Entorno

### En tu Entorno Local:

1. **Abre el archivo `.env` en la raíz del proyecto**

2. **Reemplaza las siguientes líneas:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_NUEVO_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_NUEVA_ANON_KEY_AQUI
```

3. **Guarda el archivo**

### En Vercel (si estás usando Vercel):

1. **Ve a tu proyecto en Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Ir a Settings:**
   - Clic en tu proyecto
   - Ve a **Settings** → **Environment Variables**

3. **Actualizar las variables:**
   - Busca `NEXT_PUBLIC_SUPABASE_URL` y actualiza su valor
   - Busca `NEXT_PUBLIC_SUPABASE_ANON_KEY` y actualiza su valor
   - Clic en **"Save"**

4. **Redesplegar:**
   - Ve a **Deployments**
   - Clic en los tres puntos del último deployment
   - Selecciona **"Redeploy"**
   - ✅ Marca la opción **"Use existing Build Cache"** (opcional, pero más rápido)
   - Clic en **"Redeploy"**

### En Netlify (si estás usando Netlify):

1. **Ve a tu proyecto en Netlify Dashboard:**
   - https://app.netlify.com

2. **Ir a Site Settings:**
   - Clic en tu sitio
   - Ve a **Site settings** → **Environment variables**

3. **Actualizar las variables:**
   - Busca `NEXT_PUBLIC_SUPABASE_URL` y edita su valor
   - Busca `NEXT_PUBLIC_SUPABASE_ANON_KEY` y edita su valor
   - Clic en **"Save"**

4. **Redesplegar:**
   - Ve a **Deploys**
   - Clic en **"Trigger deploy"** → **"Deploy site"**

---

## 🔐 Paso 7: Migrar Usuarios de Autenticación (IMPORTANTE)

⚠️ **Este paso es crítico si ya tienes usuarios registrados.**

### Si ya tienes usuarios admin registrados:

1. **Exportar usuarios del proyecto actual:**
   - Ve al proyecto actual de Bolt
   - SQL Editor → ejecuta:
   ```sql
   SELECT
     email,
     encrypted_password,
     email_confirmed_at,
     created_at,
     raw_user_meta_data
   FROM auth.users;
   ```
   - Guarda los resultados

2. **Importar usuarios al nuevo proyecto:**
   - En tu nuevo proyecto, ve a **Authentication** → **Users**
   - Para cada usuario, clic en **"Add user"** → **"Create new user"**
   - Ingresa el email
   - Genera una contraseña temporal
   - **IMPORTANTE:** Envía la contraseña al usuario o usa la función de "reset password"

### Si NO tienes usuarios todavía:

- Simplemente crea tu usuario admin en el nuevo proyecto
- Ve a **Authentication** → **Users** → **"Add user"**
- Ingresa tu email y contraseña

---

## 📸 Paso 8: Migrar Imágenes del Storage (Si Aplica)

Si tienes imágenes almacenadas en Supabase Storage:

### Opción A: Re-subir manualmente (Recomendado para pocas imágenes)

1. **Descargar imágenes del bucket actual:**
   - Ve al proyecto actual → **Storage** → **images**
   - Descarga todas las imágenes

2. **Subir al nuevo bucket:**
   - Ve al nuevo proyecto → **Storage** → **images**
   - Arrastra y suelta las imágenes

### Opción B: Script automatizado (Para muchas imágenes)

Si tienes muchas imágenes, puedo crear un script para automatizar la migración. Dime si necesitas esto.

---

## ✅ Paso 9: Verificar que Todo Funciona

### Pruebas Locales:

1. **Reiniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Probar funcionalidades:**
   - ✅ Ver el carrusel de la página principal
   - ✅ Ver el catálogo de terrenos
   - ✅ Iniciar sesión en el admin
   - ✅ Crear/editar/eliminar slides
   - ✅ Crear/editar/eliminar terrenos
   - ✅ Subir imágenes

### Pruebas en Producción:

1. **Accede a tu sitio desplegado**
2. **Verifica las mismas funcionalidades:**
   - Página principal
   - Catálogo
   - Login de admin
   - CRUD de contenido

---

## 🚨 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que copiaste correctamente las credenciales
- Asegúrate de que no haya espacios extra al principio o final
- Reinicia el servidor de desarrollo

### Error: "Row Level Security policy violation"
- Verifica que ejecutaste TODO el script `MIGRACION_COMPLETA.sql`
- Verifica que las políticas RLS se crearon correctamente

### Error: "Bucket not found"
- Verifica que el bucket `images` se creó correctamente
- Ve a Storage en el dashboard y verifica que existe

### Los datos no aparecen:
- Verifica que importaste los datos correctamente
- Ejecuta `SELECT * FROM tabla_nombre` en el SQL Editor para verificar

---

## 📞 ¿Necesitas Ayuda?

Si encuentras algún problema durante la migración:

1. **Verifica los logs:**
   - Console del navegador (F12)
   - Logs de Vercel/Netlify

2. **Revisa la documentación de Supabase:**
   - https://supabase.com/docs

3. **Pide ayuda aquí:**
   - Describe el error que estás viendo
   - Incluye el mensaje de error completo

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu base de datos estará **completamente bajo tu control** en tu propia cuenta de Supabase.

El proyecto ya no dependerá de Bolt y tendrás:
- ✅ Control total de la base de datos
- ✅ Backup de todos tus datos
- ✅ Acceso completo al dashboard de Supabase
- ✅ Capacidad de escalar según tus necesidades

---

## 📝 Notas Finales

- **Backup:** Siempre haz backups regulares de tu base de datos
- **Monitoreo:** Configura alertas en Supabase para monitorear el uso
- **Seguridad:** Revisa las políticas RLS periódicamente
- **Costos:** Monitorea tu uso para evitar sorpresas en la facturación

¡Éxito con tu migración! 🚀
