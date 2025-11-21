-- =====================================================
-- TECHFIND - MIGRATION INICIAL
-- Data: 2025-10-24
-- Descrição: Schema completo do banco de dados
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: profile
-- Descrição: Armazena perfis de usuários (clientes e prestadores)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profile (
    id BIGSERIAL PRIMARY KEY,
    id_auth UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type SMALLINT NOT NULL CHECK (type IN (1, 2)), -- 1: Prestador, 2: Cliente
    typepersonal VARCHAR(14) NOT NULL, -- CPF (11) ou CNPJ (14)
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL, -- Data de nascimento ou fundação
    age INTEGER, -- Idade calculada
    description TEXT, -- Descrição do perfil
    caract TEXT, -- Características profissionais
    tags TEXT, -- Tags separadas por hífen (ex: "frontend-backend-fullstack")
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_auth)
);

-- Índices para melhor performance
CREATE INDEX idx_profile_id_auth ON public.profile(id_auth);
CREATE INDEX idx_profile_type ON public.profile(type);
CREATE INDEX idx_profile_tags ON public.profile USING gin(to_tsvector('portuguese', COALESCE(tags, '')));

-- Comentários
COMMENT ON TABLE public.profile IS 'Perfis de usuários do sistema';
COMMENT ON COLUMN public.profile.type IS '1 = Prestador de serviço, 2 = Cliente';
COMMENT ON COLUMN public.profile.typepersonal IS 'CPF (11 dígitos) ou CNPJ (14 dígitos)';

-- =====================================================
-- TABELA: services
-- Descrição: Serviços oferecidos pelos prestadores
-- =====================================================
CREATE TABLE IF NOT EXISTS public.services (
    id BIGSERIAL PRIMARY KEY,
    id_user UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL CHECK (preco > 0),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_services_id_user ON public.services(id_user);
CREATE INDEX idx_services_criado_em ON public.services(criado_em DESC);

-- Comentários
COMMENT ON TABLE public.services IS 'Serviços oferecidos pelos prestadores';
COMMENT ON COLUMN public.services.preco IS 'Preço do serviço em formato decimal';

-- =====================================================
-- TABELA: contracts
-- Descrição: Contratos entre clientes e prestadores
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contracts (
    id BIGSERIAL PRIMARY KEY,
    id_creator BIGINT NOT NULL REFERENCES public.profile(id) ON DELETE CASCADE,
    id_contratado BIGINT REFERENCES public.profile(id) ON DELETE SET NULL,
    data_ini DATE NOT NULL, -- Data de início do contrato
    prazo INTEGER NOT NULL CHECK (prazo > 0), -- Prazo em dias
    objetivo TEXT NOT NULL, -- Objetivo do contrato
    valor DECIMAL(10, 2) NOT NULL CHECK (valor > 0), -- Valor do contrato
    assinatura_hash TEXT NOT NULL, -- Hash da assinatura digital
    status VARCHAR(50) DEFAULT 'pendente', -- pendente, ativo, concluido, cancelado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_contracts_id_creator ON public.contracts(id_creator);
CREATE INDEX idx_contracts_id_contratado ON public.contracts(id_contratado);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_contracts_created_at ON public.contracts(created_at DESC);

-- Comentários
COMMENT ON TABLE public.contracts IS 'Contratos entre clientes e prestadores de serviço';
COMMENT ON COLUMN public.contracts.prazo IS 'Prazo do contrato em dias';
COMMENT ON COLUMN public.contracts.assinatura_hash IS 'Hash criptográfico da assinatura digital';

-- =====================================================
-- TABELA: notifications
-- Descrição: Notificações de contratos para prestadores
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    id_contratado BIGINT NOT NULL REFERENCES public.profile(id) ON DELETE CASCADE,
    contracts BIGINT NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    mensagem TEXT,
    lida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_contratado, contracts)
);

-- Índices
CREATE INDEX idx_notifications_id_contratado ON public.notifications(id_contratado);
CREATE INDEX idx_notifications_contracts ON public.notifications(contracts);
CREATE INDEX idx_notifications_lida ON public.notifications(lida);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Comentários
COMMENT ON TABLE public.notifications IS 'Notificações de novos contratos para prestadores';
COMMENT ON COLUMN public.notifications.lida IS 'Indica se a notificação foi lida';

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profile_updated_at
    BEFORE UPDATE ON public.profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON public.contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular idade automaticamente
CREATE OR REPLACE FUNCTION calculate_age()
RETURNS TRIGGER AS $$
BEGIN
    NEW.age = EXTRACT(YEAR FROM AGE(NEW.date));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular idade
CREATE TRIGGER calculate_profile_age
    BEFORE INSERT OR UPDATE OF date ON public.profile
    FOR EACH ROW
    EXECUTE FUNCTION calculate_age();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS - PROFILE
-- =====================================================

-- Usuários podem ver todos os perfis públicos
CREATE POLICY "Perfis são visíveis publicamente"
    ON public.profile
    FOR SELECT
    USING (true);

