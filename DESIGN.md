# 🎨 Design System - Seu Bolso na Mão

**Uma plataforma moderna para gestão financeira pessoal e empresarial**

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Paleta de Cores](#-paleta-de-cores)
3. [Tipografia](#-tipografia)
4. [Componentes UI](#-componentes-ui)
5. [Layout e Estrutura](#-layout-e-estrutura)
6. [Padrões de Design](#-padrões-de-design)
7. [Responsividade](#-responsividade)
8. [Acessibilidade](#-acessibilidade)

---

## 🎯 Visão Geral

O **Seu Bolso na Mão** é uma aplicação SaaS financeira construída com **React**, **TypeScript** e **Tailwind CSS**, utilizando um design system moderno e consistente inspirado nas melhores práticas de aplicações financeiras.

### Princípios de Design

- **🟢 Confiabilidade**: Uso de tons de verde/teal para transmitir segurança financeira
- **🎨 Simplicidade**: Interface limpa e intuitiva
- **📱 Mobile-First**: Experiência otimizada para dispositivos móveis
- **♿ Acessibilidade**: Suporte para leitores de tela e navegação por teclado
- **🌙 Flexibilidade**: Suporte para tema claro e escuro

---

## 🎨 Paleta de Cores

### Cores Primárias

```css
/* Tema Principal - Verde/Teal Financeiro */
--primary: 160 84% 39%;           /* #3ecf8e - Verde principal */
--primary-foreground: 0 0% 100%;  /* #ffffff - Texto sobre primário */
--primary-hover: 160 84% 35%;     /* Verde escuro para hover */
```

### Cores Secundárias

```css
--secondary: 160 30% 95%;         /* Verde muito claro */
--secondary-foreground: 160 50% 25%; /* Verde escuro para texto */
--accent: 160 100% 96%;           /* Verde accent muito claro */
--accent-foreground: 160 50% 25%; /* Verde escuro para texto */
```

### Cores de Estado

```css
--success: 142 76% 36%;           /* Verde para sucesso */
--destructive: 0 84% 60%;         /* Vermelho para ações destrutivas */
--muted: 0 0% 96%;                /* Cinza claro para elementos silenciados */
--muted-foreground: 0 0% 55%;     /* Cinza médio para texto silenciado */
```

### Cores de Interface

```css
--background: 0 0% 98%;           /* #fafafa - Fundo principal */
--foreground: 0 0% 15%;           /* #262626 - Texto principal */
--card: 0 0% 100%;                /* #ffffff - Fundo de cards */
--border: 0 0% 90%;               /* #e5e5e5 - Bordas */
--input: 0 0% 100%;               /* #ffffff - Fundo de inputs */
--ring: 160 84% 39%;              /* Verde para focus rings */
```

### Tema Escuro

O projeto possui suporte completo para tema escuro com suas próprias variações de cores:

```css
.dark {
  --background: 222.2 84% 4.9%;   /* Fundo escuro */
  --foreground: 210 40% 98%;      /* Texto claro */
  --primary: 160 84% 45%;         /* Verde mais claro para dark mode */
  /* ... outras variações para dark mode */
}
```

---

## ✍️ Tipografia

### Fonte Principal

**Inter** - Fonte moderna e legível, ideal para aplicações financeiras

```css
font-family: 'Inter', sans-serif;
letter-spacing: -0.01em;        /* Espaçamento ligeiramente reduzido */
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Pesos Disponíveis

- **300** - Light
- **400** - Regular
- **500** - Medium
- **600** - SemiBold
- **700** - Bold
- **800** - ExtraBold

### Hierarquia Tipográfica

```css
/* Títulos Principais */
.text-3xl { font-size: 1.875rem; } /* 30px */
.text-2xl { font-size: 1.5rem; }   /* 24px */
.text-xl { font-size: 1.25rem; }   /* 20px */
.text-lg { font-size: 1.125rem; }  /* 18px */

/* Texto Corpo */
.text-base { font-size: 1rem; }    /* 16px */
.text-sm { font-size: 0.875rem; }  /* 14px */
.text-xs { font-size: 0.75rem; }   /* 12px */
```

---

## 🧩 Componentes UI

### Biblioteca de Componentes

O projeto utiliza **shadcn/ui** como base, uma biblioteca de componentes construída sobre **Radix UI** e **Tailwind CSS**:

#### Componentes Principais

- **Button** - Botões com múltiplas variantes
- **Card** - Containers para conteúdo
- **Input** - Campos de entrada
- **Dialog/Sheet** - Modais e painéis laterais
- **Form** - Formulários com validação
- **Toast** - Notificações
- **Sidebar** - Navegação lateral
- **Toggle** - Alternadores e grupos de alternadores

#### Variantes de Botão

```typescript
// Variantes disponíveis
variant: {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive: "bg-destructive text-destructive-foreground",
  outline: "border border-input bg-background hover:bg-accent",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
}

// Tamanhos disponíveis
size: {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
}
```

### Componentes Customizados

#### Botão Primário Financeiro

```css
.btn-primary {
  height: 56px;
  border-radius: 8px;
  background-image: linear-gradient(to right, #3ecf8e, #2f855a);
  box-shadow: 0 4px 14px 0 rgba(62, 207, 142, 0.39);
  transition: all 0.3s ease-in-out;
}
```

#### Input com Ícone

```css
.form-input {
  height: 56px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding-left: 44px; /* Espaço para ícone */
  transition: all 0.2s ease-in-out;
}

.form-input:focus {
  border-color: #3ecf8e;
  box-shadow: 0 0 0 3px rgba(62, 207, 142, 0.2);
}
```

---

## 📐 Layout e Estrutura

### Grid System

Utiliza o grid system do **Tailwind CSS** com breakpoints responsivos:

```css
/* Container principal */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Breakpoints */
sm: 640px    /* Tablets pequenos */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Desktops */
2xl: 1400px  /* Desktops grandes */
```

### Estrutura de Páginas

#### Dashboard Principal

- **Header** - Perfil do usuário e configurações
- **Sidebar** - Navegação principal (desktop)
- **Main Content** - Conteúdo principal da aplicação
- **Bottom Navigation** - Navegação principal (mobile)

#### Formulários

- **Card Container** - Container principal do formulário
- **Progress Indicator** - Indicador de progresso (onboarding)
- **Form Fields** - Campos com validação visual
- **Action Buttons** - Botões de ação primários e secundários

---

## 🎨 Padrões de Design

### Espaçamento

Sistema de espaçamento baseado em múltiplos de 4px:

```css
/* Espaçamentos padrão */
p-2  /* 8px */
p-3  /* 12px */
p-4  /* 16px */
p-6  /* 24px */
p-8  /* 32px */
```

### Bordas e Raios

```css
--radius: 0.5rem; /* 8px - Raio padrão */

/* Variações */
rounded-sm: calc(var(--radius) - 4px) /* 4px */
rounded-md: calc(var(--radius) - 2px) /* 6px */
rounded-lg: var(--radius)             /* 8px */
rounded-xl: 12px                      /* 12px */
```

### Sombras

```css
/* Sombra suave para elementos financeiros */
--shadow-soft: 0 4px 6px -1px hsl(160 84% 39% / 0.1), 
               0 2px 4px -1px hsl(160 84% 39% / 0.06);

/* Sombras do Tailwind */
shadow-sm   /* Sombra sutil */
shadow      /* Sombra padrão */
shadow-lg   /* Sombra grande */
```

### Transições

```css
/* Transição suave customizada */
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Transições padrão */
transition-colors   /* Cores */
transition-all      /* Todas as propriedades */
duration-200        /* 200ms */
duration-300        /* 300ms */
```

---

## 📱 Responsividade

### Abordagem Mobile-First

O design prioriza dispositivos móveis e escala para desktop:

#### Mobile (< 640px)

- **Layout Stack** - Elementos empilhados verticalmente
- **Bottom Navigation** - Navegação inferior fixa
- **Full-width Cards** - Cards ocupam toda a largura
- **Touch-friendly** - Elementos com tamanho mínimo de 44px

#### Tablet (640px - 1024px)

- **Sidebar Collapsible** - Sidebar que pode ser recolhida
- **Grid Layout** - Layout em grid para cards
- **Hover States** - Estados de hover habilitados

#### Desktop (> 1024px)

- **Sidebar Fixa** - Navegação lateral fixa
- **Multi-column Layout** - Layout em múltiplas colunas
- **Rich Interactions** - Interações avançadas (drag & drop, etc.)

### Breakpoint Strategy

```css
/* Mobile First */
.dashboard-grid {
  @apply grid grid-cols-1 gap-4;
}

/* Tablet */
@media (min-width: 768px) {
  .dashboard-grid {
    @apply grid-cols-2;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .dashboard-grid {
    @apply grid-cols-3;
  }
}
```

---

## ♿ Acessibilidade

### Princípios de Acessibilidade

#### Contraste de Cores

- **Texto normal**: Mínimo 4.5:1
- **Texto grande**: Mínimo 3:1
- **Elementos interativos**: Mínimo 3:1

#### Navegação por Teclado

```css
/* Focus visible para navegação por teclado */
focus-visible:outline-none 
focus-visible:ring-2 
focus-visible:ring-ring 
focus-visible:ring-offset-2
```

#### Indicadores de Estado

- **Loading states** - Indicadores visuais de carregamento
- **Error states** - Feedback visual para erros
- **Success states** - Confirmação visual de sucesso

#### Semantic HTML

- **Landmarks** - `<main>`, `<nav>`, `<section>`
- **Headings** - Hierarquia correta de h1-h6
- **Form labels** - Labels associados aos inputs
- **Alt text** - Texto alternativo para imagens

---

## 🔧 Tokens de Design

### CSS Custom Properties

```css
:root {
  /* Cores */
  --primary: 160 84% 39%;
  --background: 0 0% 98%;
  --foreground: 0 0% 15%;
  
  /* Espaçamento */
  --radius: 0.5rem;
  
  /* Efeitos */
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(160 100 45%));
  --shadow-soft: 0 4px 6px -1px hsl(160 84% 39% / 0.1);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Sidebar */
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-border: 220 13% 91%;
}
```

---

## 🚀 Implementação

### Stack Técnico

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de CSS utilitário
- **Radix UI** - Primitivos de componentes acessíveis
- **Lucide React** - Biblioteca de ícones
- **Class Variance Authority** - Gerenciamento de variantes de componentes

### Estrutura de Arquivos

```
src/
├── components/
│   └── ui/           # Componentes de interface
├── pages/            # Páginas da aplicação
├── hooks/            # Hooks customizados
├── lib/              # Utilitários
└── integrations/     # Integrações externas
```

---

## 📊 Performance

### Otimizações Aplicadas

- **Code Splitting** - Carregamento sob demanda
- **Tree Shaking** - Eliminação de código não utilizado
- **Font Optimization** - Carregamento otimizado de fontes
- **CSS Purging** - Remoção de CSS não utilizado

### Métricas de Performance

- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Time to Interactive** < 3s
- **Cumulative Layout Shift** < 0.1

---

## 🎯 Conclusão

O design system do **Seu Bolso na Mão** foi criado para proporcionar uma experiência consistente, acessível e moderna para gestão financeira. A combinação de cores verdes transmite confiança, enquanto a tipografia Inter garante legibilidade em todos os dispositivos.

A arquitetura baseada em componentes permite escalabilidade e manutenibilidade, seguindo as melhores práticas de design de sistemas modernos.

---

*Última atualização: Setembro 2024*
