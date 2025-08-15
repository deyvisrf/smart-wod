-- Criar buckets de storage
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('wod-media', 'wod-media', true);

-- Políticas para o bucket de avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatar images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own avatar images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Políticas para o bucket de mídia dos WODs
CREATE POLICY "WOD media images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'wod-media');

CREATE POLICY "Users can upload WOD media images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'wod-media' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own WOD media images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'wod-media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own WOD media images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'wod-media'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
