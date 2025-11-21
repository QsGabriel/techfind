# 🚀 Guia Rápido - Setup do Banco de Dados

## Passo 1: Configure as Variáveis de Ambiente

1. Abra o arquivo `.env` na raiz do projeto
2. Adicione suas credenciais do Supabase:

```env
PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### Como obter as credenciais:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `PUBLIC_SUPABASE_URL`
   - **anon/public key** → `PUBLIC_SUPABASE_ANON_KEY`

## Passo 2: Aplique a Migração

### Opção A: Via Dashboard (Mais Fácil) ✅

1. No Dashboard do Supabase, vá em **SQL Editor**
2. Abra o arquivo: `supabase/migrations/20250124_initial_schema.sql`
3. Copie todo o conteúdo
4. Cole no editor SQL
5. Clique em **RUN** ou pressione `Ctrl+Enter`
6. Aguarde a confirmação de sucesso

### Opção B: Via Supabase CLI

```powershell
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Linkar projeto (pegue o ref no dashboard)
supabase link --project-ref seu-project-ref

# Aplicar migração
supabase db push
```

## Passo 3: Verifique a Instalação

1. No Dashboard, vá em **Table Editor**
2. Você deve ver 4 tabelas:
   - ✅ profile
   - ✅ services
   - ✅ contracts
   - ✅ notifications

3. Ou execute o script de verificação:
   - Abra `supabase/migrations/verify_migration.sql`
   - Execute no SQL Editor
   - Verifique se todos os itens foram criados

## Passo 4: Teste a Aplicação

```powershell
# Instalar dependências (se ainda não instalou)
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Acesse: http://localhost:5173

## ✅ Checklist

- [ ] Projeto Supabase criado
- [ ] Variáveis de ambiente configuradas em `.env`
- [ ] Migração aplicada com sucesso
- [ ] 4 tabelas criadas no banco
- [ ] RLS habilitado em todas as tabelas
- [ ] Aplicação rodando sem erros

## 🆘 Problemas Comuns

### Erro: "PUBLIC_SUPABASE_URL is not exported"
**Solução:** Configure o arquivo `.env` com as credenciais corretas

### Erro: "relation already exists"
**Solução:** A tabela já existe. Você pode:
1. Ignorar (migração já foi aplicada)
2. Ou limpar o banco e aplicar novamente

### Erro: "permission denied"
**Solução:** Certifique-se de estar usando o SQL Editor como usuário admin

### Tabelas não aparecem no Table Editor
**Solução:** 
1. Recarregue a página
2. Verifique se a migração foi executada sem erros
3. Execute o script `verify_migration.sql`

## 📚 Próximos Passos

1. **Criar seu primeiro usuário:** Use o formulário de signup na aplicação
2. **Testar funcionalidades:** Crie perfis, serviços e contratos
3. **Personalizar:** Ajuste as políticas RLS conforme necessário
4. **Deploy:** Configure o ambiente de produção

## 💡 Dicas

- Use o **SQL Editor** para queries rápidas
- Explore o **Table Editor** para visualizar dados
- Configure **Email Templates** em Authentication → Email Templates
- Monitore logs em **Logs** → **API** para debug

## 🔗 Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Projeto no GitHub](https://github.com/QsGabriel/techfind)
