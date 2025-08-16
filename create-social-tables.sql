-- Script para criar as tabelas sociais do SmartWod
-- Execute este no Supabase SQL Editor

-- Criar tabela de WODs se não existir
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

-- Criar tabela de likes se não existir
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wod_id UUID REFERENCES public.wods(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, wod_id)
);

-- Criar tabela de comentários se não existir
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wod_id UUID REFERENCES public.wods(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de seguidores se não existir
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Habilitar RLS
ALTER TABLE public.wods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Políticas para WODs
DROP POLICY IF EXISTS "WODs are viewable by everyone" ON public.wods;
CREATE POLICY "WODs are viewable by everyone" ON public.wods FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create own WODs" ON public.wods;
CREATE POLICY "Users can create own WODs" ON public.wods FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own WODs" ON public.wods;
CREATE POLICY "Users can update own WODs" ON public.wods FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own WODs" ON public.wods;
CREATE POLICY "Users can delete own WODs" ON public.wods FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Likes
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own likes" ON public.likes;
CREATE POLICY "Users can manage own likes" ON public.likes FOR ALL USING (auth.uid() = user_id);

-- Políticas para Comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Políticas para Follows
DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own follows" ON public.follows;
CREATE POLICY "Users can manage own follows" ON public.follows FOR ALL USING (auth.uid() = follower_id);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_wods_user_id ON public.wods(user_id);
CREATE INDEX IF NOT EXISTS idx_wods_created_at ON public.wods(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_wod_id ON public.likes(wod_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_wod_id ON public.comments(wod_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON public.follows(following_id);

-- Criar alguns WODs de exemplo para teste
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
    
    RAISE NOTICE '✅ WODs de exemplo criados com sucesso!';
  END IF;
END $$;

-- Verificar se tudo foi criado
DO $$
DECLARE
  wod_count INTEGER;
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO wod_count FROM public.wods;
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  
  RAISE NOTICE '📊 Status do banco:';
  RAISE NOTICE '   - Perfis: % usuários', profile_count;
  RAISE NOTICE '   - WODs: % treinos', wod_count;
  RAISE NOTICE '✅ Tabelas sociais criadas com sucesso!';
END $$;
