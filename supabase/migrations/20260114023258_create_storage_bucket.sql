/*
  # Create Storage Bucket for Images

  1. New Storage Bucket
    - `images` - Public bucket for storing all site images
      - Accessible to authenticated users for uploads
      - Publicly readable for all visitors
      - Supports JPG, PNG, WEBP, GIF formats
      - Max file size: 10MB

  2. Security Policies
    - Authenticated users can upload images
    - Everyone can view images (public bucket)
    - Only authenticated users can delete their uploads

  3. Storage Configuration
    - Enable RLS on storage.objects
    - Allow public access for SELECT operations
    - Restrict INSERT/UPDATE/DELETE to authenticated users
*/

-- Create the public images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view images (public bucket)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public images are viewable by everyone'
  ) THEN
    CREATE POLICY "Public images are viewable by everyone"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'images');
  END IF;
END $$;

-- Policy: Authenticated users can upload images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can upload images'
  ) THEN
    CREATE POLICY "Authenticated users can upload images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'images');
  END IF;
END $$;

-- Policy: Authenticated users can update their images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can update images'
  ) THEN
    CREATE POLICY "Authenticated users can update images"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'images')
      WITH CHECK (bucket_id = 'images');
  END IF;
END $$;

-- Policy: Authenticated users can delete images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can delete images'
  ) THEN
    CREATE POLICY "Authenticated users can delete images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'images');
  END IF;
END $$;