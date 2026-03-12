# Diccionario de Datos - Fortunna Inmobiliaria

**Versión**: 1.0
**Fecha**: Marzo 2026
**Base de Datos**: PostgreSQL (Supabase)

---

## Índice

1. [Tabla: users](#tabla-users)
2. [Tabla: slides](#tabla-slides)
3. [Tabla: terrenos](#tabla-terrenos)
4. [Tabla: nosotros](#tabla-nosotros)
5. [Tabla: configuracion](#tabla-configuracion)
6. [Tabla: compra_venta_propiedades](#tabla-compra_venta_propiedades)
7. [Tabla: trabaje_con_nosotros](#tabla-trabaje_con_nosotros)
8. [Tabla: logs](#tabla-logs)
9. [Relaciones entre Tablas](#relaciones-entre-tablas)
10. [Tipos de Datos Comunes](#tipos-de-datos-comunes)

---

## Tabla: users

**Propósito**: Almacena información adicional de usuarios autenticados del sistema.

**Nombre técnico**: `users`

**Primary Key**: `id`

**Foreign Keys**:
- `id` → `auth.users(id)` (CASCADE DELETE)

### Campos

| Campo | Tipo | Nulo | Default | Descripción | Validación |
|-------|------|------|---------|-------------|------------|
| `id` | UUID | NO | - | Identificador único del usuario (referencia a auth.users) | UUID válido |
| `email` | TEXT | NO | - | Correo electrónico del usuario | Email válido, único |
| `nombre` | TEXT | SÍ | NULL | Nombre completo del usuario | Máx 255 caracteres |
| `rol` | TEXT | NO | 'user' | Rol del usuario en el sistema | 'admin' o 'user' |
| `activo` | BOOLEAN | NO | true | Indica si el usuario está activo | true/false |
| `created_at` | TIMESTAMPTZ | NO | now() | Fecha y hora de creación | Timestamp con zona |
| `updated_at` | TIMESTAMPTZ | NO | now() | Fecha y hora de última actualización | Timestamp con zona |

### Constraints

```sql
CHECK (rol IN ('admin', 'user', 'operador'))
UNIQUE (email)
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
```

### Índices

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_rol ON users(rol);
```

### Valores Permitidos

**rol**:
- `admin`: Acceso completo al panel administrativo
- `operador`: Acceso limitado (solo Terrenos y Compra/Venta)
- `user`: Usuario estándar (sin acceso al panel)

**activo**:
- `true`: Usuario puede iniciar sesión
- `false`: Usuario deshabilitado

### Ejemplo de Registro

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "admin@fortunna.com",
  "nombre": "Administrador Principal",
  "rol": "admin",
  "activo": true,
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-03-12T14:20:00Z"
}
```

---

## Tabla: slides

**Propósito**: Almacena las imágenes y contenido del carrusel principal de la página de inicio.

**Nombre técnico**: `slides`

**Primary Key**: `id`

### Campos

| Campo | Tipo | Nulo | Default | Descripción | Validación |
|-------|------|------|---------|-------------|------------|
| `id` | UUID | NO | gen_random_uuid() | Identificador único del slide | UUID válido |
| `titulo` | TEXT | SÍ | NULL | Título principal del slide | Máx 100 caracteres |
| `subtitulo` | TEXT | SÍ | NULL | Subtítulo o descripción corta | Máx 200 caracteres |
| `imagen_url` | TEXT | NO | - | URL de la imagen del slide | URL válida (HTTPS) |
| `orden` | INTEGER | NO | 0 | Orden de visualización en el carrusel | Número entero positivo |
| `activo` | BOOLEAN | NO | true | Indica si el slide está visible | true/false |
| `created_at` | TIMESTAMPTZ | NO | now() | Fecha y hora de creación | Timestamp con zona |
| `updated_at` | TIMESTAMPTZ | NO | now() | Fecha y hora de última actualización | Timestamp con zona |

### Índices

```sql
CREATE INDEX idx_slides_orden ON slides(orden) WHERE activo = true;
CREATE INDEX idx_slides_activo ON slides(activo);
```

### Valores Permitidos

**orden**:
- Números enteros positivos (1, 2, 3...)
- No hay límite, pero se recomienda máximo 5 slides

**activo**:
- `true`: Slide visible en el carrusel
- `false`: Slide oculto (archivado)

### Especificaciones de Imagen

| Propiedad | Valor |
|-----------|-------|
| Ancho recomendado | 1920px |
| Alto recomendado | 1080px |
| Proporción | 16:9 |
| Peso máximo | 500KB |
| Formato | JPG, PNG, WebP |

### Ejemplo de Registro

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "titulo": "Bienvenido a Fortunna Inmobiliaria",
  "subtitulo": "Tu hogar ideal te espera",
  "imagen_url": "https://xxx.supabase.co/storage/v1/object/public/propiedades-images/slides/hero-1.jpg",
  "orden": 1,
  "activo": true,
  "created_at": "2026-01-20T09:00:00Z",
  "updated_at": "2026-02-15T11:30:00Z"
}
```

---

## Tabla: terrenos

**Propósito**: Almacena información de propiedades (terrenos y casas) disponibles para venta.

**Nombre técnico**: `terrenos`

**Primary Key**: `id`

**Unique Keys**: `slug`

### Campos

| Campo | Tipo | Nulo | Default | Descripción | Validación |
|-------|------|------|---------|-------------|------------|
| `id` | UUID | NO | gen_random_uuid() | Identificador único de la propiedad | UUID válido |
| `titulo` | TEXT | NO | - | Nombre/título de la propiedad | Máx 200 caracteres |
| `descripcion` | TEXT | SÍ | NULL | Descripción detallada | Sin límite |
| `precio` | DECIMAL(15,2) | NO | - | Precio de venta en MXN | > 0, máx 15 dígitos |
| `ubicacion` | TEXT | NO | - | Ubicación/dirección | Máx 300 caracteres |
| `area` | DECIMAL(10,2) | SÍ | NULL | Área en metros cuadrados | > 0 |
| `tipo` | TEXT | NO | 'terreno' | Tipo de propiedad | 'terreno' o 'casa' |
| `estado` | TEXT | NO | 'disponible' | Estado de venta | Ver valores permitidos |
| `destacado` | BOOLEAN | NO | false | Si aparece en destacados | true/false |
| `imagen_principal` | TEXT | SÍ | NULL | URL de imagen principal | URL válida |
| `imagenes_adicionales` | TEXT[] | SÍ | NULL | Array de URLs de galería | Array de URLs |
| `slug` | TEXT | NO | - | URL amigable única | Formato: palabras-con-guiones |
| `caracteristicas` | JSONB | NO | '{}' | Características en formato JSON | JSON válido |
| `visible` | BOOLEAN | NO | true | Si es visible en el sitio | true/false |
| `fecha_publicacion` | TIMESTAMPTZ | NO | now() | Fecha de publicación | Timestamp con zona |
| `created_at` | TIMESTAMPTZ | NO | now() | Fecha de creación | Timestamp con zona |
| `updated_at` | TIMESTAMPTZ | NO | now() | Fecha de última actualización | Timestamp con zona |

### Constraints

```sql
CHECK (tipo IN ('terreno', 'casa'))
CHECK (estado IN ('disponible', 'vendido', 'apartado'))
CHECK (precio > 0)
CHECK (area > 0)
UNIQUE (slug)
```

### Índices

```sql
CREATE INDEX idx_terrenos_destacado ON terrenos(destacado) WHERE visible = true;
CREATE INDEX idx_terrenos_slug ON terrenos(slug);
CREATE INDEX idx_terrenos_tipo ON terrenos(tipo) WHERE visible = true;
CREATE INDEX idx_terrenos_estado ON terrenos(estado);
CREATE INDEX idx_terrenos_precio ON terrenos(precio);
```

### Valores Permitidos

**tipo**:
- `terreno`: Terreno sin construcción
- `casa`: Casa construida

**estado**:
- `disponible`: Propiedad disponible para venta
- `apartado`: Cliente pagó enganche, no disponible
- `vendido`: Propiedad vendida (se oculta automáticamente)

**caracteristicas** (Estructura JSON recomendada):

```json
{
  "recamaras": 3,
  "banos": 2,
  "medios_banos": 1,
  "estacionamiento": 2,
  "niveles": 2,
  "antiguedad": "5 años",
  "amenidades": ["Alberca", "Gimnasio", "Jardín"],
  "servicios": ["Agua", "Luz", "Gas", "Internet"],
  "seguridad": "Caseta con guardia 24/7"
}
```

### Especificaciones de Imágenes

**Imagen Principal**:
| Propiedad | Valor |
|-----------|-------|
| Ancho | 1200px |
| Alto | 800px |
| Proporción | 3:2 |
| Peso máximo | 300KB |
| Formato | JPG, WebP |

**Imágenes Adicionales**:
| Propiedad | Valor |
|-----------|-------|
| Ancho | 1200px |
| Alto | 800px |
| Proporción | 3:2 o 4:3 |
| Peso máximo | 250KB c/u |
| Cantidad | 3-10 imágenes |
| Formato | JPG, WebP |

### Ejemplo de Registro

```json
{
  "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "titulo": "Casa Residencial Las Palmas",
  "descripcion": "Hermosa casa de 3 recámaras en zona residencial privada...",
  "precio": 2500000.00,
  "ubicacion": "Col. Las Palmas, Guadalajara, Jalisco",
  "area": 150.00,
  "tipo": "casa",
  "estado": "disponible",
  "destacado": true,
  "imagen_principal": "https://xxx.supabase.co/.../casa-principal.jpg",
  "imagenes_adicionales": [
    "https://xxx.supabase.co/.../sala.jpg",
    "https://xxx.supabase.co/.../cocina.jpg",
    "https://xxx.supabase.co/.../jardin.jpg"
  ],
  "slug": "casa-residencial-las-palmas",
  "caracteristicas": {
    "recamaras": 3,
    "banos": 2,
    "estacionamiento": 2,
    "amenidades": ["Alberca", "Jardín"]
  },
  "visible": true,
  "fecha_publicacion": "2026-02-01T10:00:00Z",
  "created_at": "2026-01-30T15:20:00Z",
  "updated_at": "2026-03-10T09:15:00Z"
}
```

---

## Tabla: nosotros

**Propósito**: Almacena las secciones de contenido de la página "Nosotros".

**Nombre técnico**: `nosotros`

**Primary Key**: `id`

### Campos

| Campo | Tipo | Nulo | Default | Descripción | Validación |
|-------|------|------|---------|-------------|------------|
| `id` | UUID | NO | gen_random_uuid() | Identificador único de la sección | UUID válido |
| `titulo` | TEXT | NO | - | Título de la sección | Máx 150 caracteres |
| `contenido` | TEXT | NO | - | Contenido de la sección | Sin límite |
| `imagen_url` | TEXT | SÍ | NULL | URL de imagen ilustrativa | URL válida |
| `orden` | INTEGER | NO | 0 | Orden de visualización | Número positivo |
| `created_at` | TIMESTAMPTZ | NO | now() | Fecha de creación | Timestamp con zona |
| `updated_at` | TIMESTAMPTZ | NO | now() | Fecha de última actualización | Timestamp con zona |

### Índices

```sql
CREATE INDEX idx_nosotros_orden ON nosotros(orden);
```

### Especificaciones de Imagen

| Propiedad | Valor |
|-----------|-------|
| Ancho | 800px |
| Alto | 600px |
| Proporción | 4:3 |
| Peso máximo | 200KB |
| Formato | JPG, WebP |

### Ejemplo de Registro

```json
{
  "id": "d4e5f6a7-b8c9-0123-def0-123456789abc",
  "titulo": "Nuestra Historia",
  "contenido": "Fortunna Inmobiliaria fue fundada en 2015 con la visión de...",
  "imagen_url": "https://xxx.supabase.co/.../historia.jpg",
  "orden": 1,
  "created_at": "2026-01-10T12:00:00Z",
  "updated_at": "2026-02-20T14:30:00Z"
}
```

---

## Tabla: configuracion

**Propósito**: Almacena configuraciones generales del sitio web (contacto, redes sociales, etc.).

**Nombre técnico**: `configuracion`

**Primary Key**: `id`

**Unique Keys**: `clave`

### Campos

| Campo | Tipo | Nulo | Default | Descripción | Validación |
|-------|------|------|---------|-------------|------------|
| `id` | UUID | NO | gen_random_uuid() | Identificador único | UUID válido |
| `clave` | TEXT | NO | - | Identificador de la configuración | palabras-con-guiones |
| `valor` | TEXT | NO | - | Valor de la configuración | Depende del tipo |
| `descripcion` | TEXT | SÍ | NULL | Descripción de qué hace | Máx 300 caracteres |
| `tipo` | TEXT | NO | 'text' | Tipo de dato | Ver valores permitidos |
| `created_at` | TIMESTAMPTZ | NO | now() | Fecha de creación | Timestamp con zona |
| `updated_at` | TIMESTAMPTZ | NO | now() | Fecha de última actualización | Timestamp con zona |

### Constraints

```sql
CHECK (tipo IN ('text', 'number', 'boolean', 'json'))
UNIQUE (clave)
```

### Índices

```sql
CREATE UNIQUE INDEX idx_configuracion_clave ON configuracion(clave);
```

### Valores Permitidos

**tipo**:
- `text`: Texto libre
- `number`: Número
- `boolean`: Verdadero/Falso
- `json`: Objeto JSON

### Claves de Configuración Comunes

| Clave | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `whatsapp_numero` | text | Número de WhatsApp | +5213312345678 |
| `email_contacto` | text | Email principal | contacto@fortunna.com |
| `telefono` | text | Teléfono de oficina | (33) 1234-5678 |
| `direccion` | text | Dirección física | Av. Principal 123, GDL |
| `facebook_url` | text | URL de Facebook | https://facebook.com/fortunna |
| `instagram_url` | text | URL de Instagram | https://instagram.com/fortunna |
| `logo_url` | text | URL del logo | https://xxx.supabase.co/.../logo.png |

### Ejemplo de Registro

```json
{
  "id": "e5f6a7b8-c9d0-1234-ef01-23456789abcd",
  "clave": "whatsapp_numero",
  "valor": "+5213312345678",
  "descripcion": "Número de WhatsApp para contacto",
  "tipo": "text",
  "created_at": "2026-01-05T10:00:00Z",
  "updated_at": "2026-03-01T16:00:00Z"
}
```

---

## Tabla: compra_venta_propiedades

**Propósito**: Almacena solicitudes de clientes interesados en comprar o vender propiedades.

**Nombre técnico**: `compra_venta_propiedades`

**Primary Key**: `id`

### Campos

| Campo | Tipo | Nulo | Default | Descripción | Validación |
|-------|------|------|---------|-------------|------------|
| `id` | UUID | NO | gen_random_uuid() | Identificador único | UUID válido |
| `tipo_operacion` | TEXT | NO | - | Tipo de operación | 'compra' o 'venta' |
| `tipo_propiedad` | TEXT | NO | - | Tipo de propiedad | Texto libre |
| `nombre` | TEXT | NO | - | Nombre del cliente | Máx 200 caracteres |
| `email` | TEXT | NO | - | Email del cliente | Email válido |
| `telefono` | TEXT | NO | - | Teléfono del cliente | Formato internacional |
| `ubicacion` | TEXT | SÍ | NULL | Ubicación de interés | Máx 300 caracteres |
| `precio_aproximado` | DECIMAL(15,2) | SÍ | NULL | Presupuesto aproximado | > 0 |
| `descripcion` | TEXT | SÍ | NULL | Descripción detallada | Sin límite |
| `estado` | TEXT | NO | 'pendiente' | Estado de la solicitud | Ver valores permitidos |
| `notas_admin` | TEXT | SÍ | NULL | Notas internas | Sin límite |
| `created_at` | TIMESTAMPTZ | NO | now() | Fecha de creación | Timestamp con zona |
| `updated_at` | TIMESTAMPTZ | NO | now() | Fecha de última actualización | Timestamp con zona |

### Constraints

```sql
CHECK (tipo_operacion IN ('compra', 'venta'))
CHECK (estado IN ('pendiente', 'en_proceso', 'completado', 'cancelado'))
CHECK (precio_aproximado > 0 OR precio_aproximado IS NULL)
```

### Índices

```sql
CREATE INDEX idx_compra_venta_estado ON compra_venta_propiedades(estado);
CREATE INDEX idx_compra_venta_created ON compra_venta_propiedades(created_at DESC);
CREATE INDEX idx_compra_venta_tipo ON compra_venta_propiedades(tipo_operacion);
```

### Valores Permitidos

**tipo_operacion**:
- `compra`: Cliente quiere comprar
- `venta`: Cliente quiere vender

**estado**:
- `pendiente`: Solicitud nueva, sin revisar
- `en_proceso`: Ya contactado, en seguimiento
- `completado`: Operación cerrada exitosamente
- `cancelado`: No prosperó

### Ejemplo de Registro

```json
{
  "id": "f6a7b8c9-d0e1-2345-f012-3456789abcde",
  "tipo_operacion": "compra",
  "tipo_propiedad": "Casa",
  "nombre": "Juan Pérez García",
  "email": "juan.perez@email.com",
  "telefono": "+5213312345678",
  "ubicacion": "Zona Providencia, Guadalajara",
  "precio_aproximado": 2000000.00,
  "descripcion": "Busco casa de 3 recámaras en zona segura con buenas escuelas cercanas",
  "estado": "pendiente",
  "notas_admin": "Llamar el lunes para agendar visita",
  "created_at": "2026-03-10T14:30:00Z",
  "updated_at": "2026-03-11T09:00:00Z"
}
```

---

## Tabla: trabaje_con_nosotros

**Propósito**: Almacena solicitudes de empleo de personas interesadas en trabajar en Fortunna.

**Nombre técnico**: `trabaje_con_nosotros`

**Primary Key**: `id`

### Campos

| Campo | Tipo | Nulo | Default | Descripción | Validación |
|-------|------|------|---------|-------------|------------|
| `id` | UUID | NO | gen_random_uuid() | Identificador único | UUID válido |
| `nombre` | TEXT | NO | - | Nombre del candidato | Máx 200 caracteres |
| `email` | TEXT | NO | - | Email del candidato | Email válido |
| `telefono` | TEXT | NO | - | Teléfono del candidato | Formato internacional |
| `puesto_interes` | TEXT | NO | - | Puesto solicitado | Máx 150 caracteres |
| `experiencia` | TEXT | SÍ | NULL | Años de experiencia | Texto libre |
| `mensaje` | TEXT | SÍ | NULL | Mensaje del candidato | Sin límite |
| `cv_url` | TEXT | SÍ | NULL | URL del CV subido | URL válida (PDF) |
| `estado` | TEXT | NO | 'pendiente' | Estado de la solicitud | Ver valores permitidos |
| `notas_admin` | TEXT | SÍ | NULL | Notas de evaluación | Sin límite |
| `created_at` | TIMESTAMPTZ | NO | now() | Fecha de aplicación | Timestamp con zona |
| `updated_at` | TIMESTAMPTZ | NO | now() | Fecha de última actualización | Timestamp con zona |

### Constraints

```sql
CHECK (estado IN ('pendiente', 'revisado', 'contactado', 'rechazado'))
```

### Índices

```sql
CREATE INDEX idx_trabaje_estado ON trabaje_con_nosotros(estado);
CREATE INDEX idx_trabaje_created ON trabaje_con_nosotros(created_at DESC);
```

### Valores Permitidos

**estado**:
- `pendiente`: Solicitud nueva
- `revisado`: CV revisado, pendiente contacto
- `contactado`: Ya se contactó para entrevista
- `rechazado`: No cumple requisitos

### Ejemplo de Registro

```json
{
  "id": "a7b8c9d0-e1f2-3456-0123-456789abcdef",
  "nombre": "María González López",
  "email": "maria.gonzalez@email.com",
  "telefono": "+5213398765432",
  "puesto_interes": "Agente Inmobiliario",
  "experiencia": "5 años",
  "mensaje": "Tengo amplia experiencia en ventas inmobiliarias...",
  "cv_url": "https://xxx.supabase.co/.../cv-maria-gonzalez.pdf",
  "estado": "pendiente",
  "notas_admin": null,
  "created_at": "2026-03-08T11:20:00Z",
  "updated_at": "2026-03-08T11:20:00Z"
}
```

---

## Tabla: logs

**Propósito**: Registro de auditoría de todas las acciones administrativas en el sistema.

**Nombre técnico**: `logs`

**Primary Key**: `id`

**Foreign Keys**:
- `user_id` → `auth.users(id)` (SET NULL ON DELETE)

### Campos

| Campo | Tipo | Nulo | Default | Descripción | Validación |
|-------|------|------|---------|-------------|------------|
| `id` | UUID | NO | gen_random_uuid() | Identificador único | UUID válido |
| `user_id` | UUID | SÍ | NULL | ID del usuario que realizó la acción | UUID válido |
| `accion` | TEXT | NO | - | Tipo de acción realizada | Ver valores comunes |
| `tabla` | TEXT | SÍ | NULL | Tabla afectada | Nombre de tabla |
| `registro_id` | TEXT | SÍ | NULL | ID del registro afectado | UUID como texto |
| `detalles` | JSONB | SÍ | NULL | Información adicional en JSON | JSON válido |
| `ip_address` | TEXT | SÍ | NULL | Dirección IP del usuario | IPv4 o IPv6 |
| `user_agent` | TEXT | SÍ | NULL | Navegador/dispositivo usado | String user agent |
| `created_at` | TIMESTAMPTZ | NO | now() | Fecha y hora del evento | Timestamp con zona |

### Índices

```sql
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX idx_logs_tabla ON logs(tabla);
CREATE INDEX idx_logs_accion ON logs(accion);
```

### Valores Comunes de Acción

**Operaciones CRUD**:
- `CREATE`: Creó un nuevo registro
- `UPDATE`: Actualizó un registro existente
- `DELETE`: Eliminó un registro
- `READ`: Consultó información (opcional)

**Operaciones de Autenticación**:
- `LOGIN`: Usuario inició sesión
- `LOGOUT`: Usuario cerró sesión
- `LOGIN_FAILED`: Intento fallido de login

**Operaciones Especiales**:
- `UPLOAD_IMAGE`: Subió una imagen
- `DELETE_IMAGE`: Eliminó una imagen
- `EXPORT_DATA`: Exportó datos

### Estructura del Campo `detalles` (JSON)

```json
{
  "antes": {
    "titulo": "Casa en Centro",
    "precio": 1500000
  },
  "despues": {
    "titulo": "Casa en Centro",
    "precio": 1800000
  },
  "cambios": ["precio"],
  "metadata": {
    "duracion_ms": 250
  }
}
```

### Ejemplo de Registro

```json
{
  "id": "b8c9d0e1-f2a3-4567-1234-56789abcdef0",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "accion": "UPDATE",
  "tabla": "terrenos",
  "registro_id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
  "detalles": {
    "antes": {"precio": 2500000},
    "despues": {"precio": 2300000},
    "cambios": ["precio"]
  },
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "created_at": "2026-03-12T10:45:30Z"
}
```

---

## Relaciones entre Tablas

### Diagrama de Relaciones

```
auth.users (Supabase Auth)
    │
    ├── 1:1 ──> users (extensión de datos)
    │
    └── 1:N ──> logs (auditoría)

users
    │
    └── [No tiene relaciones directas]

terrenos
    │
    └── [Tabla independiente]

slides
    │
    └── [Tabla independiente]

nosotros
    │
    └── [Tabla independiente]

configuracion
    │
    └── [Tabla independiente]

compra_venta_propiedades
    │
    └── [Tabla independiente]

trabaje_con_nosotros
    │
    └── [Tabla independiente]

logs
    │
    └── N:1 ──> auth.users (quien hizo la acción)
```

### Descripción de Relaciones

1. **auth.users ↔ users**: Relación 1:1
   - Cada usuario autenticado tiene un registro en `users`
   - Se elimina en cascada si se borra de auth.users

2. **auth.users ↔ logs**: Relación 1:N
   - Un usuario puede tener muchos logs
   - Si se elimina el usuario, `user_id` en logs se pone NULL

---

## Tipos de Datos Comunes

### UUID
- **Formato**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Ejemplo**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- **Uso**: Identificadores únicos

### TEXT
- **Longitud**: Variable, sin límite técnico
- **Uso**: Strings de cualquier tamaño
- **Nota**: Para búsquedas, considerar límites prácticos

### DECIMAL(15,2)
- **Precisión**: 15 dígitos totales, 2 decimales
- **Rango**: -999,999,999,999.99 a 999,999,999,999.99
- **Ejemplo**: 2500000.00 (precio en pesos)
- **Uso**: Precios, montos monetarios

### BOOLEAN
- **Valores**: true, false
- **Storage**: 1 byte
- **Uso**: Banderas (activo, destacado, visible)

### TIMESTAMPTZ
- **Formato**: Timestamp con zona horaria
- **Ejemplo**: `2026-03-12T14:30:00+00:00`
- **Uso**: Fechas y horas (created_at, updated_at)

### JSONB
- **Formato**: JSON binario
- **Ventajas**: Búsquedas indexables, validación automática
- **Ejemplo**: `{"recamaras": 3, "banos": 2}`
- **Uso**: Datos estructurados variables

### TEXT[]
- **Formato**: Array de texto
- **Ejemplo**: `["url1.jpg", "url2.jpg", "url3.jpg"]`
- **Uso**: Listas de URLs, tags, etc.

---

## Convenciones de Nomenclatura

### Tablas
- Minúsculas
- Palabras separadas por guion bajo
- Nombres en plural preferentemente
- Ejemplo: `compra_venta_propiedades`

### Campos
- Minúsculas
- Palabras separadas por guion bajo
- Nombres descriptivos
- Ejemplo: `fecha_publicacion`

### Timestamps
- Siempre usar sufijo `_at`
- Ejemplo: `created_at`, `updated_at`

### Booleanos
- Sin prefijo `is_` o `has_`
- Nombres descriptivos del estado positivo
- Ejemplo: `activo`, `visible`, `destacado`

### IDs de Referencia
- Formato: `nombre_tabla_id`
- Ejemplo: `user_id`, `terreno_id`

---

## Políticas de Seguridad (RLS)

Todas las tablas tienen Row Level Security (RLS) habilitado.

### Resumen de Políticas

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| users | Admin | - | Admin | Admin |
| slides | Público | Admin | Admin | Admin |
| terrenos | Público | Admin | Admin | Admin |
| nosotros | Público | Admin | Admin | Admin |
| configuracion | Público | Admin | Admin | Admin |
| compra_venta | Admin | Público | Admin | Admin |
| trabaje_con_nosotros | Admin | Público | Admin | Admin |
| logs | Admin | Sistema | - | - |

**Leyenda**:
- **Público**: Cualquiera puede acceder
- **Admin**: Solo usuarios con rol 'admin' o 'operador'
- **Sistema**: Solo mediante triggers/funciones
- **-**: No permitido

---

## Notas Técnicas

### Backups
- Supabase realiza backups automáticos diarios
- Retención: 7 días en plan gratuito
- Recomendación: Exportar manualmente datos críticos mensualmente

### Migraciones
- Ubicación: `supabase/migrations/`
- Formato: `YYYYMMDDHHMMSS_descripcion.sql`
- Aplicar siempre en orden cronológico

### Performance
- Índices creados en campos de búsqueda frecuente
- JSONB indexado donde necesario
- Evitar `SELECT *` en producción

### Límites
- Tamaño máximo de fila: ~1GB (PostgreSQL)
- Tamaño recomendado de imágenes en JSONB: <1MB
- Cantidad de registros: Sin límite práctico

---

**Fin del Diccionario de Datos**

Para más información técnica, consultar:
- [DOCUMENTACION_TECNICA.md](DOCUMENTACION_TECNICA.md)
- [MANUAL_USUARIO.md](MANUAL_USUARIO.md)
