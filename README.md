# FORTUNNA INMOBILIARIA

Aplicación web profesional para inmobiliaria con gestión de contenido dinámico.

## Características

- 🎨 Diseño profesional con colores corporativos (Rojo #ED1C24 y Dorado #E7B42D)
- 🏠 Catálogo dinámico de terrenos con filtros avanzados
- 📱 Diseño responsive (mobile, tablet, desktop)
- 🖼️ Slider automático en homepage (autoplay 5s)
- 💬 Integración con WhatsApp para contacto directo
- 📧 Formulario de contacto funcional
- 🔐 Panel de administración con Supabase
- ⚡ Alto rendimiento con Next.js 14 y App Router

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: TailwindCSS con shadcn/ui
- **Backend/CMS**: Supabase (PostgreSQL)
- **Imágenes**: URLs públicas (Pexels, Unsplash, etc.)

## Estructura del Proyecto

```
fortunna-inmobiliaria/
├── app/
│   ├── page.tsx                 # Homepage con slider y destacados
│   ├── catalogo/page.tsx        # Catálogo con filtros
│   ├── terreno/[slug]/page.tsx  # Detalle de terreno
│   ├── contacto/page.tsx        # Formulario de contacto
│   ├── admin/page.tsx           # Instrucciones de administración
│   └── layout.tsx               # Layout principal con Header/Footer
├── components/
│   ├── Header.tsx               # Navegación principal
│   ├── Footer.tsx               # Pie de página
│   ├── HeroSlider.tsx           # Slider automático
│   ├── PropertyCard.tsx         # Tarjeta de terreno
│   └── WhatsAppButton.tsx       # Botón de WhatsApp
├── lib/
│   └── supabase.ts              # Cliente y funciones de Supabase
└── .env                         # Variables de entorno
```

## Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd fortunna-inmobiliaria
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Las variables ya están configuradas en `.env`:

```
NEXT_PUBLIC_SUPABASE_URL=https://zcdqcvarguctnvorwlgx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
```

### 4. Base de datos (Supabase)

La base de datos ya está configurada con:

#### Tabla: `slides`
- `id` (uuid, PK)
- `titulo` (text)
- `subtitulo` (text)
- `imagen_url` (text)
- `link_opcional` (text)
- `orden` (integer)
- `activo` (boolean)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### Tabla: `terrenos`
- `id` (uuid, PK)
- `nombre` (text)
- `slug` (text, unique)
- `ubicacion` (text)
- `precio` (numeric)
- `superficie_m2` (numeric)
- `estado` (text: 'disponible' | 'vendido')
- `descripcion` (text)
- `imagenes` (jsonb: array de URLs)
- `destacado` (boolean)
- `fecha_publicacion` (timestamptz)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

La base de datos incluye datos de ejemplo.

## Uso

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

### Build de Producción

```bash
npm run build
npm start
```

## Administración de Contenido

### Acceso al Panel de Supabase

1. Visita https://supabase.com/dashboard
2. Inicia sesión con tus credenciales
3. Selecciona tu proyecto
4. Ve a "Table Editor"

### Agregar un Slide

1. Ve a la tabla `slides`
2. Click en "Insert row"
3. Completa los campos:
   - **titulo**: Texto principal del slide
   - **subtitulo**: Texto secundario (opcional)
   - **imagen_url**: URL de imagen (recomendado: Pexels, Unsplash)
   - **orden**: Número para ordenar (1, 2, 3...)
   - **activo**: true para mostrar, false para ocultar
   - **link_opcional**: URL personalizada (opcional)

### Agregar un Terreno

1. Ve a la tabla `terrenos`
2. Click en "Insert row"
3. Completa los campos:
   - **nombre**: Nombre del terreno
   - **slug**: URL-friendly (ej: terreno-valle-alto)
   - **ubicacion**: Ubicación del terreno
   - **precio**: Precio en números (ej: 250000)
   - **superficie_m2**: Superficie en m² (ej: 500)
   - **estado**: "disponible" o "vendido"
   - **descripcion**: Descripción completa
   - **imagenes**: Array JSON de URLs: `["url1", "url2"]`
   - **destacado**: true para mostrar en homepage

### Formato de Imágenes (JSON)

Para agregar múltiples imágenes a un terreno, usa formato JSON:

```json
[
  "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
  "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg"
]
```

## Funcionalidades Principales

### 1. Homepage (/)
- Slider dinámico con autoplay de 5 segundos
- Sección de beneficios
- Terrenos destacados
- Call-to-action para WhatsApp

### 2. Catálogo (/catalogo)
- Grid de todos los terrenos
- Filtros por:
  - Estado (disponible/vendido)
  - Ubicación (búsqueda)
  - Rango de precio
- Diseño responsive

### 3. Detalle de Terreno (/terreno/[slug])
- Galería de imágenes con navegación
- Información completa del terreno
- Botón de WhatsApp con mensaje prellenado
- Link de regreso al catálogo

### 4. Contacto (/contacto)
- Formulario de contacto
- Información de contacto
- Botón de WhatsApp

### 5. Admin (/admin)
- Instrucciones de administración
- Links al panel de Supabase
- Guías de uso

## Integración WhatsApp

El botón de WhatsApp genera mensajes prellenados:

```typescript
// En detalle de terreno:
"Hola, estoy interesado en el terreno {nombre} ubicado en {ubicacion}. ¿Podrían darme más información?"

// En homepage/contacto:
"Hola, estoy interesado en conocer más sobre los terrenos disponibles en Fortunna Inmobiliaria"
```

Número de WhatsApp configurado: +52 123 456 7890
(Editable en `components/WhatsAppButton.tsx`)

## Personalización

### Colores Corporativos

Los colores están configurados en `tailwind.config.ts`:

```typescript
colors: {
  'fortunna-red': '#ED1C24',
  'fortunna-gold': '#E7B42D',
}
```

Uso en componentes:
```tsx
className="bg-fortunna-red text-white"
className="text-fortunna-gold"
```

### Información de Contacto

Actualiza la información en `components/Footer.tsx`:
- Dirección
- Teléfonos
- Emails
- Redes sociales

## Tecnologías Utilizadas

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **TailwindCSS**: Framework CSS utility-first
- **shadcn/ui**: Componentes UI accesibles
- **Supabase**: Backend as a Service
- **Lucide React**: Iconos
- **PostgreSQL**: Base de datos relacional

## Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Políticas de acceso público para lectura
- Políticas autenticadas para escritura
- Variables de entorno para credenciales

## Soporte

Para soporte técnico o consultas:
- Email: contacto@fortunna.com
- WhatsApp: +52 123 456 7890

## Licencia

© 2026 Fortunna Inmobiliaria. Todos los derechos reservados.

## Panel de Administración con Autenticación

### Características del Panel Admin

- Sistema de autenticación con Supabase Auth
- CRUD completo para slides y terrenos
- Interfaz intuitiva con pestañas
- Protección de rutas privadas
- Generación automática de slugs
- Vista previa de imágenes

### Acceso al Panel

1. **Crear usuario administrador** (primera vez):
   - Ve a https://supabase.com/dashboard
   - Authentication > Users > "Add user" > "Create new user"
   - Email: `admin@fortunna.com`
   - Password: `admin`
   - Marca "Auto Confirm User"
   - Ver archivo `ADMIN_SETUP.md` para más detalles

2. **Iniciar sesión**:
   - Ve a http://localhost:3000/admin
   - Ingresa email: `admin@fortunna.com`
   - Password: `admin`

### Rutas del Panel

- `/admin` - Redirige al login o dashboard según autenticación
- `/admin/login` - Página de inicio de sesión
- `/admin/dashboard` - Panel principal con CRUD (requiere autenticación)

### Gestión de Contenido desde el Panel

#### Slides
1. Ve a la pestaña "Slides del Banner"
2. Click en "Nuevo Slide"
3. Completa los campos:
   - Título (requerido)
   - Subtítulo (opcional)
   - URL de imagen (requerido)
   - Link opcional
   - Orden (número)
   - Activo (checkbox)
4. Click en "Guardar"

#### Terrenos
1. Ve a la pestaña "Terrenos"
2. Click en "Nuevo Terreno"
3. Completa los campos:
   - Nombre (se genera el slug automáticamente)
   - Ubicación
   - Precio
   - Superficie en m²
   - Estado (disponible/vendido)
   - Descripción
   - URLs de imágenes (una por línea)
   - Destacado (checkbox)
4. Click en "Guardar"

### Seguridad

- Todas las rutas del admin están protegidas con autenticación
- Solo usuarios autenticados pueden crear, editar o eliminar contenido
- Las contraseñas se almacenan de forma segura con bcrypt
- Tokens de sesión gestionados por Supabase Auth

**⚠️ IMPORTANTE**: Cambia la contraseña predeterminada en producción.

---

## 🔄 Migración a Tu Cuenta de Supabase

Si este proyecto fue creado con Bolt y quieres transferir la base de datos a tu propia cuenta de Supabase, tenemos todo preparado para ti.

### 📚 Guías de Migración Disponibles

El proyecto incluye documentación completa para migrar tu base de datos:

- **`LEEME_MIGRACION.txt`** - Inicio rápido y lista de archivos
- **`RESUMEN_MIGRACION.md`** - Checklist y tiempo estimado (15-30 min)
- **`GUIA_MIGRACION.md`** - Guía completa paso a paso ⭐ **EMPIEZA AQUÍ**

### 🛠️ Scripts SQL Incluidos

- **`MIGRACION_COMPLETA.sql`** - Crea toda la estructura en tu nuevo proyecto
- **`EXPORTAR_DATOS.sql`** - Exporta datos del proyecto actual
- **`VERIFICAR_MIGRACION.sql`** - Verifica que todo se migró correctamente

### ⚡ Inicio Rápido

1. Abre `LEEME_MIGRACION.txt` para ver el resumen
2. Lee `GUIA_MIGRACION.md` para instrucciones completas
3. Sigue los pasos (toma 15-30 minutos)
4. ¡Listo! Tu BD estará bajo tu control total

### ✅ Beneficios de Migrar

- Control total de tu base de datos
- No dependes de Bolt para la BD
- Puedes escalar según tus necesidades
- Dashboard completo de Supabase
- Backups y monitoreo en tiempo real

**¿Listo para migrar?** → Abre `GUIA_MIGRACION.md` y comienza.

