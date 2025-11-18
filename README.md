# 🔍 Techfind

Plataforma para conectar clientes a prestadores de serviços de tecnologia. Desenvolvida com SvelteKit, Supabase e IA.

## 🚀 Começando

### Pré-requisitos

- Node.js 22.x ou superior
- Conta no [Supabase](https://supabase.com)
- NPM ou PNPM

### 1️⃣ Instalação

```bash
# Clonar o repositório
git clone https://github.com/Erudhir101/Techfind.git

# Entrar no diretório
cd Techfind-1

# Instalar dependências
npm install
```

### 2️⃣ Configuração do Banco de Dados

Siga o guia completo em: **[supabase/QUICKSTART.md](./supabase/QUICKSTART.md)**

**Resumo rápido:**

1. Crie um projeto no [Supabase](https://supabase.com/dashboard)
2. Configure o arquivo `.env`:
   ```env
   PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
   GROQ_API_KEY=sua-chave-groq-aqui
   ```
3. Aplique a migração do banco:
   - Abra o arquivo `supabase/migrations/20250124_initial_schema.sql`
   - Execute no SQL Editor do Supabase

### 3️⃣ Desenvolvimento

```bash
# Rodar servidor de desenvolvimento
npm run dev

# Ou abrir automaticamente no navegador
npm run dev -- --open
```

A aplicação estará disponível em: **http://localhost:5173**

## 📊 Estrutura do Banco de Dados

O projeto utiliza 4 tabelas principais:

- **profile** - Perfis de usuários (clientes e prestadores)
- **services** - Catálogo de serviços oferecidos
- **contracts** - Contratos entre clientes e prestadores
- **notifications** - Sistema de notificações

Para mais detalhes, consulte: [supabase/README.md](./supabase/README.md)

## 🛠️ Tecnologias

- **Frontend:** SvelteKit 2.0, TailwindCSS 4.0, Bits UI
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **IA:** Groq (Llama 3.3 70B) para recomendações
- **Form Validation:** Sveltekit-Superforms + Zod
- **Deploy:** Vercel

## 📁 Estrutura do Projeto

```
Techfind-1/
├── src/
│   ├── routes/              # Rotas da aplicação
│   │   ├── +page.svelte    # Página inicial (login/signup)
│   │   └── pv/             # Área privada
│   ├── lib/                # Componentes e utilitários
│   └── app.css             # Estilos globais
├── supabase/               # Migrações e config do DB
│   ├── migrations/         # Scripts SQL
│   ├── QUICKSTART.md       # Guia rápido de setup
│   └── README.md           # Documentação do DB
├── static/                 # Arquivos estáticos
└── package.json            # Dependências
```

## 🧪 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run check        # Type checking
npm run lint         # Linting
npm run format       # Formatar código
```

## 🔐 Segurança

- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Autenticação via Supabase Auth
- ✅ Assinatura digital em contratos (hash)
- ✅ Validação de dados com Zod

## 🚢 Deploy

### Vercel (Recomendado)

1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
3. Deploy automático!

### Outras Plataformas

O projeto usa `@sveltejs/adapter-auto` que se adapta automaticamente a várias plataformas.

## 📝 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Perfis de clientes e prestadores
- ✅ Cadastro de serviços
- ✅ Sistema de busca com IA
- ✅ Criação de contratos
- ✅ Assinatura digital
- ✅ Notificações em tempo real
- ✅ Sistema de avaliações (em desenvolvimento)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é de uso educacional e comercial.

## 👨‍💻 Autor

**Erudhir101**
- GitHub: [@Erudhir101](https://github.com/Erudhir101)

## 🆘 Suporte

Encontrou um problema? Abra uma [issue](https://github.com/Erudhir101/Techfind/issues) no GitHub.
