/*
  # Agregar campos de flujo de trabajo a compra_venta_propiedades

  ## 1. Nuevos Campos
    - `accion_tomada` (text, nullable) - Descripción de la acción tomada por el revisor
    - `notas_revision` (text, nullable) - Notas adicionales sobre la revisión
    - `notas_contacto` (text, nullable) - Notas adicionales sobre el contacto realizado

  ## 2. Mejoras al Sistema de Estados
    - Los registros nuevos permanecen en estado "nuevo" hasta que sean revisados
    - Cuando un admin marca como "revisado", se registra quién lo revisó, la fecha y puede agregar la acción tomada
    - Cuando se marca como "contactado", se registra quién contactó, la fecha y notas del contacto
    
  ## 3. Notas Importantes
    - Los campos son opcionales para permitir flexibilidad
    - El frontend controlará la lógica de mostrar/ocultar campos según el estado
    - Se mantienen todos los campos existentes de seguimiento (revisado_por, contactado_por, etc.)
*/

-- Agregar nuevos campos de flujo de trabajo
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'compra_venta_propiedades' AND column_name = 'accion_tomada'
  ) THEN
    ALTER TABLE compra_venta_propiedades ADD COLUMN accion_tomada text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'compra_venta_propiedades' AND column_name = 'notas_revision'
  ) THEN
    ALTER TABLE compra_venta_propiedades ADD COLUMN notas_revision text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'compra_venta_propiedades' AND column_name = 'notas_contacto'
  ) THEN
    ALTER TABLE compra_venta_propiedades ADD COLUMN notas_contacto text;
  END IF;
END $$;