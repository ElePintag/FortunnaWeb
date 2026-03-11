/*
  # Script Completo de Base de Datos - Fortunna

  Este script crea todas las tablas necesarias y configura el sistema de roles.

  1. Tablas creadas:
    - users: Gestión de usuarios del sistema
    - terrenos: Propiedades en venta
    - slides: Slider de la página principal
    - configuracion: Configuración global del sitio
    - nosotros: Contenido de la página "Nosotros"
    - trabaje_con_nosotros: Solicitudes de empleo
    - compra_venta_propiedades: Solicitudes de compra/venta
    - logs: Registro de actividad del sistema

  2. Sistema de Roles:
    - admin: Acceso completo
    - operador: Acceso a Terrenos y Compra/Venta
    - user: Sin acceso (futuro uso)

  3. Seguridad:
    - RLS habilitado en todas las tablas
    - Políticas específicas por rol

  INSTRUCCIONES:
  1. Ve a https://app.supabase.com
  2. Abre tu proyecto
  3. SQL Editor → New query
  4. Copia y pega TODO este script
  5. Click en "Run"
*/

-- =============================================
-- 1. CREAR TABLA USERS
-- =============================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  rol text NOT NULL DEFAULT 'user',
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_rol_check CHECK (rol IN ('admin', 'operador', 'user'))
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. CREAR TABLA TERRENOS
-- =============================================

CREATE TABLE IF NOT EXISTS terrenos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descripcion text,
  precio numeric NOT NULL,
  ubicacion text NOT NULL,
  superficie numeric NOT NULL,
  tipo_propiedad text NOT NULL,
  estado text DEFAULT 'disponible',
  imagenes text[] DEFAULT '{}',
  slug text UNIQUE NOT NULL,
  destacado boolean DEFAULT false,
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  reviewed_by uuid REFERENCES users(id),
  reviewed_at timestamptz,
  review_status text DEFAULT 'pending',
  review_notes text,
  CONSTRAINT terrenos_estado_check CHECK (estado IN ('disponible', 'vendido', 'reservado')),
  CONSTRAINT terrenos_review_status_check CHECK (review_status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_terrenos_slug ON terrenos(slug);
CREATE INDEX IF NOT EXISTS idx_terrenos_estado ON terrenos(estado);
CREATE INDEX IF NOT EXISTS idx_terrenos_destacado ON terrenos(destacado);

ALTER TABLE terrenos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. CREAR TABLA SLIDES
-- =============================================

CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  subtitulo text,
  imagen_url text NOT NULL,
  orden integer DEFAULT 0,
  activo boolean DEFAULT true,
  link text,
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_slides_orden ON slides(orden);
CREATE INDEX IF NOT EXISTS idx_slides_activo ON slides(activo);

ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 4. CREAR TABLA CONFIGURACION
-- =============================================

CREATE TABLE IF NOT EXISTS configuracion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clave text UNIQUE NOT NULL,
  valor text,
  descripcion text,
  actualizado_en timestamptz DEFAULT now()
);

ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. CREAR TABLA NOSOTROS
-- =============================================

CREATE TABLE IF NOT EXISTS nosotros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  contenido text NOT NULL,
  imagen_url text,
  orden integer DEFAULT 0,
  activo boolean DEFAULT true,
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_nosotros_orden ON nosotros(orden);
CREATE INDEX IF NOT EXISTS idx_nosotros_activo ON nosotros(activo);

ALTER TABLE nosotros ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 6. CREAR TABLA TRABAJE_CON_NOSOTROS
-- =============================================

CREATE TABLE IF NOT EXISTS trabaje_con_nosotros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  mensaje text,
  cv_url text,
  estado text DEFAULT 'pendiente',
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now(),
  CONSTRAINT trabaje_estado_check CHECK (estado IN ('pendiente', 'revisado', 'contactado', 'descartado'))
);

