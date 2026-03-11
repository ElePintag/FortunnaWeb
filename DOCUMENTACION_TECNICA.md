# Documentación Técnica - Fortunna Inmobiliaria

## Índice

1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Base de Datos](#base-de-datos)
4. [Frontend](#frontend)
5. [Backend](#backend)
6. [Gestión de Imágenes](#gestión-de-imágenes)
7. [Seguridad](#seguridad)
8. [Despliegue](#despliegue)

---

## Arquitectura del Sistema

### Tipo de Arquitectura
**JAMstack (JavaScript, APIs, Markup)** con renderizado del lado del servidor (SSR) y generación estática (SSG).

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 13 (App Router) + React 18 + TypeScript           │
│  - Páginas estáticas y dinámicas                           │
│  - Componentes reutilizables                               │
│  - Gestión de estado con Context API                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ API Calls (REST)
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    SUPABASE (BaaS)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  PostgreSQL  │  │   Storage    │  │  Auth Service   │  │
│  │   Database   │  │   (Buckets)  │  │  (Email/Pass)   │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Row Level Security (RLS) Policies             │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario → Frontend**: Interacción con la interfaz web
2. **Frontend → Supabase**: Peticiones mediante cliente Supabase JS
3. **Supabase → PostgreSQL**: Consultas validadas por RLS
4. **PostgreSQL → Supabase → Frontend**: Respuesta con datos
5. **Frontend → Usuario**: Renderizado de la información

---

## Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Next.js** | 13.5.1 | Framework React con SSR/SSG |
| **React** | 18.2.0 | Librería de interfaz de usuario |
| **TypeScript** | 5.2.2 | Tipado estático |
| **Tailwind CSS** | 3.3.3 | Framework CSS utility-first |
| **Radix UI** | Varios | Componentes accesibles sin estilo |
| **Lucide React** | 0.446.0 | Iconos |
| **React Hook Form** | 7.53.0 | Gestión de formularios |
| **Zod** | 3.23.8 | Validación de esquemas |

### Backend / Base de Datos

| Tecnología | Propósito |
|-----------|-----------|
| **Supabase** | Backend as a Service (BaaS) |
| **PostgreSQL** | Base de datos relacional |
| **Row Level Security** | Políticas de seguridad a nivel de fila |
| **Supabase Storage** | Almacenamiento de archivos |
| **Supabase Auth** | Autenticación de usuarios |

### Herramientas de Desarrollo

- **npm** - Gestor de paquetes
- **ESLint** - Linter de código
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos

---

## Base de Datos

### Esquema de la Base de Datos

#### Tabla: `users`
**Propósito**: Extensión de usuarios autenticados con información adicional.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nombre TEXT,
  rol TEXT DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos**:
- `id`: Identificador único (referencia a auth.users)
- `email`: Correo electrónico
- `nombre`: Nombre del usuario
- `rol`: Rol del usuario (admin/user)
- `activo`: Estado del usuario
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

---

#### Tabla: `slides`
**Propósito**: Imágenes del carrusel de la página principal.

```sql
CREATE TABLE slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT,
  subtitulo TEXT,
  imagen_url TEXT NOT NULL,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos**:
- `id`: Identificador único
- `titulo`: Título del slide
- `subtitulo`: Subtítulo del slide
- `imagen_url`: URL de la imagen
- `orden`: Orden de visualización
- `activo`: Si el slide está activo
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización

---

#### Tabla: `terrenos`
**Propósito**: Propiedades (terrenos y casas) disponibles.

```sql
CREATE TABLE terrenos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(15,2) NOT NULL,
  ubicacion TEXT NOT NULL,
  area DECIMAL(10,2),
  tipo TEXT DEFAULT 'terreno' CHECK (tipo IN ('terreno', 'casa')),
  estado TEXT DEFAULT 'disponible' CHECK (estado IN ('disponible', 'vendido', 'apartado')),
  destacado BOOLEAN DEFAULT false,
  imagen_principal TEXT,
  imagenes_adicionales TEXT[],
  slug TEXT UNIQUE NOT NULL,
  caracteristicas JSONB DEFAULT '{}',
  visible BOOLEAN DEFAULT true,
  fecha_publicacion TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Campos principales**:
- `id`: Identificador único
- `titulo`: Título de la propiedad
- `descripcion`: Descripción detallada
- `precio`: Precio en formato decimal
- `ubicacion`: Ubicación de la propiedad
- `area`: Área en m²
- `tipo`: Tipo (terreno/casa)
- `estado`: Estado (disponible/vendido/apartado)
- `destacado`: Si aparece en destacados
- `imagen_principal`: URL imagen principal
- `imagenes_adicionales`: Array de URLs
- `slug`: URL amigable única
- `caracteristicas`: JSON con características adicionales
- `visible`: Si es visible públicamente

---

#### Tabla: `nosotros`
**Propósito**: Contenido de la página "Nosotros".

```sql
CREATE TABLE nosotros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  imagen_url TEXT,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### Tabla: `configuracion`
**Propósito**: Configuración general del sitio.

```sql
CREATE TABLE configuracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT DEFAULT 'text' CHECK (tipo IN ('text', 'number', 'boolean', 'json')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Claves comunes**:
- `whatsapp_numero`: Número de WhatsApp
- `email_contacto`: Email de contacto
- `direccion`: Dirección física
- `telefono`: Teléfono de contacto
- `facebook_url`: URL de Facebook
- `instagram_url`: URL de Instagram

---

#### Tabla: `compra_venta_propiedades`
**Propósito**: Solicitudes de compra/venta de propiedades.

```sql
CREATE TABLE compra_venta_propiedades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_operacion TEXT NOT NULL CHECK (tipo_operacion IN ('compra', 'venta')),
  tipo_propiedad TEXT NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  ubicacion TEXT,
  precio_aproximado DECIMAL(15,2),
  descripcion TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado', 'cancelado')),
  notas_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### Tabla: `trabaje_con_nosotros`
**Propósito**: Solicitudes de empleo.

```sql
CREATE TABLE trabaje_con_nosotros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  puesto_interes TEXT NOT NULL,
  experiencia TEXT,
  mensaje TEXT,
  cv_url TEXT,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'revisado', 'contactado', 'rechazado')),
  notas_admin TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

#### Tabla: `logs`
**Propósito**: Registro de auditoría de acciones administrativas.

```sql
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accion TEXT NOT NULL,
  tabla TEXT,
  registro_id TEXT,
  detalles JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con las siguientes políticas:

#### Políticas Públicas (Lectura sin autenticación)
- `slides`: Lectura pública de slides activos
- `terrenos`: Lectura pública de propiedades visibles
- `nosotros`: Lectura pública
- `configuracion`: Lectura pública

#### Políticas de Administrador (Solo admin autenticado)
- Todas las operaciones de INSERT, UPDATE, DELETE requieren rol 'admin'
- Validación mediante función: `(auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin'`

#### Políticas de Usuarios Autenticados
- `users`: Los usuarios pueden leer su propia información
- `compra_venta_propiedades`: Inserción pública, administración solo admin
- `trabaje_con_nosotros`: Inserción pública, administración solo admin

---

### Índices

```sql
-- Índices para optimización de consultas
CREATE INDEX idx_terrenos_destacado ON terrenos(destacado) WHERE visible = true;
CREATE INDEX idx_terrenos_slug ON terrenos(slug);
CREATE INDEX idx_terrenos_tipo ON terrenos(tipo) WHERE visible = true;
CREATE INDEX idx_slides_orden ON slides(orden) WHERE activo = true;
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);
```

---

## Frontend

### Estructura de Carpetas

```
/
├── app/                          # App Router de Next.js
│   ├── admin/                    # Área administrativa
│   │   ├── dashboard/
│   │   │   └── page.tsx         # Panel principal admin
│   │   ├── login/
│   │   │   └── page.tsx         # Login de admin
│   │   └── page.tsx             # Redirección admin
│   ├── catalogo/
│   │   └── page.tsx             # Catálogo de propiedades
│   ├── contacto/
│   │   └── page.tsx             # Página de contacto
│   ├── nosotros/
│   │   └── page.tsx             # Sobre nosotros
│   ├── terreno/
│   │   └── [slug]/
│   │       └── page.tsx         # Detalle de propiedad
│   ├── trabaje-con-nosotros/
│   │   └── page.tsx             # Bolsa de trabajo
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   └── globals.css              # Estilos globales
│
├── components/                   # Componentes React
│   ├── admin/                   # Componentes administrativos
│   │   ├── CompraVentaManager.tsx
│   │   ├── ConfiguracionManager.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── LogsManager.tsx
│   │   ├── MultipleImageUploader.tsx
│   │   ├── NosotrosManager.tsx
│   │   ├── SlidesManager.tsx
│   │   ├── TerrenosManager.tsx
│   │   ├── TrabajeConNosotrosManager.tsx
│   │   └── UsersManager.tsx
│   ├── ui/                      # Componentes UI (Radix UI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── ... (50+ componentes)
│   ├── ClientLayout.tsx         # Layout del lado del cliente
│   ├── Footer.tsx               # Pie de página
│   ├── Header.tsx               # Encabezado
│   ├── HeroSlider.tsx           # Carrusel principal
│   ├── PropertyCard.tsx         # Tarjeta de propiedad
│   └── WhatsAppButton.tsx       # Botón de WhatsApp
│
├── contexts/                     # Context API
│   └── AuthContext.tsx          # Contexto de autenticación
│
├── hooks/                        # Custom Hooks
│   └── use-toast.ts             # Hook para notificaciones
│
├── lib/                          # Librerías y utilidades
│   ├── supabase.ts              # Cliente Supabase + funciones
│   └── utils.ts                 # Utilidades generales
│
└── supabase/                     # Configuración Supabase
    └── migrations/              # Migraciones SQL
```

---

### Páginas Principales

#### 1. **Página de Inicio** (`app/page.tsx`)
- Carrusel de imágenes (slides)
- Sección de características
- Casas y terrenos destacados
- Call to action con WhatsApp

#### 2. **Catálogo** (`app/catalogo/page.tsx`)
- Listado completo de propiedades
- Filtros por tipo, precio, ubicación
- Búsqueda por texto
- Paginación

#### 3. **Detalle de Propiedad** (`app/terreno/[slug]/page.tsx`)
- Información completa
- Galería de imágenes
- Características
- Botón de WhatsApp personalizado

#### 4. **Administración** (`app/admin/dashboard/page.tsx`)
- Panel con pestañas para:
  - Gestión de slides
  - Gestión de propiedades
  - Solicitudes de compra/venta
  - Solicitudes de empleo
  - Configuración del sitio
  - Página "Nosotros"
  - Gestión de usuarios
  - Logs de auditoría

---

### Componentes Clave

#### `ClientLayout.tsx`
**Propósito**: Proveedor del contexto de autenticación.

```typescript
'use client';
import { AuthProvider } from '@/contexts/AuthContext';

export default function ClientLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

#### `AuthContext.tsx`
**Propósito**: Gestión del estado de autenticación global.

**Funciones**:
- `signIn(email, password)`: Iniciar sesión
- `signOut()`: Cerrar sesión
- `user`: Usuario actual
- `isAdmin`: Verificación de rol admin
- `loading`: Estado de carga

#### Managers Administrativos
Cada manager es un componente completo que incluye:
- Listado de registros
- Formularios de creación/edición
- Subida de imágenes
- Validación con React Hook Form + Zod
- Feedback visual con toast notifications

---

### Enrutamiento

Next.js 13 App Router con:
- **Rutas estáticas**: Pre-renderizadas en build
- **Rutas dinámicas**: `[slug]` para detalles de propiedades
- **Rutas protegidas**: Middleware para admin

#### `middleware.ts`
Protege rutas `/admin/*` verificando:
1. Sesión activa
2. Rol de administrador
3. Redirección a login si no cumple

---

### Estilos

#### Tailwind CSS
Configuración personalizada con:

```javascript
// tailwind.config.ts
colors: {
  'fortunna-red': '#C8102E',
  'fortunna-gold': '#B8860B'
}
```

#### Paleta de Colores
- **Rojo principal**: `#C8102E` (fortunna-red)
- **Dorado**: `#B8860B` (fortunna-gold)
- **Grises**: Escala de Tailwind (50-950)

---

## Backend

### Supabase como Backend

#### Características Utilizadas

1. **Database (PostgreSQL)**
   - Almacenamiento de datos
   - Relaciones entre tablas
   - Índices para rendimiento
   - Triggers y funciones

2. **Authentication**
   - Email/Password authentication
   - JWT tokens
   - Metadata personalizada (rol en app_metadata)

3. **Storage**
   - Bucket: `propiedades-images`
   - Políticas de acceso público para lectura
   - Políticas de admin para escritura

4. **Row Level Security**
   - Políticas a nivel de fila
   - Validación automática en cada query
   - Seguridad integrada

---

### Cliente Supabase

**Archivo**: `lib/supabase.ts`

#### Inicialización

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Funciones Principales

##### `getSlides()`
Obtiene slides activos ordenados.

```typescript
export async function getSlides() {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true });

  if (error) throw error;
  return data || [];
}
```

##### `getTerrenosFeatured()`
Obtiene propiedades destacadas.

```typescript
export async function getTerrenosFeatured() {
  const { data, error } = await supabase
    .from('terrenos')
    .select('*')
    .eq('destacado', true)
    .eq('visible', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data || [];
}
```

##### `getTerrenoBySlug(slug)`
Obtiene una propiedad por su slug.

##### `uploadImage(file, bucket, folder)`
Sube una imagen al storage.

```typescript
export async function uploadImage(
  file: File,
  bucket: string = 'propiedades-images',
  folder: string = ''
) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
```

---

### API Routes Implícitas

Next.js genera automáticamente endpoints para:
- Server Components que hacen fetch de datos
- Server Actions para mutaciones

No hay API Routes explícitas, todo se maneja mediante:
- `async/await` en Server Components
- Supabase client en Client Components

---

## Gestión de Imágenes

### Storage Bucket

**Nombre**: `propiedades-images`

#### Estructura de Carpetas

```
propiedades-images/
├── slides/              # Imágenes del carrusel
├── terrenos/            # Imágenes de propiedades
│   ├── principales/     # Imágenes principales
│   └── adicionales/     # Galería adicional
└── nosotros/            # Imágenes de "Nosotros"
```

---

### Tamaños Recomendados de Imágenes

#### Slides del Carrusel Principal
- **Tamaño recomendado**: 1920x1080px (Full HD)
- **Aspecto**: 16:9
- **Peso máximo**: 500KB
- **Formato**: JPG (optimizado) o WebP
- **Uso**: Banner principal de la página de inicio

**Mejores prácticas**:
- Optimizar antes de subir (usar TinyPNG, ImageOptim)
- Evitar texto pequeño (puede ser ilegible en móviles)
- Usar imágenes horizontales

---

#### Imagen Principal de Propiedad
- **Tamaño recomendado**: 1200x800px
- **Aspecto**: 3:2
- **Peso máximo**: 300KB
- **Formato**: JPG o WebP
- **Uso**: Tarjeta en catálogo y encabezado en detalle

**Mejores prácticas**:
- Mostrar la mejor vista de la propiedad
- Buena iluminación
- Sin marcas de agua grandes

---

#### Imágenes Adicionales (Galería)
- **Tamaño recomendado**: 1200x800px
- **Aspecto**: 3:2 o 4:3
- **Peso máximo**: 250KB cada una
- **Formato**: JPG o WebP
- **Cantidad**: 3-10 imágenes
- **Uso**: Galería en la página de detalle

**Mejores prácticas**:
- Mostrar diferentes ángulos
- Incluir áreas importantes
- Mantener coherencia visual

---

#### Imágenes de "Nosotros"
- **Tamaño recomendado**: 800x600px
- **Aspecto**: 4:3
- **Peso máximo**: 200KB
- **Formato**: JPG o WebP
- **Uso**: Sección "Nosotros"

---

### Proceso de Subida de Imágenes

#### En el Admin Panel

1. **Componente `ImageUploader`** (imagen única):
   ```
   - Usuario selecciona archivo
   - Validación de tipo (jpg, png, webp, gif)
   - Validación de tamaño (máx 5MB)
   - Subida a Supabase Storage
   - Retorna URL pública
   - Muestra preview
   ```

2. **Componente `MultipleImageUploader`** (múltiples):
   ```
   - Usuario selecciona múltiples archivos
   - Validación individual
   - Subida en paralelo
   - Retorna array de URLs
   - Muestra grid de previews
   - Permite reordenar y eliminar
   ```

#### Código de Subida

```typescript
// Subida individual
const url = await uploadImage(file, 'propiedades-images', 'terrenos/principales');

// Subida múltiple
const urls = await Promise.all(
  files.map(file => uploadImage(file, 'propiedades-images', 'terrenos/adicionales'))
);
```

---

### Optimización de Imágenes

#### Herramientas Recomendadas

1. **TinyPNG** (https://tinypng.com)
   - Compresión con pérdida mínima
   - Reduce hasta 70% del tamaño
   - Mantiene calidad visual

2. **Squoosh** (https://squoosh.app)
   - Herramienta de Google
   - Conversión a WebP
   - Comparación lado a lado

3. **ImageOptim** (Mac)
   - Aplicación nativa
   - Batch processing
   - Lossless y lossy

---

### Política de Almacenamiento

#### Políticas de Storage (RLS)

**Lectura Pública**:
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'propiedades-images');
```

**Escritura Admin**:
```sql
CREATE POLICY "Admin write access"
ON storage.objects FOR INSERT
TO authenticated
USING (
  bucket_id = 'propiedades-images' AND
  (auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin'
);
```

---

## Seguridad

### Autenticación

#### Sistema
Supabase Auth con email/password.

#### Flujo de Login
1. Usuario ingresa email y password
2. Llamada a `supabase.auth.signInWithPassword()`
3. Supabase valida credenciales
4. Retorna JWT con metadata
5. JWT incluye `app_metadata.rol`
6. Frontend verifica rol para acceso admin

#### Metadata del Usuario

```typescript
// Estructura del JWT
{
  sub: "user-uuid",
  email: "admin@fortunna.com",
  app_metadata: {
    rol: "admin"  // Establecido manualmente en DB
  },
  user_metadata: {
    nombre: "Administrador"
  }
}
```

---

### Row Level Security (RLS)

#### Verificación de Admin

Función SQL reutilizable:

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() -> 'app_metadata' ->> 'rol' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

Uso en políticas:

```sql
CREATE POLICY "Admin can update terrenos"
ON terrenos FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
```

---

### Protección de Rutas

#### Middleware

**Archivo**: `middleware.ts`

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Proteger rutas /admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Verificar rol admin
    const isAdmin = session.user.app_metadata?.rol === 'admin';
    if (!isAdmin && req.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return res;
}
```

---

### Variables de Entorno

#### Públicas (Next.js)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_WHATSAPP_NUMBER=+521234567890
```

#### Privadas (Supabase)
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Solo para operaciones privilegiadas
```

**Nota**: Las variables con prefijo `NEXT_PUBLIC_` están disponibles en el navegador. NUNCA colocar secrets ahí.

---

### Mejores Prácticas Implementadas

1. **SQL Injection**: Prevenido por Supabase (queries parametrizadas)
2. **XSS**: React escapa automáticamente el output
3. **CSRF**: Tokens JWT en headers, no cookies
4. **RLS**: Cada query validada contra políticas
5. **Validación**: Zod schemas en formularios
6. **Sanitización**: Input validado antes de guardar
7. **Principio de menor privilegio**: Usuarios solo ven sus datos
8. **Auditoría**: Tabla `logs` registra acciones admin

---

## Despliegue

### Plataformas Recomendadas

#### 1. **Vercel** (Recomendado)
- Despliegue automático desde Git
- Optimizado para Next.js
- Edge Functions
- CDN global

**Pasos**:
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Deploy automático en cada push

#### 2. **Netlify**
- Similar a Vercel
- Archivo `netlify.toml` incluido
- Build automático

---

### Configuración de Build

**Comando de build**:
```bash
npm run build
```

**Comando de start**:
```bash
npm run start
```

**Node.js version**: 18.x o superior

---

### Variables de Entorno en Producción

En Vercel/Netlify, configurar:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_WHATSAPP_NUMBER=+521234567890
```

---

### Performance

#### Optimizaciones Implementadas

1. **Image Optimization**:
   - Next.js Image component
   - Lazy loading automático
   - Responsive images

2. **Code Splitting**:
   - Automático por Next.js
   - Dynamic imports donde necesario

3. **Caching**:
   - `revalidate: 60` en páginas estáticas
   - Cache de Supabase client

4. **Static Generation**:
   - Páginas pre-renderizadas en build
   - ISR (Incremental Static Regeneration)

---

### Monitoreo

#### Logs de Aplicación
- Tabla `logs` en base de datos
- Registra: usuario, acción, tabla, detalles, timestamp

#### Métricas Recomendadas
- Vercel Analytics (automático)
- Google Analytics (configurar)
- Supabase Dashboard (queries, storage)

---

## Mantenimiento

### Tareas Regulares

#### Diario
- Revisar solicitudes de compra/venta
- Revisar solicitudes de empleo
- Responder mensajes de WhatsApp

#### Semanal
- Actualizar propiedades destacadas
- Añadir nuevas propiedades
- Actualizar precios

#### Mensual
- Revisar logs de auditoría
- Limpiar imágenes no utilizadas
- Backup de base de datos (automático en Supabase)

---

### Actualizaciones

#### Dependencias
```bash
npm outdated          # Ver paquetes desactualizados
npm update            # Actualizar (menores y patches)
npm install pkg@latest  # Actualizar específico
```

#### Base de Datos
- Usar migraciones SQL en `supabase/migrations/`
- Nunca modificar directamente en producción
- Probar en desarrollo primero

---

## Solución de Problemas

### Problemas Comunes

#### 1. Imágenes no cargan
**Causa**: URL incorrecta o política de storage
**Solución**:
```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Recrear política si es necesario
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'propiedades-images');
```

#### 2. Usuario admin no puede acceder
**Causa**: Metadata `rol` no configurada
**Solución**:
```sql
-- Actualizar rol en auth.users
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"rol": "admin"}'::jsonb
WHERE email = 'admin@fortunna.com';
```

#### 3. RLS bloquea operaciones
**Causa**: Políticas demasiado restrictivas
**Solución**:
```sql
-- Verificar políticas de la tabla
SELECT * FROM pg_policies WHERE tablename = 'terrenos';

-- Deshabilitar RLS temporalmente para debug
ALTER TABLE terrenos DISABLE ROW LEVEL SECURITY;
-- ¡RECORDAR REACTIVAR!
ALTER TABLE terrenos ENABLE ROW LEVEL SECURITY;
```

#### 4. Build falla en producción
**Causa**: TypeScript errors o dependencias
**Solución**:
```bash
# Local
npm run typecheck
npm run build

# Si hay errores, revisar:
# - Importaciones faltantes
# - Tipos incorrectos
# - Variables de entorno
```

---

## Recursos Adicionales

### Documentación Oficial

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

### Comunidad

- **Stack Overflow**: Preguntas técnicas
- **GitHub Issues**: Reportar bugs de librerías
- **Discord de Supabase**: Soporte de la comunidad

---

## Glosario

- **SSR**: Server-Side Rendering (renderizado en servidor)
- **SSG**: Static Site Generation (generación estática)
- **ISR**: Incremental Static Regeneration
- **RLS**: Row Level Security (seguridad a nivel de fila)
- **JWT**: JSON Web Token (token de autenticación)
- **BaaS**: Backend as a Service
- **CRUD**: Create, Read, Update, Delete
- **ORM**: Object-Relational Mapping
- **CDN**: Content Delivery Network
- **UUID**: Universally Unique Identifier

---

## Información de Contacto para Soporte Técnico

Para soporte sobre este proyecto:

1. **Código**: Revisar este documento primero
2. **Base de Datos**: Consultar logs en Supabase Dashboard
3. **Despliegue**: Revisar logs en Vercel/Netlify
4. **Dudas**: Crear issue en el repositorio

---

**Versión del documento**: 1.0
**Última actualización**: Marzo 2026
**Autor**: Equipo de Desarrollo Fortunna Inmobiliaria
