-- Script completo para criar/corrigir TODAS as tabelas do SmartWod
-- Execute este no Supabase SQL Editor

-- ============================================
-- 1. EXTENSÕES NECESSÁRIAS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. TABELA PROFILES (com todas as colunas necessárias)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
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

-- Adicionar colunas faltantes na tabela profiles (se existir)
DO $$ 
BEGIN
    -- email
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
    
    -- username
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'username') THEN
        ALTER TABLE public.profiles ADD COLUMN username TEXT;
    END IF;
    
    -- website
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'website') THEN
        ALTER TABLE public.profiles ADD COLUMN website TEXT;
    END IF;
    
    -- is_premium
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'is_premium') THEN
        ALTER TABLE public.profiles ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
    
    -- followers_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'followers_count') THEN
        ALTER TABLE public.profiles ADD COLUMN followers_count INTEGER DEFAULT 0;
    END IF;
    
    -- following_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'following_count') THEN
        ALTER TABLE public.profiles ADD COLUMN following_count INTEGER DEFAULT 0;
    END IF;
    
    -- wods_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'profiles' 
                   AND column_name = 'wods_count') THEN
        ALTER TABLE public.profiles ADD COLUMN wods_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- ============================================
-- 3. TABELA WODS
-- ============================================
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

-- ============================================
-- 4. TABELA LIKES
-- ============================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wod_id UUID REFERENCES public.wods(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, wod_id)
);

-- ============================================
-- 5. TABELA COMMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wod_id UUID REFERENCES public.wods(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TABELA FOLLOWS
-- ============================================
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- ============================================
-- 7. TABELA GROUPS (opcional)
-- ============================================
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  members_count INTEGER DEFAULT 1
);

-- ============================================
-- 8. TABELA CHALLENGES (opcional)
-- ============================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  goal TEXT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  participants_count INTEGER DEFAULT 1
);

-- ============================================
-- 9. TABELA MESSAGES (opcional)
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- ============================================
-- 10. HABILITAR RLS EM TODAS AS TABELAS
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 11. POLÍTICAS RLS PARA PROFILES
-- ============================================
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create own profile" ON public.profiles;
CREATE POLICY "Users can create own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- ============================================
-- 12. POLÍTICAS RLS PARA WODS
-- ============================================
DROP POLICY IF EXISTS "WODs are viewable by everyone" ON public.wods;
CREATE POLICY "WODs are viewable by everyone" 
ON public.wods FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create own WODs" ON public.wods;
CREATE POLICY "Users can create own WODs" 
ON public.wods FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own WODs" ON public.wods;
CREATE POLICY "Users can update own WODs" 
ON public.wods FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own WODs" ON public.wods;
CREATE POLICY "Users can delete own WODs" 
ON public.wods FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- 13. POLÍTICAS RLS PARA LIKES
-- ============================================
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can manage own likes" ON public.likes;
CREATE POLICY "Users can manage own likes" 
ON public.likes FOR ALL 
USING (auth.uid() = user_id);

-- ============================================
-- 14. POLÍTICAS RLS PARA COMMENTS
-- ============================================
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- 15. POLÍTICAS RLS PARA FOLLOWS
-- ============================================
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
CREATE POLICY "Follows are viewable by everyone" 
ON public.follows FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can manage own follows" ON public.follows;
CREATE POLICY "Users can manage own follows" 
ON public.follows FOR ALL 
USING (auth.uid() = follower_id);

