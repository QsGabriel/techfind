-- =====================================================
-- DADOS DE EXEMPLO PARA TESTES (OPCIONAL)
-- =====================================================
-- ATENÇÃO: Este arquivo é apenas para ambiente de desenvolvimento/testes
-- NÃO execute em produção!
-- =====================================================

-- Nota: Para inserir dados de exemplo, você precisará primeiro criar
-- usuários através da autenticação do Supabase (supabase.auth.signUp)
-- Os IDs abaixo são exemplos e devem ser substituídos pelos UUIDs reais

-- =====================================================
-- EXEMPLOS DE INSERÇÃO (AJUSTE OS UUIDs)
-- =====================================================

-- Exemplo 1: Inserir perfil de prestador
/*
INSERT INTO public.profile (id_auth, name, type, typepersonal, phone, date, description, caract, tags)
VALUES (
    'uuid-do-usuario-1', -- Substituir pelo UUID real do auth.users
    'João Silva',
    1, -- Prestador
    '12345678901',
    '11987654321',
    '1990-01-15',
    'Desenvolvedor Full Stack com 10 anos de experiência',
    'Especialista em JavaScript, TypeScript, React, Node.js',
    'frontend-backend-fullstack-javascript-typescript-react-nodejs'
);
*/

-- Exemplo 2: Inserir perfil de cliente
/*
INSERT INTO public.profile (id_auth, name, type, typepersonal, phone, date, description, caract, tags)
VALUES (
    'uuid-do-usuario-2', -- Substituir pelo UUID real do auth.users
    'Maria Santos',
    2, -- Cliente
    '98765432100',
    '11912345678',
    '1985-05-20',
    'Empreendedora digital buscando desenvolvedores',
    'Procuro profissionais de qualidade',
    NULL
);
*/

-- Exemplo 3: Inserir serviço
/*
INSERT INTO public.services (id_user, titulo, descricao, preco)
VALUES (
    'uuid-do-usuario-1', -- UUID do prestador
    'Desenvolvimento de Website Responsivo',
    'Criação de website moderno e responsivo com React e TailwindCSS',
    2500.00
);
*/

-- Exemplo 4: Inserir contrato
/*
-- Primeiro, obtenha os IDs dos perfis
-- SELECT id, name FROM public.profile;

INSERT INTO public.contracts (id_creator, id_contratado, data_ini, prazo, objetivo, valor, assinatura_hash, status)
VALUES (
    1, -- ID do perfil do criador (cliente)
    2, -- ID do perfil do contratado (prestador)
    '2025-01-01',
    30, -- 30 dias
    'Desenvolvimento de plataforma de e-commerce',
    5000.00,
    'hash-exemplo-123456789', -- Hash da assinatura
    'ativo'
);
*/

-- Exemplo 5: Inserir notificação
/*
INSERT INTO public.notifications (id_contratado, contracts, mensagem, lida)
VALUES (
    2, -- ID do perfil do contratado
    1, -- ID do contrato
    'Você foi convidado para um novo contrato de desenvolvimento',
    false
);
*/

-- =====================================================
-- QUERIES ÚTEIS PARA TESTES
-- =====================================================

-- Listar todos os perfis com idade calculada
-- SELECT id, name, type, age, tags FROM public.profile ORDER BY created_at DESC;

-- Listar serviços com nome do prestador
/*
SELECT 
    s.id,
    s.titulo,
    s.preco,
    p.name as prestador_name
FROM public.services s
JOIN auth.users u ON s.id_user = u.id
JOIN public.profile p ON u.id = p.id_auth
ORDER BY s.criado_em DESC;
*/

-- Listar contratos usando a view
-- SELECT * FROM public.contracts_full ORDER BY created_at DESC;

-- Listar notificações usando a view
-- SELECT * FROM public.notifications_full WHERE lida = false ORDER BY created_at DESC;

-- Buscar prestadores por tags (exemplo: procurar fullstack)
-- SELECT id, name, tags FROM public.profile WHERE type = 1 AND tags ILIKE '%fullstack%';

-- Estatísticas do sistema
/*
SELECT 
    (SELECT COUNT(*) FROM public.profile WHERE type = 1) as total_prestadores,
    (SELECT COUNT(*) FROM public.profile WHERE type = 2) as total_clientes,
    (SELECT COUNT(*) FROM public.services) as total_servicos,
    (SELECT COUNT(*) FROM public.contracts) as total_contratos,
    (SELECT COUNT(*) FROM public.notifications WHERE lida = false) as notificacoes_nao_lidas;
*/

-- =====================================================
-- LIMPEZA (use com cuidado!)
-- =====================================================

-- Limpar todos os dados (ATENÇÃO: Remove todos os dados!)
/*
TRUNCATE TABLE public.notifications CASCADE;
TRUNCATE TABLE public.contracts CASCADE;
TRUNCATE TABLE public.services CASCADE;
TRUNCATE TABLE public.profile CASCADE;
*/

-- =====================================================
-- RESET COMPLETO (use com MUITO cuidado!)
-- =====================================================

-- Para remover todas as tabelas e recomeçar (APENAS EM DEV!)
/*
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.contracts CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.profile CASCADE;
DROP VIEW IF EXISTS public.contracts_full CASCADE;
DROP VIEW IF EXISTS public.notifications_full CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS calculate_age() CASCADE;
*/
