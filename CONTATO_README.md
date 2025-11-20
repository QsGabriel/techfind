# Sistema de Contato - TechFind

## Implementação Completa

### 📋 O que foi implementado:

1. **Migration do Banco de Dados**
   - Arquivo: `supabase/migrations/20250119_contact_messages.sql`
   - Tabela: `contact_messages`
   - Campos: id, id_user, name, email, phone, subject, message, status, created_at, updated_at, resolved_at
   - Políticas RLS configuradas para permitir inserções públicas e consultas apenas do próprio usuário

2. **Componente Modal de Contato**
   - Arquivo: `src/routes/components/ContactModal.svelte`
   - Modal responsivo com formulário completo
   - Validação client-side e server-side
   - Feedback visual de sucesso/erro
   - Suporte a modo escuro

3. **Integração com Help Center**
   - SupportButton agora abre o modal de contato
   - Fecha o Help Center automaticamente ao clicar
   - Preenche automaticamente dados do usuário logado

4. **Server Action**
   - Arquivo: `src/routes/+page.server.ts`
   - Action: `sendContact`
   - Salva mensagens no banco de dados
   - Pronto para integração com serviço de email

### 🚀 Como usar:

1. **Aplicar a Migration:**
   ```bash
   # Se estiver usando Supabase local
   supabase db push
   
   # Ou aplique manualmente no dashboard do Supabase
   # Copie o conteúdo de supabase/migrations/20250119_contact_messages.sql
   # e execute no SQL Editor
   ```

2. **Teste o Formulário:**
   - Abra o Help Center (botão flutuante ou footer)
   - Clique em "Entrar em contato"
   - Preencha o formulário
   - As mensagens serão salvas na tabela `contact_messages`

### 📧 Como Configurar Envio de Emails:

#### Opção 1: Resend (Recomendado)

1. Instale o pacote:
   ```bash
   npm install resend
   ```

2. Adicione a chave API no `.env`:
   ```
   RESEND_API_KEY=re_sua_chave_aqui
   ```

3. No `+page.server.ts`, adicione após a inserção no banco:
   ```typescript
   import { Resend } from 'resend';
   import { RESEND_API_KEY } from '$env/static/private';
   
   const resend = new Resend(RESEND_API_KEY);
   
   // Dentro do action sendContact, após o insert:
   await resend.emails.send({
     from: 'TechFind <noreply@seudominio.com>',
     to: 'suporte.techfind@outlook.com',
     subject: `[Contato] ${subject}`,
     html: `
       <h2>Nova mensagem de contato</h2>
       <p><strong>Nome:</strong> ${name}</p>
       <p><strong>Email:</strong> ${email}</p>
       <p><strong>Telefone:</strong> ${phone || 'Não informado'}</p>
       <p><strong>Assunto:</strong> ${subject}</p>
       <p><strong>Mensagem:</strong></p>
       <p>${message}</p>
     `
   });
   ```

#### Opção 2: Nodemailer

1. Instale o pacote:
   ```bash
   npm install nodemailer
   npm install -D @types/nodemailer
   ```

2. Adicione as configurações no `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-senha-de-app
   ```

3. Configure o transporter e envie o email no action.

#### Opção 3: SendGrid

1. Instale o pacote:
   ```bash
   npm install @sendgrid/mail
   ```

2. Configure a chave API e envie emails.

### 📊 Consultar Mensagens:

No Supabase Dashboard, você pode:
- Ver todas as mensagens em `contact_messages`
- Filtrar por status (pendente, em_atendimento, resolvido)
- Atualizar o status das mensagens
- Buscar por email ou data

### 🔒 Segurança:

- ✅ Políticas RLS configuradas
- ✅ Validação de dados com Zod
- ✅ Proteção contra spam (pode adicionar rate limiting)
- ✅ Dados sanitizados antes de inserir

### 🎨 Personalização:

Você pode personalizar:
- Cores do modal em `ContactModal.svelte`
- Campos do formulário (adicionar mais campos se necessário)
- Mensagens de sucesso/erro
- Status das mensagens na tabela

### 📝 Próximos Passos Sugeridos:

1. ⚠️ **Configurar serviço de email** (escolha uma das opções acima)
2. Adicionar rate limiting para evitar spam
3. Criar página de admin para gerenciar mensagens
4. Adicionar notificações por email para cada nova mensagem
5. Implementar sistema de tickets com número de protocolo
