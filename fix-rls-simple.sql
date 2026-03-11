-- Script simple para agregar políticas RLS sin eliminar las existentes
-- Copia y pega este script en Supabase SQL Editor

-- Políticas para NOSOTROS
CREATE POLICY IF NOT EXISTS "Admin can insert nosotros"
  ON nosotros FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can update nosotros"
  ON nosotros FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can delete nosotros"
  ON nosotros FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para SLIDES
CREATE POLICY IF NOT EXISTS "Admin can insert slides"
  ON slides FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can update slides"
  ON slides FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can delete slides"
  ON slides FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para TERRENOS
CREATE POLICY IF NOT EXISTS "Admin can insert terrenos"
  ON terrenos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can update terrenos"
  ON terrenos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can delete terrenos"
  ON terrenos FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para CONFIGURACION
CREATE POLICY IF NOT EXISTS "Admin can update configuracion"
  ON configuracion FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para COMPRA_VENTA_PROPIEDADES
CREATE POLICY IF NOT EXISTS "Admin can insert propiedades"
  ON compra_venta_propiedades FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can update propiedades"
  ON compra_venta_propiedades FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Admin can delete propiedades"
  ON compra_venta_propiedades FOR DELETE
  TO authenticated
  USING (true);
