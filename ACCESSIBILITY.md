# 🎯 Módulo de Acessibilidade TechFind

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Como Usar](#como-usar)
5. [Personalização](#personalização)
6. [Atalhos de Teclado](#atalhos-de-teclado)
7. [Testes](#testes)
8. [FAQ](#faq)

---

## 🎨 Visão Geral

O módulo de acessibilidade do TechFind é uma solução completa e moderna para tornar sua aplicação acessível a todos os usuários, incluindo pessoas com deficiências visuais, daltonismo, baixa visão e preferências de sistema operacional.

### ✨ Destaques
- ✅ Alternância entre tema claro/escuro/automático
- ✅ Controle de tamanho de fonte (4 níveis)
- ✅ Modo de alto contraste
- ✅ Persistência em localStorage
- ✅ Detecção automática do tema do SO
- ✅ Totalmente acessível via teclado
- ✅ Compatível com SSR (Server-Side Rendering)
- ✅ Suporte completo a ARIA
- ✅ Botão flutuante responsivo

---

## 🚀 Funcionalidades

### 1. **Temas**
- **Claro**: Interface clara e clean
- **Escuro**: Reduz fadiga ocular em ambientes escuros
- **Auto**: Sincroniza com as preferências do sistema operacional

### 2. **Tamanho de Fonte**
- **Pequeno**: 14px (para telas grandes)
- **Médio**: 16px (padrão)
- **Grande**: 18px
- **Extra Grande**: 20px

### 3. **Alto Contraste**
- Fundo preto puro (#000000)
- Texto branco brilhante (#FFFFFF)
- Elementos importantes em amarelo (#FFFF00)
- Bordas bem definidas
- Ideal para:
  - Daltonismo
  - Baixa visão
  - Usuários com dificuldades de percepção de cores

### 4. **Acessibilidade via Teclado**
- `Ctrl + Shift + A`: Abrir/Fechar painel
- `ESC`: Fechar painel
- `Tab`: Navegar entre controles
- `Enter/Space`: Ativar botões
- Foco visível em todos os elementos interativos

---

## 📂 Estrutura de Arquivos

```
src/
├── stores/
│   └── accessibility.js          # Store centralizado (Svelte)
├── routes/
│   ├── components/
│   │   └── AccessibilityControls.svelte  # Componente principal
│   └── +layout.svelte            # Layout com integração
└── app.css                       # Estilos globais + variáveis CSS
```

### 📄 `accessibility.js` (Store)
**Responsabilidades:**
- Gerenciar estado de tema, fonte e contraste
- Persistir configurações em localStorage
- Aplicar atributos no HTML (`data-theme`, `data-font-size`, etc.)
- Detectar mudanças no tema do sistema

**Principais Funções:**
```javascript
// Tema
theme.set('light' | 'dark' | 'auto')
theme.toggle()
theme.setLight()
theme.setDark()
theme.setAuto()

// Fonte
fontSize.increase()
fontSize.decrease()
fontSize.reset()

// Contraste
highContrast.toggle()
highContrast.set(true | false)

// Inicialização
initializeAccessibility()
```

### 🎨 `AccessibilityControls.svelte` (Componente)
**Responsabilidades:**
- Renderizar botão flutuante
- Painel de controles expansível
- Interação com o usuário
- Atalhos de teclado
- Feedback visual e auditivo (ARIA live regions)

**Props:** Nenhuma (gerenciado por stores globais)

### 🎨 `app.css` (Estilos)
**Responsabilidades:**
- Definir variáveis CSS (`--bg-color`, `--text-color`, etc.)
- Estilos para tema claro/escuro
- Estilos para alto contraste
- Transições suaves
- Media queries para responsividade

---

## 🛠️ Como Usar

### Passo 1: Instalação de Dependências
O componente já está integrado! Certifique-se de ter as dependências:

```bash
npm install @lucide/svelte
```

### Passo 2: Integração no Layout
Já está integrado em `+layout.svelte`:

```svelte
<script>
  import { initializeAccessibility } from '$stores/accessibility.js';
  import AccessibilityControls from './components/AccessibilityControls.svelte';
  
  onMount(() => {
    initializeAccessibility();
  });
</script>

<AccessibilityControls />
```

### Passo 3: Uso em Componentes

#### 3.1 Consumir o Tema Atual
```svelte
<script>
  import { theme, effectiveTheme } from '$stores/accessibility.js';
  
  let currentTheme = $effectiveTheme; // 'light' ou 'dark'
</script>

{#if currentTheme === 'dark'}
  <p>Modo escuro ativado!</p>
{/if}
```

#### 3.2 Controlar Programaticamente
```svelte
<script>
  import { theme, fontSize, highContrast } from '$stores/accessibility.js';
  
  function enableDarkMode() {
    theme.setDark();
  }
  
  function increaseFontSize() {
    fontSize.increase();
  }
</script>

<button onclick={enableDarkMode}>Ativar Modo Escuro</button>
<button onclick={increaseFontSize}>Aumentar Fonte</button>
```

#### 3.3 Estilizar com Variáveis CSS
```svelte
<style>
  .my-component {
    background: var(--bg-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    font-size: var(--font-size-base);
  }
</style>
```

---

## 🎨 Personalização

### Alterar Cores do Tema
Edite `app.css`:

```css
:root {
  --primary-color: #your-color;
  --focus-ring: #your-focus-color;
}

[data-theme='dark'] {
  --bg-color: #your-dark-bg;
  --text-color: #your-dark-text;
}
```

### Adicionar Novo Tamanho de Fonte
Edite `accessibility.js`:

```javascript
const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra-large',
  HUGE: 'huge' // Novo tamanho
};
```

Adicione em `app.css`:
```css
[data-font-size='huge'] {
  --font-size-base: 24px;
}
```

### Customizar Botão Flutuante
Edite `AccessibilityControls.svelte`:

```css
.accessibility-trigger {
  background: #your-color;
  width: 64px; /* Maior */
  height: 64px;
}
```

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + Shift + A` | Abrir/Fechar painel de acessibilidade |
| `ESC` | Fechar painel |
| `Tab` | Navegar para próximo controle |
| `Shift + Tab` | Navegar para controle anterior |
| `Enter` ou `Space` | Ativar botão focado |

---

## 🧪 Testes

### Testar Persistência
1. Abra o painel de acessibilidade
2. Altere tema, fonte e contraste
3. Recarregue a página
4. ✅ Configurações devem ser mantidas

### Testar Tema Automático
1. Selecione "Auto" no painel
2. Mude o tema do SO (Windows: Configurações > Personalização)
3. ✅ O site deve mudar automaticamente

### Testar Acessibilidade via Teclado
1. Use `Tab` para navegar pelo site
2. ✅ Todos os elementos devem ter foco visível
3. Use `Ctrl + Shift + A`
4. ✅ Painel deve abrir/fechar
5. Navegue no painel com `Tab`
6. ✅ Todos os botões devem ser alcançáveis

### Testar Alto Contraste
1. Ative "Alto Contraste"
2. ✅ Fundo deve ficar preto puro
3. ✅ Texto deve ficar branco brilhante
4. ✅ Links devem ficar amarelos
5. ✅ Bordas devem ser bem visíveis

### Testar Responsividade
1. Abra em mobile (DevTools)
2. ✅ Botão flutuante deve estar visível
3. ✅ Painel deve ocupar quase toda a tela
4. ✅ Controles devem ser fáceis de tocar

### Testar com Leitores de Tela
1. Ative um leitor de tela (NVDA, JAWS, VoiceOver)
2. ✅ Todos os botões devem ter labels descritivos
3. ✅ Estados (ativo/inativo) devem ser anunciados
4. ✅ Mudanças devem ser notificadas (aria-live)

---

## 🔧 Resolução de Problemas

### Problema: Configurações não persistem
**Solução:**
- Verifique se localStorage está habilitado no navegador
- Verifique console para erros
- Limpe cache e cookies

### Problema: Tema automático não funciona
**Solução:**
- Verifique se o navegador suporta `prefers-color-scheme`
- Teste em Chrome/Firefox/Safari modernos

### Problema: Atalhos de teclado não funcionam
**Solução:**
- Verifique se há conflitos com extensões do navegador
- Teste em modo anônimo
- Verifique console para erros

### Problema: Estilos não aplicam
**Solução:**
- Force recarga com `Ctrl + Shift + R`
- Verifique se `app.css` está sendo importado
- Inspecione elemento para ver se atributos `data-*` estão presentes

---

## 📚 FAQ

### P: Como desabilitar o botão flutuante?
R: Remova `<AccessibilityControls />` do `+layout.svelte`

### P: Posso usar apenas uma funcionalidade (ex: só tema)?
R: Sim! Importe apenas o que precisa:
```javascript
import { theme } from '$stores/accessibility.js';
```

### P: Como adicionar mais idiomas?
R: Edite os textos em `AccessibilityControls.svelte`:
```svelte
const i18n = {
  pt: { title: 'Acessibilidade' },
  en: { title: 'Accessibility' }
};
```

### P: É compatível com Tailwind?
R: Sim! As variáveis CSS funcionam com Tailwind. Use:
```html
<div class="bg-[var(--bg-color)]">
```

### P: Como testar com CI/CD?
R: Use Playwright ou Cypress com testes de acessibilidade:
```javascript
// Testar contraste
await expect(page).toHaveAccessibleName('Acessibilidade');
```

---

## 🎯 Checklist de Acessibilidade

- ✅ Suporte a leitores de tela
- ✅ Navegação via teclado
- ✅ Contraste de cores WCAG AA
- ✅ Foco visível em todos os elementos
- ✅ Labels descritivos em todos os controles
- ✅ Estados (ativo/inativo) comunicados via ARIA
- ✅ Redução de movimento (prefers-reduced-motion)
- ✅ Semântica HTML correta
- ✅ Skip links para conteúdo principal
- ✅ Alternativas para conteúdo visual

---

## 🤝 Contribuindo

Sugestões de melhorias:
1. Adicionar mais temas (ex: alto contraste para deuteranopia)
2. Integrar API SpeechSynthesis para leitura em voz alta
3. Adicionar mais tamanhos de fonte
4. Tradução para múltiplos idiomas
5. Sincronização entre dispositivos

---

## 📄 Licença

Este módulo é parte do projeto TechFind e segue a mesma licença do projeto principal.

---

## 🙏 Créditos

Desenvolvido com ❤️ para tornar a web mais acessível para todos.

**Tecnologias utilizadas:**
- SvelteKit 2.0
- Lucide Icons
- CSS Variables
- localStorage API
- MediaQuery API (prefers-color-scheme)

---

**Última atualização:** 2025-11-19
**Versão:** 1.0.0
**Autor:** TechFind Team