-- Usuários podem inserir apenas seu próprio perfil
CREATE POLICY "Usuários podem criar seu próprio perfil"
    ON public.profile
    FOR INSERT
    WITH CHECK (auth.uid() = id_auth);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
    ON public.profile
    FOR UPDATE
    USING (auth.uid() = id_auth)
    WITH CHECK (auth.uid() = id_auth);

-- Usuários podem deletar apenas seu próprio perfil
CREATE POLICY "Usuários podem deletar seu próprio perfil"
    ON public.profile
    FOR DELETE
    USING (auth.uid() = id_auth);

-- =====================================================
-- POLÍTICAS RLS - SERVICES
-- =====================================================

-- Todos podem ver os serviços
CREATE POLICY "Serviços são visíveis publicamente"
    ON public.services
    FOR SELECT
    USING (true);

-- Usuários podem criar seus próprios serviços
CREATE POLICY "Usuários podem criar seus próprios serviços"
    ON public.services
    FOR INSERT
    WITH CHECK (auth.uid() = id_user);

-- Usuários podem atualizar seus próprios serviços
CREATE POLICY "Usuários podem atualizar seus próprios serviços"
    ON public.services
    FOR UPDATE
    USING (auth.uid() = id_user)
    WITH CHECK (auth.uid() = id_user);

-- Usuários podem deletar seus próprios serviços
CREATE POLICY "Usuários podem deletar seus próprios serviços"
    ON public.services
    FOR DELETE
    USING (auth.uid() = id_user);

-- =====================================================
-- POLÍTICAS RLS - CONTRACTS
-- =====================================================

-- Usuários podem ver contratos onde são criadores ou contratados
CREATE POLICY "Usuários veem seus próprios contratos"
    ON public.contracts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profile
            WHERE profile.id_auth = auth.uid()
            AND (profile.id = contracts.id_creator OR profile.id = contracts.id_contratado)
        )
    );

-- Usuários podem criar contratos
CREATE POLICY "Usuários podem criar contratos"
    ON public.contracts
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profile
            WHERE profile.id_auth = auth.uid()
            AND profile.id = id_creator
        )
    );

-- Usuários podem atualizar contratos onde são contratados (para aceitar)
CREATE POLICY "Usuários podem atualizar contratos"
    ON public.contracts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profile
            WHERE profile.id_auth = auth.uid()
            AND (profile.id = contracts.id_creator OR profile.id = contracts.id_contratado)
        )
    );

-- Apenas criadores podem deletar contratos
CREATE POLICY "Criadores podem deletar contratos"
    ON public.contracts
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profile
            WHERE profile.id_auth = auth.uid()
            AND profile.id = contracts.id_creator
        )
    );

-- =====================================================
-- POLÍTICAS RLS - NOTIFICATIONS
-- =====================================================

-- Usuários veem apenas suas próprias notificações
CREATE POLICY "Usuários veem suas próprias notificações"
    ON public.notifications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profile
            WHERE profile.id_auth = auth.uid()
            AND profile.id = notifications.id_contratado
        )
    );

-- Sistema pode criar notificações
CREATE POLICY "Sistema pode criar notificações"
    ON public.notifications
    FOR INSERT
    WITH CHECK (true);

-- Usuários podem atualizar suas notificações (marcar como lida)
CREATE POLICY "Usuários podem atualizar suas notificações"
    ON public.notifications
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profile
            WHERE profile.id_auth = auth.uid()
            AND profile.id = notifications.id_contratado
        )
    );

-- Usuários podem deletar suas notificações
CREATE POLICY "Usuários podem deletar suas notificações"
    ON public.notifications
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profile
            WHERE profile.id_auth = auth.uid()
            AND profile.id = notifications.id_contratado
        )
    );

-- =====================================================
-- DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- Você pode adicionar dados de exemplo aqui se necessário
-- INSERT INTO public.profile (...) VALUES (...);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para contratos com informações completas
CREATE OR REPLACE VIEW public.contracts_full AS
SELECT 
    c.*,
    creator.name as creator_name,
    creator.phone as creator_phone,
    creator.type as creator_type,
    contracted.name as contracted_name,
    contracted.phone as contracted_phone,
    contracted.type as contracted_type
FROM public.contracts c
LEFT JOIN public.profile creator ON c.id_creator = creator.id
LEFT JOIN public.profile contracted ON c.id_contratado = contracted.id;

-- View para notificações com detalhes
CREATE OR REPLACE VIEW public.notifications_full AS
SELECT 
    n.*,
    p.name as contratado_name,
    p.phone as contratado_phone,
    c.objetivo as contract_objetivo,
    c.valor as contract_valor,
    c.prazo as contract_prazo
FROM public.notifications n
JOIN public.profile p ON n.id_contratado = p.id
JOIN public.contracts c ON n.contracts = c.id;

-- =====================================================
-- PERMISSÕES
-- =====================================================

-- Conceder permissões adequadas
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
