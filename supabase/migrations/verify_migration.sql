# =====================================================
# SCRIPT DE VERIFICAÇÃO DA MIGRAÇÃO
# Use este script para verificar se a migração foi aplicada corretamente
# =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profile', 'services', 'contracts', 'notifications')
ORDER BY tablename;

-- Verificar colunas da tabela profile
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profile'
ORDER BY ordinal_position;

-- Verificar colunas da tabela services
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'services'
ORDER BY ordinal_position;

-- Verificar colunas da tabela contracts
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'contracts'
ORDER BY ordinal_position;

-- Verificar colunas da tabela notifications
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'notifications'
ORDER BY ordinal_position;

-- Verificar índices criados
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('profile', 'services', 'contracts', 'notifications')
ORDER BY tablename, indexname;

-- Verificar triggers criados
SELECT 
    trigger_name,
    event_object_table,
    action_statement,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table IN ('profile', 'services', 'contracts', 'notifications')
ORDER BY event_object_table, trigger_name;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profile', 'services', 'contracts', 'notifications')
ORDER BY tablename, policyname;

-- Verificar views criadas
SELECT 
    schemaname,
    viewname,
    viewowner
FROM pg_views
WHERE schemaname = 'public'
AND viewname IN ('contracts_full', 'notifications_full')
ORDER BY viewname;

-- Verificar foreign keys
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN ('profile', 'services', 'contracts', 'notifications')
ORDER BY tc.table_name, kcu.column_name;

-- Contar registros em cada tabela (deve ser 0 após migração inicial)
SELECT 'profile' as tabela, COUNT(*) as total FROM public.profile
UNION ALL
SELECT 'services' as tabela, COUNT(*) as total FROM public.services
UNION ALL
SELECT 'contracts' as tabela, COUNT(*) as total FROM public.contracts
UNION ALL
SELECT 'notifications' as tabela, COUNT(*) as total FROM public.notifications;

-- Verificar se RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profile', 'services', 'contracts', 'notifications')
ORDER BY tablename;

-- =====================================================
-- RESULTADO ESPERADO:
-- ✅ 4 tabelas criadas (profile, services, contracts, notifications)
-- ✅ Todos os índices criados
-- ✅ 4 triggers para updated_at
-- ✅ 1 trigger para calcular idade
-- ✅ Múltiplas políticas RLS por tabela
-- ✅ 2 views (contracts_full, notifications_full)
-- ✅ RLS habilitado em todas as tabelas
-- =====================================================
