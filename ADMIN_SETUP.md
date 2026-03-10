# Configuración del Usuario Administrador

## Crear Usuario Admin

Para usar el panel de administración, primero necesitas crear el usuario administrador en Supabase Auth.

### Opción 1: Desde el Dashboard de Supabase (Más fácil)

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Authentication** > **Users**
4. Haz clic en **"Add user"** > **"Create new user"**
5. Completa el formulario:
   - **Email**: `admin@fortunna.com`
   - **Password**: `admin`
   - **Auto Confirm User**: ✓ (marca esta opción)
6. Haz clic en **"Create user"**

### Opción 2: Usando cURL

```bash
curl -X POST 'https://zcdqcvarguctnvorwlgx.supabase.co/auth/v1/signup' \
-H "apikey: YOUR_ANON_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@fortunna.com",
  "password": "admin"
}'
```

## Acceder al Panel de Administración

Una vez creado el usuario, puedes acceder al panel:

1. Inicia la aplicación: `npm run dev`
2. Ve a: http://localhost:3000/admin
3. Serás redirigido a la página de login
4. Ingresa las credenciales:
   - **Email**: admin@fortunna.com
   - **Password**: admin
5. Haz clic en **"Iniciar Sesión"**

## Funcionalidades del Panel

### Gestión de Slides
- Crear, editar y eliminar slides del banner principal
- Definir el orden de visualización
- Activar/desactivar slides
- Agregar enlaces opcionales

### Gestión de Terrenos
- Crear, editar y eliminar terrenos
- Administrar múltiples imágenes por terreno
- Marcar terrenos como destacados
- Cambiar estado (disponible/vendido)
- El slug se genera automáticamente del nombre

## Seguridad

⚠️ **IMPORTANTE**:
- La contraseña predeterminada `admin` es solo para desarrollo
- **CAMBIA** esta contraseña inmediatamente en producción
- Para cambiar la contraseña:
  1. Ve al dashboard de Supabase
  2. Authentication > Users
  3. Haz clic en el usuario admin
  4. Click en "Reset Password"

## Estructura de Datos

### Slides
- titulo: Texto principal
- subtitulo: Texto secundario (opcional)
- imagen_url: URL de la imagen
- link_opcional: URL de destino (opcional)
- orden: Número de orden (1, 2, 3...)
- activo: true/false

### Terrenos
- nombre: Nombre del terreno
- slug: URL amigable (auto-generado)
- ubicacion: Ubicación del terreno
- precio: Precio en números
- superficie_m2: Superficie en m²
- estado: "disponible" o "vendido"
- descripcion: Descripción completa
- imagenes: Array de URLs (una por línea)
- destacado: true/false para mostrar en homepage

## URLs de Imágenes Recomendadas

- **Pexels**: https://www.pexels.com/
- **Unsplash**: https://unsplash.com/
- **Pixabay**: https://pixabay.com/

Usa la URL directa de la imagen (debe terminar en .jpg, .png, etc.)
