# 📊 Diagrama do Banco de Dados

## Diagrama ER (Entity Relationship)

```mermaid
erDiagram
    AUTH_USERS ||--o{ PROFILE : "has"
    AUTH_USERS ||--o{ SERVICES : "creates"
    PROFILE ||--o{ CONTRACTS_CREATOR : "creates"
    PROFILE ||--o{ CONTRACTS_CONTRACTED : "receives"
    PROFILE ||--o{ NOTIFICATIONS : "receives"
    CONTRACTS ||--o{ NOTIFICATIONS : "generates"

    AUTH_USERS {
        uuid id PK
        string email
        timestamp created_at
    }

    PROFILE {
        bigint id PK
        uuid id_auth FK
        string name
        smallint type "1=Prestador, 2=Cliente"
        string typePersonal "CPF/CNPJ"
        string phone
        date date "nascimento/fundação"
        int age "calculado automaticamente"
        text desc
        text caract
        text tags
        timestamp created_at
        timestamp updated_at
    }

    SERVICES {
        bigint id PK
        uuid id_user FK
        string titulo
        text descricao
        decimal preco
        timestamp criado_em
        timestamp atualizado_em
    }

    CONTRACTS {
        bigint id PK
        bigint id_creator FK
        bigint id_contratado FK
        date data_ini
        int prazo "dias"
        text objetivo
        decimal valor
        text assinatura_hash
        string status
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATIONS {
        bigint id PK
        bigint id_contratado FK
        bigint contracts FK
        text mensagem
        boolean lida
        timestamp created_at
    }
```

## Fluxo de Dados

```mermaid
graph TB
    A[Usuário faz Signup] --> B[auth.users criado]
    B --> C[Trigger cria Profile]
    
    D[Prestador] --> E[Cria Services]
    
    F[Cliente] --> G[Busca com IA]
    G --> H[Encontra Prestadores]
    H --> I[Cria Contract]
    I --> J[Gera Notification]
    J --> K[Prestador recebe]
    K --> L[Assina Contract]
    L --> M[Contract ativo]
```

## Políticas RLS

```mermaid
graph LR
    A[Usuário autenticado] --> B{Ação}
    
    B -->|SELECT| C[Visualizar]
    C -->|Profile| D[Todos públicos]
    C -->|Services| D
    C -->|Contracts| E[Apenas os seus]
    C -->|Notifications| E
    
    B -->|INSERT| F[Criar]
    F -->|Profile| G[Apenas o seu]
    F -->|Services| G
    F -->|Contracts| H[Se é creator]
    F -->|Notifications| I[Sistema]
    
    B -->|UPDATE| J[Atualizar]
    J -->|Profile| G
    J -->|Services| G
    J -->|Contracts| K[Se participa]
    J -->|Notifications| E
    
    B -->|DELETE| L[Deletar]
    L -->|Profile| G
    L -->|Services| G
    L -->|Contracts| M[Se é creator]
    L -->|Notifications| E
```

## Índices e Performance

| Tabela | Índice | Tipo | Objetivo |
|--------|--------|------|----------|
| profile | id_auth | B-tree | Busca rápida por usuário |
| profile | type | B-tree | Filtrar por tipo |
| profile | tags | GIN | Busca full-text em tags |
| services | id_user | B-tree | Listar serviços do usuário |
| services | criado_em | B-tree | Ordenação cronológica |
| contracts | id_creator | B-tree | Contratos criados |
| contracts | id_contratado | B-tree | Contratos recebidos |
| contracts | status | B-tree | Filtrar por status |
| notifications | id_contratado | B-tree | Notificações do usuário |
| notifications | lida | B-tree | Filtrar não lidas |

## Triggers Automáticos

```mermaid
graph LR
    A[INSERT/UPDATE] --> B{Tabela}
    
    B -->|Profile| C[calculate_age]
    C --> D[Calcula idade]
    
    B -->|Profile| E[update_updated_at]
    B -->|Services| E
    B -->|Contracts| E
    E --> F[Atualiza timestamp]
```

## Views Disponíveis

### contracts_full
Combina dados de contratos com perfis de criador e contratado.

```sql
SELECT c.*, 
       creator.name as creator_name,
       contracted.name as contracted_name
FROM contracts c
LEFT JOIN profile creator ON c.id_creator = creator.id
LEFT JOIN profile contracted ON c.id_contratado = contracted.id
```

### notifications_full
Combina notificações com dados do contrato e perfil.

```sql
SELECT n.*, 
       p.name as contratado_name,
       c.objetivo, c.valor, c.prazo
FROM notifications n
JOIN profile p ON n.id_contratado = p.id
JOIN contracts c ON n.contracts = c.id
```

## Tipos de Dados

### Enums Simulados

**profile.type:**
- `1` = Prestador de Serviço
- `2` = Cliente

**contracts.status:**
- `pendente` = Aguardando assinatura
- `ativo` = Em andamento
- `concluido` = Finalizado
- `cancelado` = Cancelado

### Formatos de String

**profile.typePersonal:**
- CPF: 11 dígitos numéricos
- CNPJ: 14 dígitos numéricos

**profile.tags:**
- Formato: `tag1-tag2-tag3`
- Exemplo: `frontend-backend-fullstack-react-nodejs`

## Checklist de Integridade

- ✅ Todas as FKs possuem ON DELETE CASCADE ou SET NULL apropriado
- ✅ Campos NOT NULL validados
- ✅ Constraints de CHECK aplicados (valores positivos, enums)
- ✅ Índices para colunas frequentemente consultadas
- ✅ RLS habilitado em todas as tabelas
- ✅ Triggers para automações
- ✅ Timestamps automáticos
- ✅ Views para queries complexas
