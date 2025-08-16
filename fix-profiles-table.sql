-- Script para corrigir a tabela profiles existente
-- Execute este no Supabase SQL Editor

-- Adicionar colunas faltantes na tabela profiles (se não existirem)
DO $$ 
BEGIN
    -- Adicionar coluna email se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;

    -- Adicionar coluna username se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'username') THEN
        ALTER TABLE public.profiles ADD COLUMN username TEXT;
    END IF;

    -- Adicionar coluna website se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'website') THEN
        ALTER TABLE public.profiles ADD COLUMN website TEXT;
    END IF;

    -- Adicionar coluna is_premium se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'is_premium') THEN
        ALTER TABLE public.profiles ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Atualizar perfis existentes com email e username dos usuários
UPDATE public.profiles p
SET 
    email = u.email,
    username = LOWER(REPLACE(COALESCE(u.raw_user_meta_data->>'full_name', SPLIT_PART(u.email, '@', 1)), ' ', '_'))
FROM auth.users u
WHERE p.id = u.id 
AND (p.email IS NULL OR p.username IS NULL);

-- Habilitar RLS (se já estiver habilitado, não faz nada)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover e recriar políticas
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can create own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Função atualizada para criar perfil com todas as colunas
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    username, 
    created_at, 
    updated_at,
    followers_count,
    following_count,
    wods_count
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    LOWER(REPLACE(COALESCE(new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1)), ' ', '_')),
    now(),
    now(),
    0,
    0,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = EXCLUDED.username
  WHERE public.profiles.email IS NULL OR public.profiles.username IS NULL;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar perfis para usuários que ainda não têm
INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    username, 
    created_at, 
    updated_at,
    followers_count,
    following_count,
    wods_count
)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email),
    u.email,
    LOWER(REPLACE(COALESCE(u.raw_user_meta_data->>'full_name', SPLIT_PART(u.email, '@', 1)), ' ', '_')),
    u.created_at,
    u.updated_at,
    0,
    0,
    0
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Verificar estrutura da tabela
DO $$
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles';
    
    RAISE NOTICE '✅ Tabela profiles atualizada com % colunas', col_count;
    RAISE NOTICE '📊 Colunas adicionadas: email, username, website, is_premium';
    RAISE NOTICE '🔒 Políticas RLS reconfiguradas';
    RAISE NOTICE '👤 Perfis criados/atualizados para todos os usuários';
END $$;
