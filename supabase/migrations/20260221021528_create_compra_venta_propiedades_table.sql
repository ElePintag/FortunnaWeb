/*
  # Create Compra/Venta Propiedades Table

  1. New Tables
    - `compra_venta_propiedades`
      - `id` (uuid, primary key)
      - `nombre_completo` (text) - Full name of the person
      - `email` (text) - Email address
      - `telefono` (text) - Phone number
      - `tipo_interes` (text) - Type of interest: 'compra' or 'venta'
      - `mensaje` (text) - Additional message/details
      - `estado` (text) - Status: 'nuevo', 'revisado', 'contactado'
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on the table
    - Public can insert new submissions (anyone can submit the form)
    - Authenticated users can view, update, and delete submissions (admin access)

  3. Important Notes
    - This table replaces the previous "trabaje_con_nosotros" functionality
    - Allows users to express interest in buying or selling properties
    - Admin can manage all submissions through the dashboard
*/

-- Create compra_venta_propiedades table
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

-- Enable RLS
ALTER TABLE compra_venta_propiedades ENABLE ROW LEVEL SECURITY;

-- RLS Policies for compra_venta_propiedades
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
