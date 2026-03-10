/*
  # MIGRACIÓN COMPLETA - Base de Datos Terrenos App

  Este script contiene TODA la estructura de la base de datos actual.
  Ejecuta este script en tu NUEVO proyecto de Supabase (en orden).

  ## Estructura:
  1. Tablas principales (slides, terrenos)
  2. Storage bucket para imágenes
  3. Tablas adicionales (nosotros, configuracion, trabaje_con_nosotros, compra_venta_propiedades, system_logs)
  4. Políticas RLS completas
  5. Configuración por defecto

  ## IMPORTANTE:
  - Ejecuta este script en el SQL Editor de tu nuevo proyecto
  - Asegúrate de ejecutarlo COMPLETO en una sola sesión
  - Después de ejecutar esto, exporta e importa los datos
*/

-- ============================================================================
-- PARTE 1: TABLAS PRINCIPALES
-- ============================================================================

-- Tabla: slides (carrusel/slider de página principal)
CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  subtitulo text,
  imagen_url text NOT NULL,
  link_opcional text,
  orden integer DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla: terrenos (propiedades en venta)
CREATE TABLE IF NOT EXISTS terrenos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  slug text NOT NULL UNIQUE,
  ubicacion text NOT NULL,
  precio numeric NOT NULL,
  superficie_m2 numeric NOT NULL,
  estado text NOT NULL DEFAULT 'disponible' CHECK (estado IN ('disponible', 'vendido')),
  descripcion text,
  imagenes jsonb DEFAULT '[]'::jsonb,
  destacado boolean DEFAULT false,
  fecha_publicacion timestamptz DEFAULT now(),
  revisado boolean DEFAULT false,
  revisado_por text,
  comentario_revision text,
  contactado boolean DEFAULT false,
  contactado_por text,
  detalle_contacto text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Crear índice para búsquedas por slug
CREATE INDEX IF NOT EXISTS idx_terrenos_slug ON terrenos(slug);
CREATE INDEX IF NOT EXISTS idx_terrenos_estado ON terrenos(estado);
CREATE INDEX IF NOT EXISTS idx_terrenos_destacado ON terrenos(destacado);

-- ============================================================================
-- PARTE 2: STORAGE BUCKET PARA IMÁGENES
-- ============================================================================

-- Crear bucket público para imágenes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PARTE 3: TABLAS ADICIONALES
-- ============================================================================

-- Tabla: nosotros (sección "Sobre Nosotros")
CREATE TABLE IF NOT EXISTS nosotros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('vision', 'mision', 'valores', 'resena_historica')),
  titulo text NOT NULL,
  contenido text NOT NULL,
  imagenes jsonb DEFAULT '[]'::jsonb,
  orden integer DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabla: trabaje_con_nosotros (formulario de empleo)
CREATE TABLE IF NOT EXISTS trabaje_con_nosotros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,
  area_interes text NOT NULL,
  mensaje text,
  estado text DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'revisado', 'contactado')),
  created_at timestamptz DEFAULT now()
);

-- Tabla: configuracion (configuración del sitio)
CREATE TABLE IF NOT EXISTS configuracion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave text UNIQUE NOT NULL,
  valor text,
  tipo text DEFAULT 'texto' CHECK (tipo IN ('texto', 'imagen', 'numero', 'boolean')),
  descripcion text,
  updated_at timestamptz DEFAULT now()
);

-- Tabla: compra_venta_propiedades (formulario de interés en compra/venta)
CREATE TABLE IF NOT EXISTS compra_venta_propiedades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,
  tipo_interes text NOT NULL CHECK (tipo_interes IN ('compra', 'venta')),
  mensaje text,
  estado text DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'revisado', 'contactado')),
  created_at timestamptz DEFAULT now()
);

-- Tabla: system_logs (logs del sistema)
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL,
  modulo text NOT NULL,
  mensaje text NOT NULL,
  detalles jsonb,
  usuario_email text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================================
-- PARTE 4: HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================================

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE terrenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE nosotros ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabaje_con_nosotros ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;
ALTER TABLE compra_venta_propiedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PARTE 5: POLÍTICAS RLS - SLIDES
-- ============================================================================

CREATE POLICY "Anyone can view active slides"
  ON slides FOR SELECT
  TO public
  USING (activo = true);

CREATE POLICY "Authenticated users can view all slides"
  ON slides FOR SELECT
  TO authenticated
  USING (true);

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

-- ============================================================================
-- PARTE 6: POLÍTICAS RLS - TERRENOS
-- ============================================================================

CREATE POLICY "Anyone can view available terrenos"
  ON terrenos FOR SELECT
  TO public
  USING (true);

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

-- ============================================================================
-- PARTE 7: POLÍTICAS RLS - NOSOTROS
-- ============================================================================

CREATE POLICY "Anyone can view active nosotros content"
  ON nosotros FOR SELECT
  TO public
  USING (activo = true);

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

-- ============================================================================
-- PARTE 8: POLÍTICAS RLS - TRABAJE_CON_NOSOTROS
-- ============================================================================

CREATE POLICY "Anyone can submit job applications"
  ON trabaje_con_nosotros FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view job applications"
  ON trabaje_con_nosotros FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update job applications"
  ON trabaje_con_nosotros FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete job applications"
  ON trabaje_con_nosotros FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- PARTE 9: POLÍTICAS RLS - CONFIGURACION
-- ============================================================================

CREATE POLICY "Anyone can view configuration"
  ON configuracion FOR SELECT
  TO public
  USING (true);

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

-- ============================================================================
-- PARTE 10: POLÍTICAS RLS - COMPRA_VENTA_PROPIEDADES
-- ============================================================================

CREATE POLICY "Anyone can submit property interest"
  ON compra_venta_propiedades FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view property interests"
  ON compra_venta_propiedades FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update property interests"
  ON compra_venta_propiedades FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete property interests"
  ON compra_venta_propiedades FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================================
-- PARTE 11: POLÍTICAS RLS - SYSTEM_LOGS
-- ============================================================================

CREATE POLICY "Authenticated users can read logs"
  ON system_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create logs"
  ON system_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- PARTE 12: POLÍTICAS RLS - STORAGE
-- ============================================================================

-- Política: Cualquiera puede ver imágenes del bucket público
CREATE POLICY "Public images are viewable by everyone"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');

-- Política: Usuarios autenticados pueden subir imágenes
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Política: Usuarios autenticados pueden actualizar imágenes
CREATE POLICY "Authenticated users can update images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images')
  WITH CHECK (bucket_id = 'images');

-- Política: Usuarios autenticados pueden eliminar imágenes
CREATE POLICY "Authenticated users can delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'images');

-- ============================================================================
-- PARTE 13: CONFIGURACIÓN POR DEFECTO
-- ============================================================================

-- Insertar valores de configuración por defecto
INSERT INTO configuracion (clave, valor, tipo, descripcion)
VALUES
  ('logo_url', '', 'imagen', 'URL del logo del sitio'),
  ('whatsapp_number', '', 'texto', 'Número de WhatsApp para contacto'),
  ('email_contacto', '', 'texto', 'Email de contacto principal'),
  ('email_rrhh', '', 'texto', 'Email para recibir aplicaciones de trabajo')
ON CONFLICT (clave) DO NOTHING;

-- ============================================================================
-- FIN DEL SCRIPT DE MIGRACIÓN
-- ============================================================================

-- ✅ Si llegaste hasta aquí sin errores, la estructura está completa.
-- ⏭️ Siguiente paso: Exportar e importar datos del proyecto anterior.