CREATE INDEX IF NOT EXISTS idx_trabaje_estado ON trabaje_con_nosotros(estado);
CREATE INDEX IF NOT EXISTS idx_trabaje_creado ON trabaje_con_nosotros(creado_en DESC);

ALTER TABLE trabaje_con_nosotros ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 7. CREAR TABLA COMPRA_VENTA_PROPIEDADES
-- =============================================

CREATE TABLE IF NOT EXISTS compra_venta_propiedades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text,
  tipo_operacion text NOT NULL,
  tipo_propiedad text NOT NULL,
  ubicacion text,
  presupuesto text,
  mensaje text,
  estado text DEFAULT 'pendiente',
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now(),
  CONSTRAINT compra_venta_tipo_operacion_check CHECK (tipo_operacion IN ('compra', 'venta')),
  CONSTRAINT compra_venta_estado_check CHECK (estado IN ('pendiente', 'contactado', 'en_proceso', 'cerrado', 'descartado'))
);

CREATE INDEX IF NOT EXISTS idx_compra_venta_estado ON compra_venta_propiedades(estado);
CREATE INDEX IF NOT EXISTS idx_compra_venta_tipo ON compra_venta_propiedades(tipo_operacion);
CREATE INDEX IF NOT EXISTS idx_compra_venta_creado ON compra_venta_propiedades(creado_en DESC);

ALTER TABLE compra_venta_propiedades ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 8. CREAR TABLA LOGS
-- =============================================

CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  accion text NOT NULL,
  tabla text NOT NULL,
  registro_id uuid,
  detalles jsonb,
  ip_address text,
  user_agent text,
  creado_en timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_logs_user ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_tabla ON logs(tabla);
CREATE INDEX IF NOT EXISTS idx_logs_creado ON logs(creado_en DESC);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 9. FUNCIONES HELPER PARA VERIFICAR ROLES
-- =============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'rol') = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_operador()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'rol') = 'operador';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_or_operador()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'rol') IN ('admin', 'operador');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 10. POLÍTICAS RLS - USERS
-- =============================================

CREATE POLICY "Only admin can read all users"
ON users FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admin can insert users"
ON users FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update users"
ON users FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete users"
ON users FOR DELETE
TO authenticated
USING (is_admin());

-- =============================================
-- 11. POLÍTICAS RLS - TERRENOS
-- =============================================

CREATE POLICY "Anyone can view published terrenos"
ON terrenos FOR SELECT
TO anon, authenticated
USING (estado = 'disponible' AND review_status = 'approved');

CREATE POLICY "Admin and Operador can view all terrenos"
ON terrenos FOR SELECT
TO authenticated
USING (is_admin_or_operador());

CREATE POLICY "Admin and Operador can insert terrenos"
ON terrenos FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_operador());

CREATE POLICY "Admin and Operador can update terrenos"
ON terrenos FOR UPDATE
TO authenticated
USING (is_admin_or_operador())
WITH CHECK (is_admin_or_operador());

CREATE POLICY "Admin and Operador can delete terrenos"
ON terrenos FOR DELETE
TO authenticated
USING (is_admin_or_operador());

-- =============================================
-- 12. POLÍTICAS RLS - SLIDES
-- =============================================

CREATE POLICY "Anyone can view active slides"
ON slides FOR SELECT
TO anon, authenticated
USING (activo = true);

CREATE POLICY "Admin can view all slides"
ON slides FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admin can insert slides"
ON slides FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update slides"
ON slides FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete slides"
ON slides FOR DELETE
TO authenticated
USING (is_admin());

-- =============================================
-- 13. POLÍTICAS RLS - CONFIGURACION
-- =============================================

CREATE POLICY "Anyone can view configuracion"
ON configuracion FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Only admin can insert configuracion"
ON configuracion FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update configuracion"
ON configuracion FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete configuracion"
ON configuracion FOR DELETE
TO authenticated
USING (is_admin());

-- =============================================
-- 14. POLÍTICAS RLS - NOSOTROS
-- =============================================