-- ============================================
-- 16. CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_wods_user_id ON public.wods(user_id);
CREATE INDEX IF NOT EXISTS idx_wods_created_at ON public.wods(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_wod_id ON public.likes(wod_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_wod_id ON public.comments(wod_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);
CREATE INDEX IF NOT EXISTS idx_messages_from_user_id ON public.messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user_id ON public.messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- ============================================
-- 17. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email,
    name, 
    username,
    avatar_url,
    created_at, 
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    LOWER(REPLACE(COALESCE(new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1)), ' ', '_')),
    new.raw_user_meta_data->>'avatar_url',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url
  WHERE public.profiles.email IS NULL OR public.profiles.username IS NULL;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 18. TRIGGER PARA CRIAR PERFIL
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 19. FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- 20. TRIGGERS PARA ATUALIZAR updated_at
-- ============================================
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wods_updated_at ON public.wods;
CREATE TRIGGER update_wods_updated_at 
BEFORE UPDATE ON public.wods 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON public.comments;
CREATE TRIGGER update_comments_updated_at 
BEFORE UPDATE ON public.comments 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_groups_updated_at ON public.groups;
CREATE TRIGGER update_groups_updated_at 
BEFORE UPDATE ON public.groups 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_challenges_updated_at ON public.challenges;
CREATE TRIGGER update_challenges_updated_at 
BEFORE UPDATE ON public.challenges 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 21. CRIAR PERFIS PARA USUÁRIOS EXISTENTES
-- ============================================
INSERT INTO public.profiles (
    id, 
    email,
    name, 
    username,
    avatar_url,
    created_at, 
    updated_at
)
SELECT 
    u.id,
    u.email,
    COALESCE(u.raw_user_meta_data->>'full_name', u.email),
    LOWER(REPLACE(COALESCE(u.raw_user_meta_data->>'full_name', SPLIT_PART(u.email, '@', 1)), ' ', '_')),
    u.raw_user_meta_data->>'avatar_url',
    u.created_at,
    u.updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- ============================================
-- 22. CRIAR WODS DE EXEMPLO (se não existir nenhum)
-- ============================================
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Pegar o primeiro usuário que existe
  SELECT id INTO v_user_id FROM public.profiles LIMIT 1;
  
  -- Só criar se encontrou um usuário e não existem WODs
  IF v_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.wods LIMIT 1) THEN
    INSERT INTO public.wods (user_id, title, warmup, main, cooldown, notes, style, created_at)
    VALUES 
    (
      v_user_id,
      'AMRAP 20min - Full Body',
      '{"exercises": ["5 min bike", "Dynamic stretching", "3 rounds: 10 air squats, 10 push-ups, 10 sit-ups"]}'::jsonb,
      '{"type": "AMRAP", "duration": "20 minutes", "exercises": ["5 Pull-ups", "10 Push-ups", "15 Air Squats"]}'::jsonb,
      '{"exercises": ["5 min walk", "Static stretching", "Foam rolling"]}'::jsonb,
      'Classic CrossFit workout. Scale as needed.',
      'AMRAP',
      NOW() - INTERVAL '2 days'
    ),
    (
      v_user_id,
      'EMOM 12min - Strength Focus',
      '{"exercises": ["Row 500m", "Mobility work", "Barbell warm-up"]}'::jsonb,
      '{"type": "EMOM", "duration": "12 minutes", "exercises": ["Min 1: 5 Deadlifts @ 70%", "Min 2: 10 Box Jumps", "Min 3: 15 Wall Balls"]}'::jsonb,
      '{"exercises": ["Cool down walk", "Stretching"]}'::jsonb,
      'Focus on form over speed.',
      'EMOM',
      NOW() - INTERVAL '1 day'
    ),
    (
      v_user_id,
      'For Time - Cardio Blast',
      '{"exercises": ["Jump rope 3 min", "Dynamic warm-up"]}'::jsonb,
      '{"type": "For Time", "exercises": ["21-15-9", "Burpees", "Thrusters (45/35 lbs)", "Box Jumps (24/20 in)"]}'::jsonb,
      '{"exercises": ["Light jog", "Full body stretch"]}'::jsonb,
      'Target time: 12-15 minutes',
      'For Time',
      NOW()
    );
  END IF;
END $$;

-- ============================================
-- 23. RELATÓRIO FINAL
-- ============================================
DO $$
DECLARE
  profile_count INTEGER;
  wod_count INTEGER;
  like_count INTEGER;
  comment_count INTEGER;
  follow_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO wod_count FROM public.wods;
  SELECT COUNT(*) INTO like_count FROM public.likes;
  SELECT COUNT(*) INTO comment_count FROM public.comments;
  SELECT COUNT(*) INTO follow_count FROM public.follows;
  
  RAISE NOTICE '';
  RAISE NOTICE '=========================================';
  RAISE NOTICE '✅ BANCO DE DADOS CONFIGURADO COM SUCESSO!';
  RAISE NOTICE '=========================================';
  RAISE NOTICE '📊 Status das tabelas:';
  RAISE NOTICE '   - Profiles: % usuários', profile_count;
  RAISE NOTICE '   - WODs: % treinos', wod_count;
  RAISE NOTICE '   - Likes: % curtidas', like_count;
  RAISE NOTICE '   - Comments: % comentários', comment_count;
  RAISE NOTICE '   - Follows: % seguidores', follow_count;
  RAISE NOTICE '';
  RAISE NOTICE '✅ Todas as tabelas criadas';
  RAISE NOTICE '✅ Políticas RLS configuradas';
  RAISE NOTICE '✅ Índices criados';
  RAISE NOTICE '✅ Triggers configurados';
  RAISE NOTICE '✅ WODs de exemplo criados (se aplicável)';
  RAISE NOTICE '=========================================';
END $$;
