-- Adicionar colunas que faltam na tabela wods
ALTER TABLE public.wods 
ADD COLUMN level TEXT,
ADD COLUMN duration_minutes INTEGER,
ADD COLUMN warmup_data JSONB,
ADD COLUMN main_data JSONB,
ADD COLUMN cooldown_data JSONB;

-- Migrar dados existentes (se houver)
UPDATE public.wods 
SET 
  warmup_data = warmup,
  main_data = main,
  cooldown_data = cooldown
WHERE warmup IS NOT NULL OR main IS NOT NULL OR cooldown IS NOT NULL;

-- Opcional: remover colunas antigas se preferir usar as novas
-- ALTER TABLE public.wods DROP COLUMN warmup, DROP COLUMN main, DROP COLUMN cooldown;
