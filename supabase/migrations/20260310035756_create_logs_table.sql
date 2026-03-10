/*
  # Create System Logs Table

  1. New Tables
    - `system_logs`
      - `id` (uuid, primary key)
      - `tipo` (text) - Type of log (error, info, warning, success, user_action)
      - `modulo` (text) - Module where the log was generated (terrenos, slides, users, etc.)
      - `mensaje` (text) - Log message
      - `detalles` (jsonb) - Additional details in JSON format
      - `usuario_email` (text) - Email of the user who triggered the action
      - `created_at` (timestamptz) - Timestamp of log creation

  2. Security
    - Enable RLS on `system_logs` table
    - Add policy for authenticated users to read logs
    - Add policy for authenticated users to create logs
*/

CREATE TABLE IF NOT EXISTS system_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL,
  modulo text NOT NULL,
  mensaje text NOT NULL,
  detalles jsonb,
  usuario_email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'system_logs' AND policyname = 'Authenticated users can read logs'
  ) THEN
    CREATE POLICY "Authenticated users can read logs"
      ON system_logs
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'system_logs' AND policyname = 'Authenticated users can create logs'
  ) THEN
    CREATE POLICY "Authenticated users can create logs"
      ON system_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;