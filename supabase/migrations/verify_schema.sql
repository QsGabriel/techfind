-- =====================================================
-- VERIFICAÇÃO DO SCHEMA
-- Execute este script para verificar se tudo está correto
-- =====================================================

-- 1. Verificar se a tabela profile existe e tem a estrutura correta
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'profile'
ORDER BY ordinal_position;

-- 2. Verificar se as policies RLS estão ativas
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
WHERE tablename = 'profile';

-- 3. Verificar se o RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'profile';

-- 4. Testar se consegue inserir um perfil (descomente e ajuste os valores)
/*
INSERT INTO public.profile (id_auth, name, type, typepersonal, phone, date)
VALUES (
    auth.uid(), -- Pega o UUID do usuário logado
    'Teste',
    1,
    '12345678901',
    '11999999999',
    '1990-01-01'
);
*/

-- 5. Verificar registros existentes
SELECT COUNT(*) as total_profiles FROM public.profile;

-- 6. Verificar usuários no auth
SELECT COUNT(*) as total_users FROM auth.users;
