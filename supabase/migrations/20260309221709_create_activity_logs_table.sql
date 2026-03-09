/*
  # Crear tabla de logs de actividad para solicitudes

  ## 1. Nueva Tabla: activity_logs
    - `id` (uuid, primary key) - Identificador único del log
    - `solicitud_id` (uuid, foreign key) - Referencia a compra_venta_propiedades
    - `user_id` (uuid, foreign key) - Usuario que realizó la acción
    - `accion` (text) - Tipo de acción realizada (creado, revisado, contactado, nota_agregada, etc.)
    - `descripcion` (text, nullable) - Descripción detallada de la acción
    - `metadata` (jsonb, nullable) - Datos adicionales sobre la acción
    - `created_at` (timestamptz) - Fecha y hora de la acción

  ## 2. Índices
    - Índice en solicitud_id para consultas rápidas por solicitud
    - Índice en created_at para ordenar cronológicamente

  ## 3. Seguridad
    - RLS habilitado
    - Políticas restrictivas: solo usuarios autenticados pueden leer logs
    - Los logs son de solo lectura para la aplicación (se crean vía triggers o funciones)
    
  ## 4. Triggers
    - Trigger automático para registrar cambios de estado
*/

-- Crear la tabla de logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitud_id uuid NOT NULL REFERENCES compra_venta_propiedades(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accion text NOT NULL,
  descripcion text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Crear índices para consultas eficientes
CREATE INDEX IF NOT EXISTS idx_activity_logs_solicitud_id ON activity_logs(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);

-- Habilitar RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Política para lectura: usuarios autenticados pueden ver logs
CREATE POLICY "Authenticated users can view activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (true);

-- Política para inserción: usuarios autenticados pueden crear logs
CREATE POLICY "Authenticated users can create activity logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Función para crear log automáticamente
CREATE OR REPLACE FUNCTION log_compra_venta_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Registrar creación de nueva solicitud
  IF TG_OP = 'INSERT' THEN
    INSERT INTO activity_logs (solicitud_id, user_id, accion, descripcion)
    VALUES (
      NEW.id,
      NEW.ingresado_por,
      'solicitud_creada',
      'Nueva solicitud de ' || NEW.tipo_interes || ' registrada'
    );
    RETURN NEW;
  END IF;

  -- Registrar cambios de estado
  IF TG_OP = 'UPDATE' AND OLD.estado != NEW.estado THEN
    DECLARE
      log_user_id uuid;
      log_descripcion text;
    BEGIN
      -- Determinar qué usuario realizó el cambio
      IF NEW.estado = 'revisado' THEN
        log_user_id := NEW.revisado_por;
        log_descripcion := 'Solicitud marcada como revisada';
        IF NEW.accion_tomada IS NOT NULL AND NEW.accion_tomada != '' THEN
          log_descripcion := log_descripcion || '. Acción: ' || NEW.accion_tomada;
        END IF;
      ELSIF NEW.estado = 'contactado' THEN
        log_user_id := NEW.contactado_por;
        log_descripcion := 'Cliente contactado';
        IF NEW.notas_contacto IS NOT NULL AND NEW.notas_contacto != '' THEN
          log_descripcion := log_descripcion || '. ' || NEW.notas_contacto;
        END IF;
      ELSIF NEW.estado = 'nuevo' THEN
        log_user_id := auth.uid();
        log_descripcion := 'Solicitud marcada como nueva nuevamente';
      END IF;

      INSERT INTO activity_logs (solicitud_id, user_id, accion, descripcion, metadata)
      VALUES (
        NEW.id,
        log_user_id,
        'cambio_estado',
        log_descripcion,
        jsonb_build_object(
          'estado_anterior', OLD.estado,
          'estado_nuevo', NEW.estado
        )
      );
    END;
  END IF;

  -- Registrar cambios en notas de revisión
  IF TG_OP = 'UPDATE' AND (OLD.notas_revision IS DISTINCT FROM NEW.notas_revision) AND NEW.notas_revision IS NOT NULL THEN
    INSERT INTO activity_logs (solicitud_id, user_id, accion, descripcion)
    VALUES (
      NEW.id,
      NEW.revisado_por,
      'nota_revision_agregada',
      'Notas de revisión actualizadas'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para cambios en compra_venta_propiedades
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_log_compra_venta_activity'
  ) THEN
    CREATE TRIGGER trigger_log_compra_venta_activity
      AFTER INSERT OR UPDATE ON compra_venta_propiedades
      FOR EACH ROW
      EXECUTE FUNCTION log_compra_venta_activity();
  END IF;
END $$;