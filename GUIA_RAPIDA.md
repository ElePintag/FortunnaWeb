# Guía Rápida - Fortunna Inmobiliaria

## Resumen Ejecutivo

### ¿Qué es este proyecto?

Sitio web completo para **Fortunna Inmobiliaria** con:
- Catálogo de propiedades (casas y terrenos)
- Sistema de administración completo
- Formularios de contacto
- Integración con WhatsApp
- Gestión de solicitudes de clientes

---

## Stack Tecnológico (Resumen)

```
Frontend:  Next.js 13 + React 18 + TypeScript + Tailwind CSS
Backend:   Supabase (PostgreSQL + Auth + Storage)
Hosting:   Vercel / Netlify (recomendado)
```

---

## Arquitectura en 3 Líneas

1. **Frontend**: Next.js renderiza páginas estáticas y dinámicas
2. **Backend**: Supabase maneja base de datos, autenticación y almacenamiento
3. **Seguridad**: Row Level Security (RLS) protege todos los datos

---

## Base de Datos (Tablas Principales)

| Tabla | Propósito | Campos Clave |
|-------|-----------|--------------|
| `users` | Usuarios administradores | email, rol, activo |
| `slides` | Carrusel de inicio | titulo, imagen_url, orden |
| `terrenos` | Propiedades (casas/terrenos) | titulo, precio, ubicacion, tipo, estado |
| `compra_venta_propiedades` | Solicitudes clientes | tipo_operacion, nombre, email, estado |
| `trabaje_con_nosotros` | Solicitudes empleo | nombre, email, puesto_interes, cv_url |
| `configuracion` | Config del sitio | clave, valor (whatsapp, email, redes) |
| `nosotros` | Página "Nosotros" | titulo, contenido, imagen_url |
| `logs` | Auditoría de acciones | user_id, accion, tabla, detalles |

---

## Estructura de Carpetas (Simplificada)

```
project/
├── app/                    # Páginas (Next.js App Router)
│   ├── admin/             # Panel de administración
│   ├── catalogo/          # Catálogo público
│   ├── contacto/          # Contacto
│   ├── nosotros/          # Sobre nosotros
│   ├── terreno/[slug]/    # Detalle de propiedad
│   └── page.tsx           # Página de inicio
│
├── components/            # Componentes React
│   ├── admin/            # Componentes del panel admin
│   └── ui/               # Componentes UI reutilizables
│
├── contexts/             # Context API (AuthContext)
├── lib/                  # Cliente Supabase + utilidades
└── supabase/migrations/  # Migraciones SQL
```

---

## Tamaños de Imágenes (Referencia Rápida)

| Tipo | Dimensiones | Peso Máx | Uso |
|------|-------------|----------|-----|
| **Slides** | 1920x1080px | 500KB | Carrusel principal |
| **Propiedad (principal)** | 1200x800px | 300KB | Tarjetas y encabezado |
| **Propiedad (galería)** | 1200x800px | 250KB | Galería detalle |
| **Nosotros** | 800x600px | 200KB | Sección nosotros |

**Herramientas de optimización**: TinyPNG.com, Squoosh.app

---

## Accesos Rápidos

### URLs del Sitio

```
Página Principal:  https://su-dominio.com
Catálogo:         https://su-dominio.com/catalogo
Admin Login:      https://su-dominio.com/admin/login
Admin Panel:      https://su-dominio.com/admin/dashboard
```

### Variables de Entorno (.env)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# WhatsApp (formato: +521234567890)
NEXT_PUBLIC_WHATSAPP_NUMBER=+52...
```

---

## Comandos Esenciales

```bash
# Desarrollo
npm install          # Instalar dependencias
npm run dev         # Servidor de desarrollo (http://localhost:3000)

# Producción
npm run build       # Compilar para producción
npm run start       # Servidor de producción

