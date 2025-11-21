# Verificação e Correções - Sistema de Cadastro

## ✅ Correções Realizadas

### 1. Padronização do Nome da Coluna
- **Problema**: Inconsistência entre `typePersonal`, `type_personal` e `typepersonal`
- **Solução**: Padronizado para `typepersonal` (minúsculo, sem underscore) em todos os arquivos
- **Arquivos atualizados**:
  - `supabase/migrations/20250124_initial_schema.sql`
  - `src/routes/+page.server.ts`
  - `src/routes/components/Dialog.svelte`
  - `src/routes/setup-perfil/+page.server.ts`
  - `src/routes/setup-perfil/+page.svelte`
  - `src/routes/pv/+page.server.ts`
  - `supabase/migrations/seed_example.sql`

### 2. Correção do Campo CPF/CNPJ
- **Problema**: Formulário enviava CPF/CNPJ com pontuação (000.000.000-00)
- **Solução**: 
  - Campo visível mantém formatação para UX
  - Campo hidden `typepersonal` envia apenas números
  - Variável `cpfCnpjValue` armazena versão sem formatação

### 3. Logs Adicionados
- Adicionados logs detalhados no processo de signup:
  - Log dos dados antes de inserir
  - Log de sucesso com dados retornados
  - Log de erros com JSON completo

### 4. Arquivo de Verificação
- Criado `supabase/migrations/verify_schema.sql`
- Script para verificar:
  - Estrutura da tabela profile
  - Policies RLS ativas
  - Status do RLS
  - Total de perfis e usuários

## 🔍 Estrutura da Tabela Profile

```sql
CREATE TABLE public.profile (
    id BIGSERIAL PRIMARY KEY,
    id_auth UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type SMALLINT NOT NULL CHECK (type IN (1, 2)),
    typepersonal VARCHAR(14) NOT NULL,  -- ✓ Corrigido
    phone VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    age INTEGER,
    desc TEXT,
    caract TEXT,
    tags TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_auth)
);
```

## 🔐 Row Level Security (RLS)

As seguintes policies estão ativas na tabela `profile`:

1. **SELECT**: Todos podem ver perfis (público)
2. **INSERT**: Usuários podem criar apenas seu próprio perfil (`auth.uid() = id_auth`)
3. **UPDATE**: Usuários podem atualizar apenas seu próprio perfil
4. **DELETE**: Usuários podem deletar apenas seu próprio perfil

## 📋 Próximos Passos

### 1. Aplicar a Migration Atualizada

**Opção A - Resetar o banco (desenvolvimento)**:
```powershell
supabase db reset
```

**Opção B - Migração manual (produção)**:
1. Acesse o Dashboard do Supabase
2. Vá em SQL Editor
3. Execute:
```sql
-- Se a coluna já existe com nome errado
ALTER TABLE public.profile 
RENAME COLUMN "typePersonal" TO typepersonal;

-- OU se a coluna não existe
ALTER TABLE public.profile 
ADD COLUMN typepersonal VARCHAR(14) NOT NULL;
```

### 2. Verificar o Schema
Execute o script `verify_schema.sql` no SQL Editor do Supabase para verificar se tudo está correto.

### 3. Testar o Cadastro
1. Abra o console do navegador (F12)
2. Tente fazer um cadastro
3. Verifique os logs no terminal do servidor
4. Procure por mensagens como:
   - "Dados para inserir no profile:"
   - "Perfil criado com sucesso:"
   - "Erro ao criar perfil:"

### 4. Verificar Possíveis Problemas

#### Problema: RLS bloqueando INSERT
**Sintoma**: Erro de permissão ao inserir
**Solução**: Verificar se a policy de INSERT está correta:
```sql
-- Deve existir esta policy
SELECT * FROM pg_policies 
WHERE tablename = 'profile' 
AND cmd = 'INSERT';
```

#### Problema: Usuário não autenticado
**Sintoma**: `auth.uid()` retorna NULL
**Solução**: Garantir que o login foi feito antes do INSERT (já implementado no código)

#### Problema: Validação de dados
**Sintoma**: Erro de constraint
**Solução**: Verificar se todos os campos obrigatórios estão preenchidos

## 🧪 Como Testar

1. **Limpar dados antigos**:
```sql
DELETE FROM public.profile;
DELETE FROM auth.users;
```

2. **Fazer novo cadastro** pela interface

3. **Verificar se o perfil foi criado**:
```sql
SELECT * FROM public.profile;
```

4. **Verificar logs do servidor** no terminal

## 📝 Notas Importantes

- O PostgreSQL converte nomes de colunas para minúsculas quando não estão entre aspas duplas
- O Supabase JS Client é case-insensitive para nomes de colunas
- A coluna `typepersonal` aceita apenas números (validado no backend)
- O campo phone também deve conter apenas números
- O RLS está ativo e pode bloquear operações se não estiver autenticado
