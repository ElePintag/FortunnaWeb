/*
  # Add Review and Contact Fields to Terrenos Table

  1. Changes
    - Add `revisado` (boolean) field to track if property has been reviewed
    - Add `revisado_por` (text) field to store username who reviewed
    - Add `comentario_revision` (text) field for review comments
    - Add `contactado` (boolean) field to track if property was contacted
    - Add `contactado_por` (text) field to store username who contacted
    - Add `detalle_contacto` (text) field for contact details

  2. Notes
    - All fields are nullable and default to NULL
    - `revisado` and `contactado` default to false
    - These fields allow tracking review and contact history
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos' AND column_name = 'revisado'
  ) THEN
    ALTER TABLE terrenos ADD COLUMN revisado boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos' AND column_name = 'revisado_por'
  ) THEN
    ALTER TABLE terrenos ADD COLUMN revisado_por text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos' AND column_name = 'comentario_revision'
  ) THEN
    ALTER TABLE terrenos ADD COLUMN comentario_revision text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos' AND column_name = 'contactado'
  ) THEN
    ALTER TABLE terrenos ADD COLUMN contactado boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos' AND column_name = 'contactado_por'
  ) THEN
    ALTER TABLE terrenos ADD COLUMN contactado_por text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'terrenos' AND column_name = 'detalle_contacto'
  ) THEN
    ALTER TABLE terrenos ADD COLUMN detalle_contacto text;
  END IF;
END $$;