# Verificación
npm run typecheck   # Verificar tipos TypeScript
npm run lint        # Verificar código
```

---

## Roles y Permisos

### Usuario Admin
- ✅ Acceso completo al panel
- ✅ Crear, editar, eliminar propiedades
- ✅ Gestionar slides, configuración, usuarios
- ✅ Ver y gestionar solicitudes
- ✅ Ver logs de auditoría

### Usuario Público (sin login)
- ✅ Ver catálogo de propiedades
- ✅ Ver detalles de propiedades
- ✅ Enviar formularios de contacto
- ✅ Enviar solicitudes de empleo
- ❌ No puede acceder al panel admin

---

## Seguridad (RLS Políticas)

### Tablas Públicas (Lectura)
- `slides` (solo activos)
- `terrenos` (solo visibles)
- `nosotros`
- `configuracion`

### Solo Admin (Escritura)
- Todas las operaciones INSERT, UPDATE, DELETE
- Verificación: `auth.jwt() -> 'app_metadata' ->> 'rol' = 'admin'`

---

## Flujo de Trabajo Típico

### Publicar Nueva Propiedad

1. **Login** → `/admin/login`
2. **Panel** → Pestaña "Terrenos"
3. **Agregar** → Clic "Agregar Terreno/Casa"
4. **Completar**:
   - Título, tipo, descripción, ubicación
   - Precio, área, estado
   - Slug (URL amigable)
   - Imagen principal + galería
5. **Guardar** → Se publica inmediatamente
6. **Verificar** → Clic "Ver" para revisar en el sitio

### Gestionar Solicitud de Cliente

1. **Panel** → Pestaña "Compra/Venta"
2. **Ver Detalles** → Revisar información
3. **Contactar** → Email o teléfono
4. **Actualizar Estado** → Pendiente → En Proceso → Completado
5. **Agregar Notas** → Registrar seguimiento

---

## Endpoints Clave de Supabase

### Base de Datos
```
URL: https://xxxxx.supabase.co
API: /rest/v1/
Auth: /auth/v1/
```

### Storage
```
Bucket: propiedades-images
Carpetas:
  - slides/
  - terrenos/principales/
  - terrenos/adicionales/
  - nosotros/
```

---

## Funciones Principales en lib/supabase.ts

```typescript
// Slides
getSlides() → Obtiene slides activos

// Propiedades
getTerrenosFeatured() → Obtiene destacados
getTerrenoBySlug(slug) → Obtiene por slug
getAllTerrenos() → Obtiene todos visibles

// Imágenes
uploadImage(file, bucket, folder) → Sube imagen

// Configuración
getConfiguracion() → Obtiene config del sitio

// Nosotros
getNosotros() → Obtiene contenido "Nosotros"
```

---

## Troubleshooting Rápido

### Problema: No puedo iniciar sesión como admin
**Solución**:
```sql
-- Verificar rol en la base de datos
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"rol": "admin"}'::jsonb
WHERE email = 'tu-email@ejemplo.com';
```

### Problema: Imágenes no cargan
**Solución**:
1. Verificar políticas de storage en Supabase
2. Asegurar bucket `propiedades-images` existe
3. Verificar permisos de lectura pública

### Problema: Errores de RLS
**Solución**:
```sql
-- Ver políticas de una tabla
SELECT * FROM pg_policies WHERE tablename = 'terrenos';

-- Temporalmente deshabilitar (solo para debug)
ALTER TABLE terrenos DISABLE ROW LEVEL SECURITY;
```

### Problema: Build falla
**Solución**:
```bash
# Verificar tipos
npm run typecheck

# Ver errores específicos
npm run build

# Limpiar caché
rm -rf .next
npm run build
```

---

## Checklist de Despliegue

### Pre-Deploy
- [ ] `npm run build` sin errores
- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Storage bucket creado
- [ ] Políticas RLS activas
- [ ] Usuario admin creado

### Post-Deploy
- [ ] Sitio público carga correctamente
- [ ] Admin login funciona
- [ ] Propiedades se visualizan
- [ ] Imágenes cargan
- [ ] Formularios envían datos
- [ ] WhatsApp button funciona

---

## Contactos Importantes

### Supabase Dashboard
```
https://app.supabase.com/project/[PROJECT_ID]
```

### Vercel Dashboard
```
https://vercel.com/dashboard
```

### Documentación Completa
Ver archivos:
- `DOCUMENTACION_TECNICA.md` - Documentación técnica detallada
- `MANUAL_USUARIO.md` - Manual para administradores

---

## Mantenimiento Regular

### Diario
- Revisar solicitudes nuevas
- Responder consultas

### Semanal
- Actualizar propiedades destacadas
- Publicar nuevas propiedades
- Actualizar estados (vendido/disponible)

### Mensual
- Revisar logs de auditoría
- Limpiar solicitudes antiguas
- Optimizar imágenes no usadas
- Backup manual (opcional, Supabase hace automático)

---

## Recursos Externos

### Documentación Oficial
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs

### Herramientas
- TinyPNG (optimizar imágenes): https://tinypng.com
- Squoosh (conversión WebP): https://squoosh.app
- JSON Validator: https://jsonlint.com

---

## Información del Proyecto

**Nombre**: Fortunna Inmobiliaria
**Versión**: 1.0
**Tecnología**: Next.js 13 + Supabase
**Última Actualización**: Marzo 2026

---

## Notas Importantes

1. **NUNCA** comparta las credenciales de admin públicamente
2. **SIEMPRE** cierre sesión al terminar
3. **OPTIMICE** las imágenes antes de subir
4. **REVISE** las propiedades destacadas regularmente
5. **ACTUALICE** precios y estados de propiedades
6. **RESPONDA** solicitudes de clientes rápidamente
7. **REGISTRE** seguimiento en notas administrativas
8. **VERIFIQUE** que los cambios se vean bien en móviles

---

**Para más detalles, consulte la documentación completa**
