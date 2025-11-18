# 📊 Migrações do Banco de Dados - Techfind

Este diretório contém as migrações SQL para o banco de dados Supabase do projeto Techfind.

## 📁 Estrutura

```
supabase/
└── migrations/
    └── 20250124_initial_schema.sql - Schema inicial completo
```

## 🗃️ Schema do Banco de Dados

### Tabelas Principais

#### 1. **profile** - Perfis de Usuários
Armazena informações de clientes e prestadores de serviço.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGSERIAL | Identificador único |
| id_auth | UUID | Referência ao usuário autenticado |
| name | VARCHAR(255) | Nome completo |
| type | SMALLINT | 1=Prestador, 2=Cliente |
| typePersonal | VARCHAR(14) | CPF ou CNPJ |
| phone | VARCHAR(20) | Telefone |
| date | DATE | Data de nascimento/fundação |
| age | INTEGER | Idade (calculada automaticamente) |
| desc | TEXT | Descrição do perfil |
| caract | TEXT | Características profissionais |
| tags | TEXT | Tags separadas por hífen |

#### 2. **services** - Serviços Oferecidos
Catálogo de serviços dos prestadores.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGSERIAL | Identificador único |
| id_user | UUID | ID do prestador |
| titulo | VARCHAR(255) | Título do serviço |
| descricao | TEXT | Descrição detalhada |
| preco | DECIMAL(10,2) | Preço do serviço |
| criado_em | TIMESTAMP | Data de criação |

#### 3. **contracts** - Contratos
Contratos entre clientes e prestadores.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGSERIAL | Identificador único |
| id_creator | BIGINT | ID do criador do contrato |
| id_contratado | BIGINT | ID do prestador contratado |
| data_ini | DATE | Data de início |
| prazo | INTEGER | Prazo em dias |
| objetivo | TEXT | Objetivo do contrato |
| valor | DECIMAL(10,2) | Valor do contrato |
| assinatura_hash | TEXT | Hash da assinatura digital |
| status | VARCHAR(50) | Status do contrato |

#### 4. **notifications** - Notificações
Sistema de notificações para contratos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | BIGSERIAL | Identificador único |
| id_contratado | BIGINT | ID do destinatário |
| contracts | BIGINT | ID do contrato |
| mensagem | TEXT | Mensagem da notificação |
| lida | BOOLEAN | Status de leitura |

## 🔒 Segurança (Row Level Security)

Todas as tabelas possuem políticas RLS configuradas:

- ✅ **profile**: Usuários podem gerenciar apenas seu próprio perfil
- ✅ **services**: Usuários podem gerenciar apenas seus próprios serviços
- ✅ **contracts**: Usuários veem apenas contratos onde participam
- ✅ **notifications**: Usuários veem apenas suas próprias notificações

## 🚀 Como Aplicar as Migrações

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Copie o conteúdo do arquivo `20250124_initial_schema.sql`
5. Cole no editor e clique em **RUN**

### Opção 2: Via CLI do Supabase

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Linkar com seu projeto
supabase link --project-ref your-project-ref

# Aplicar migrações
supabase db push
```

### Opção 3: Manualmente via psql

```bash
psql -h db.your-project.supabase.co -U postgres -d postgres -f supabase/migrations/20250124_initial_schema.sql
```

## ✨ Funcionalidades Incluídas

### Triggers Automáticos
- ✅ Atualização automática do campo `updated_at`
- ✅ Cálculo automático da idade baseado na data de nascimento

### Views Úteis
- 📊 `contracts_full` - Contratos com informações completas
- 📊 `notifications_full` - Notificações com detalhes

### Índices Otimizados
- 🚀 Busca por tags (GIN index)
- 🚀 Filtros por tipo de usuário
- 🚀 Ordenação por data

## 📝 Notas Importantes

1. **Backup**: Sempre faça backup antes de aplicar migrações em produção
2. **Ordem**: As migrações devem ser aplicadas na ordem dos timestamps
3. **Extensões**: Certifique-se que as extensões `uuid-ossp` e `pgcrypto` estão habilitadas
4. **Permissões**: As políticas RLS garantem segurança dos dados

## 🔄 Próximas Migrações

Para criar novas migrações:

1. Crie um novo arquivo com timestamp: `YYYYMMDD_description.sql`
2. Adicione as alterações SQL
3. Teste em ambiente de desenvolvimento
4. Aplique em produção

## 🆘 Problemas Comuns

### Erro: "relation already exists"
- Já existe uma tabela com esse nome
- Solução: Limpar o banco ou usar `IF NOT EXISTS`

### Erro: "permission denied"
- Usuário sem permissões adequadas
- Solução: Executar como superusuário ou ajustar políticas RLS

### Erro: "violates row-level security policy"
- Política RLS bloqueando a operação
- Solução: Verificar as políticas e autenticação do usuário

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
