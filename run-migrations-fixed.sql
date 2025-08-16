-- Execute este SQL no Supabase SQL Editor
-- Versão corrigida que não duplica políticas existentes

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de perfis de usuários (complementa auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  username TEXT,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  website TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  wods_count INTEGER DEFAULT 0
);

-- Habilitar RLS (se já estiver habilitado, não faz nada)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Recriar políticas
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can create own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Função para criar perfil automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, username, created_at, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    LOWER(REPLACE(COALESCE(new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1)), ' ', '_')),
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING; -- Não faz nada se o perfil já existir
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar as outras tabelas necessárias se não existirem
CREATE TABLE IF NOT EXISTS public.wods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  warmup JSONB,
  main JSONB,
  cooldown JSONB,
  notes TEXT,
  equipment TEXT[],
  style TEXT,
  preset TEXT,
  load_recommendations JSONB,
  media TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0
);

-- Tabela de curtidas
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wod_id UUID REFERENCES public.wods(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, wod_id)
);

-- Tabela de comentários
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wod_id UUID REFERENCES public.wods(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de seguidores
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Habilitar RLS nas outras tabelas
ALTER TABLE public.wods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para as outras tabelas
-- WODs
DROP POLICY IF EXISTS "WODs are viewable by everyone" ON public.wods;
CREATE POLICY "WODs are viewable by everyone" ON public.wods FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create own WODs" ON public.wods;
CREATE POLICY "Users can create own WODs" ON public.wods FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own WODs" ON public.wods;
CREATE POLICY "Users can update own WODs" ON public.wods FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own WODs" ON public.wods;
CREATE POLICY "Users can delete own WODs" ON public.wods FOR DELETE USING (auth.uid() = user_id);

-- Likes
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own likes" ON public.likes;
CREATE POLICY "Users can manage own likes" ON public.likes FOR ALL USING (auth.uid() = user_id);

-- Comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Follows
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own follows" ON public.follows;
CREATE POLICY "Users can manage own follows" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_wods_user_id ON public.wods(user_id);
CREATE INDEX IF NOT EXISTS idx_wods_created_at ON public.wods(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_wod_id ON public.likes(wod_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_wod_id ON public.comments(wod_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

-- Se você já tem usuários cadastrados, criar perfis para eles
INSERT INTO public.profiles (id, name, email, username, created_at, updated_at)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', email),
  email,
  LOWER(REPLACE(COALESCE(raw_user_meta_data->>'full_name', SPLIT_PART(email, '@', 1)), ' ', '_')),
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ Migrações executadas com sucesso!';
  RAISE NOTICE '📊 Tabelas criadas/atualizadas: profiles, wods, likes, comments, follows';
  RAISE NOTICE '🔒 RLS e políticas configuradas';
  RAISE NOTICE '🎯 Triggers configurados para criar perfis automaticamente';
END $$;
