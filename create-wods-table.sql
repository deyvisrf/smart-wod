-- ========================================
-- CRIAÇÃO DA TABELA WODS
-- ========================================

-- Criar tabela wods se não existir
CREATE TABLE IF NOT EXISTS public.wods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    level TEXT DEFAULT 'Intermediário',
    duration_minutes INTEGER,
    warmup JSONB,
    main JSONB NOT NULL,
    cooldown JSONB,
    notes TEXT,
    equipment TEXT[] DEFAULT '{}',
    style TEXT,
    preset TEXT,
    load_recommendations JSONB,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_wods_user_id ON public.wods(user_id);
CREATE INDEX IF NOT EXISTS idx_wods_created_at ON public.wods(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wods_title ON public.wods USING gin(to_tsvector('portuguese', title));

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.wods ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver todos os WODs públicos
CREATE POLICY IF NOT EXISTS "WODs são visíveis para todos" ON public.wods
    FOR SELECT USING (true);

-- Política: Usuários podem criar seus próprios WODs
CREATE POLICY IF NOT EXISTS "Usuários podem criar WODs próprios" ON public.wods
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem editar seus próprios WODs
CREATE POLICY IF NOT EXISTS "Usuários podem editar WODs próprios" ON public.wods
    FOR UPDATE USING (auth.uid() = user_id);

-- Política: Usuários podem deletar seus próprios WODs
CREATE POLICY IF NOT EXISTS "Usuários podem deletar WODs próprios" ON public.wods
    FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_wods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_wods_updated_at ON public.wods;
CREATE TRIGGER trigger_update_wods_updated_at
    BEFORE UPDATE ON public.wods
    FOR EACH ROW
    EXECUTE FUNCTION update_wods_updated_at();

-- Inserir alguns WODs de exemplo (opcional)
INSERT INTO public.wods (title, level, duration_minutes, main, equipment, style, user_id) VALUES
(
    'WOD Iniciante - AMRAP 15 min',
    'Iniciante',
    15,
    '{"title": "AMRAP 15 min", "items": ["10 air squats", "5 push-ups", "10 mountain climbers"]}',
    ARRAY['Livre'],
    'AMRAP',
    (SELECT id FROM auth.users LIMIT 1)
) ON CONFLICT DO NOTHING;

-- Verificar se a tabela foi criada
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'wods' 
ORDER BY ordinal_position;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'wods';
