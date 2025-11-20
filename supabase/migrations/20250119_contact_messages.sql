-- =====================================================
-- TECHFIND - MIGRATION PARA MENSAGENS DE CONTATO
-- Data: 2025-11-19
-- Descrição: Tabela para armazenar mensagens de contato do suporte
-- =====================================================

-- =====================================================
-- TABELA: contact_messages
-- Descrição: Armazena mensagens enviadas através do formulário de contato
-- =====================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id BIGSERIAL PRIMARY KEY,
    id_user UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente', -- pendente, em_atendimento, resolvido
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Índices para melhor performance
CREATE INDEX idx_contact_messages_id_user ON public.contact_messages(id_user);
CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Comentários
COMMENT ON TABLE public.contact_messages IS 'Mensagens enviadas através do formulário de contato';
COMMENT ON COLUMN public.contact_messages.status IS 'pendente = aguardando resposta, em_atendimento = sendo atendido, resolvido = finalizado';
COMMENT ON COLUMN public.contact_messages.id_user IS 'Referência ao usuário logado (opcional para usuários não autenticados)';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON public.contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS na tabela
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode criar mensagens de contato (mesmo não autenticada)
CREATE POLICY "Qualquer pessoa pode enviar mensagens de contato"
    ON public.contact_messages
    FOR INSERT
    WITH CHECK (true);

-- Usuários podem ver apenas suas próprias mensagens
CREATE POLICY "Usuários veem suas próprias mensagens"
    ON public.contact_messages
    FOR SELECT
    USING (
        auth.uid() = id_user
        OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Usuários podem atualizar suas próprias mensagens
CREATE POLICY "Usuários podem atualizar suas mensagens"
    ON public.contact_messages
    FOR UPDATE
    USING (
        auth.uid() = id_user
        OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- =====================================================
-- PERMISSÕES
-- =====================================================

GRANT SELECT, INSERT ON public.contact_messages TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.contact_messages_id_seq TO anon, authenticated;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