CREATE POLICY "Anyone can view active nosotros"
ON nosotros FOR SELECT
TO anon, authenticated
USING (activo = true);

CREATE POLICY "Admin can view all nosotros"
ON nosotros FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admin can insert nosotros"
ON nosotros FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admin can update nosotros"
ON nosotros FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete nosotros"
ON nosotros FOR DELETE
TO authenticated
USING (is_admin());

-- =============================================
-- 15. POLÍTICAS RLS - TRABAJE_CON_NOSOTROS
-- =============================================

CREATE POLICY "Anyone can insert trabaje_con_nosotros"
ON trabaje_con_nosotros FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admin can read trabaje_con_nosotros"
ON trabaje_con_nosotros FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Only admin can update trabaje_con_nosotros"
ON trabaje_con_nosotros FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Only admin can delete trabaje_con_nosotros"
ON trabaje_con_nosotros FOR DELETE
TO authenticated
USING (is_admin());

-- =============================================
-- 16. POLÍTICAS RLS - COMPRA_VENTA_PROPIEDADES
-- =============================================

CREATE POLICY "Anyone can insert compra_venta"
ON compra_venta_propiedades FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admin and Operador can read compra_venta"
ON compra_venta_propiedades FOR SELECT
TO authenticated
USING (is_admin_or_operador());

CREATE POLICY "Admin and Operador can update compra_venta"
ON compra_venta_propiedades FOR UPDATE
TO authenticated
USING (is_admin_or_operador())
WITH CHECK (is_admin_or_operador());

CREATE POLICY "Only admin can delete compra_venta"
ON compra_venta_propiedades FOR DELETE
TO authenticated
USING (is_admin());

-- =============================================
-- 17. POLÍTICAS RLS - LOGS
-- =============================================

CREATE POLICY "Only admin can read logs"
ON logs FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Authenticated users can insert logs"
ON logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- =============================================
-- 18. ASIGNAR ROL ADMIN AL USUARIO POR DEFECTO
-- =============================================

-- Asignar rol de admin al usuario admin@fortunna.com
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@fortunna.com') THEN
    -- Actualizar metadata en auth.users
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"rol": "admin"}'::jsonb
    WHERE email = 'admin@fortunna.com';

    -- Insertar o actualizar en tabla users
    INSERT INTO users (id, email, rol, activo)
    SELECT id, email, 'admin', true
    FROM auth.users
    WHERE email = 'admin@fortunna.com'
    ON CONFLICT (id)
    DO UPDATE SET rol = 'admin', activo = true;

    RAISE NOTICE 'Usuario admin@fortunna.com configurado como Administrador';
  ELSE
    RAISE NOTICE 'Usuario admin@fortunna.com no encontrado. Créalo primero y ejecuta este script nuevamente.';
  END IF;
END $$;

-- =============================================
-- 19. COMENTARIOS
-- =============================================

COMMENT ON TABLE users IS 'Usuarios del sistema con roles y permisos';
COMMENT ON TABLE terrenos IS 'Propiedades disponibles para venta';
COMMENT ON TABLE slides IS 'Slider de imágenes de la página principal';
COMMENT ON TABLE configuracion IS 'Configuración global del sitio';
COMMENT ON TABLE nosotros IS 'Contenido de la página Nosotros';
COMMENT ON TABLE trabaje_con_nosotros IS 'Solicitudes de empleo';
COMMENT ON TABLE compra_venta_propiedades IS 'Solicitudes de compra/venta de propiedades';
COMMENT ON TABLE logs IS 'Registro de actividad del sistema';

COMMENT ON FUNCTION is_admin() IS 'Verifica si el usuario autenticado tiene rol de administrador';
COMMENT ON FUNCTION is_operador() IS 'Verifica si el usuario autenticado tiene rol de operador';
COMMENT ON FUNCTION is_admin_or_operador() IS 'Verifica si el usuario autenticado es admin u operador';
