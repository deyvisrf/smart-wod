-- Script para verificar todas as tabelas do SmartWod
-- Execute este no Supabase SQL Editor para ver o status do banco

-- 1. VERIFICAR QUAIS TABELAS EXISTEM
SELECT 
    table_name,
    COUNT(*) as column_count
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
GROUP BY 
    table_name
ORDER BY 
    table_name;

-- 2. VERIFICAR ESTRUTURA DA TABELA PROFILES
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'profiles'
ORDER BY 
    ordinal_position;

-- 3. VERIFICAR ESTRUTURA DA TABELA WODS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'wods'
ORDER BY 
    ordinal_position;

-- 4. VERIFICAR ESTRUTURA DA TABELA LIKES
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'likes'
ORDER BY 
    ordinal_position;

-- 5. VERIFICAR ESTRUTURA DA TABELA COMMENTS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'comments'
ORDER BY 
    ordinal_position;

-- 6. VERIFICAR ESTRUTURA DA TABELA FOLLOWS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public' 
    AND table_name = 'follows'
ORDER BY 
    ordinal_position;

-- 7. CONTAR REGISTROS EM CADA TABELA
SELECT 
    'profiles' as table_name, 
    COUNT(*) as row_count 
FROM public.profiles
UNION ALL
SELECT 
    'wods' as table_name, 
    COUNT(*) as row_count 
FROM public.wods
UNION ALL
SELECT 
    'likes' as table_name, 
    COUNT(*) as row_count 
FROM public.likes
UNION ALL
SELECT 
    'comments' as table_name, 
    COUNT(*) as row_count 
FROM public.comments
UNION ALL
SELECT 
    'follows' as table_name, 
    COUNT(*) as row_count 
FROM public.follows;

-- 8. VERIFICAR POLÍTICAS RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, 
    policyname;

-- 9. VERIFICAR ÍNDICES
SELECT 
    tablename,
    indexname,
    indexdef
FROM 
    pg_indexes
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename,
    indexname;

-- 10. VERIFICAR FOREIGN KEYS
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;
