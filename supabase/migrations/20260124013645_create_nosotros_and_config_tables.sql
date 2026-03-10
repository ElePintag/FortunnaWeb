-- # Create Nosotros, Trabaje con Nosotros, and Configuration Tables
--
-- ## New Tables
-- 
-- ### 1. nosotros
-- Table for managing "About Us" section content (vision, mission, values, history, images)
-- - id (uuid, primary key)
-- - tipo (text) - Type of content: vision, mision, valores, resena_historica
-- - titulo (text) - Section title
-- - contenido (text) - Main content/text
-- - imagenes (jsonb) - Array of image URLs
-- - orden (integer) - Display order
-- - activo (boolean) - Whether section is active
-- - created_at (timestamptz)
-- - updated_at (timestamptz)
-- 
-- ### 2. trabaje_con_nosotros
-- Table for storing job application form submissions
-- - id (uuid, primary key)
-- - nombre_completo (text) - Full name
-- - email (text) - Email address
-- - telefono (text) - Phone number
-- - area_interes (text) - Area of interest
-- - mensaje (text) - Additional message
-- - estado (text) - Status: nuevo, revisado, contactado
-- - created_at (timestamptz)
-- 
-- ### 3. configuracion
-- Table for site configuration (logo, contact info, etc.)
-- - id (uuid, primary key)
-- - clave (text, unique) - Configuration key
-- - valor (text) - Configuration value
-- - tipo (text) - Type: texto, imagen, numero, boolean
-- - descripcion (text) - Description
-- - updated_at (timestamptz)
-- 
-- ## Security
-- - Enable RLS on all tables
-- - Public can read active nosotros content
-- - Authenticated users (admin) can manage all content
-- - Public can insert trabaje_con_nosotros submissions
-- - Public can read configuracion

-- Create nosotros table
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

-- Create trabaje_con_nosotros table
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

-- Create configuracion table
CREATE TABLE IF NOT EXISTS configuracion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave text UNIQUE NOT NULL,
  valor text,
  tipo text DEFAULT 'texto' CHECK (tipo IN ('texto', 'imagen', 'numero', 'boolean')),
  descripcion text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE nosotros ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabaje_con_nosotros ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- RLS Policies for nosotros
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

-- RLS Policies for trabaje_con_nosotros
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

-- RLS Policies for configuracion
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

-- Insert default configuration values
INSERT INTO configuracion (clave, valor, tipo, descripcion)
VALUES 
  ('logo_url', '', 'imagen', 'URL del logo del sitio'),
  ('whatsapp_number', '', 'texto', 'Número de WhatsApp para contacto'),
  ('email_contacto', '', 'texto', 'Email de contacto principal'),
  ('email_rrhh', '', 'texto', 'Email para recibir aplicaciones de trabajo')
ON CONFLICT (clave) DO NOTHING;