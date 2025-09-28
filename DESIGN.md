# 📱 Design System - Seu Bolso na Mão

## Visão Geral do Projeto

O **Seu Bolso na Mão** é uma aplicação financeira moderna construída com React, TypeScript e Tailwind CSS, seguindo os princípios de design mobile-first e oferecendo uma experiência de usuário intuitiva para gestão de finanças pessoais.

## 🎨 Sistema de Cores

### Paleta Principal

- **Verde Principal**: `#3ECF8E` (HSL: 160 84% 39%)
  - Usado para botões primários, elementos de destaque e brand identity
  - Variante hover: `HSL: 160 84% 35%`

- **Verde Secundário**: `#22C55E` (HSL: 142 76% 36%)
  - Usado para indicadores de sucesso e elementos de confirmação

- **Vermelho**: `#FF7F6A`
  - Usado para despesas, alertas e elementos de erro

### Cores Neutras

- **Background**: `HSL: 0 0% 98%` (Branco acinzentado)
- **Foreground**: `HSL: 0 0% 15%` (Preto suave)
- **Card**: `HSL: 0 0% 100%` (Branco puro)
- **Muted**: `HSL: 0 0% 96%` (Cinza claro)
- **Border**: `HSL: 0 0% 90%` (Cinza para bordas)

### Cores Funcionais

- **Text Gray**: `#4B5563` (Texto secundário)
- **Gray Light**: `#9CA3AF` (Texto terciário)
- **Input Border**: `#E2E8F0` (Bordas de campos)

## 📱 Páginas do Sistema

### 1. **Login (`/login`)**
- **Layout**: Formulário centralizado com gradiente verde
- **Elementos**: 
  - Campos de email e senha com ícones
  - Botão "Entrar" com gradiente verde
  - Opção "Lembrar de mim"
  - Link para cadastro
- **Estilo**: Design limpo com bordas arredondadas e sombras suaves

### 2. **Cadastro (`/signup`)**
- **Layout**: Similar ao login, mas com campos adicionais
- **Elementos**: Campos para nome, email, senha e confirmação
- **Validação**: Visual em tempo real com cores de feedback

### 3. **Tipo de Conta (`/account-type`)**
- **Layout**: Tela de onboarding com barra de progresso
- **Elementos**:
  - Seleção entre "Pessoa Física" e "Empresa"
  - Cards clicáveis com indicadores visuais
  - Barra de progresso no topo

### 4. **Configuração (`/setup`)**
- **Layout**: Interface para configurar categorias de entrada e saída
- **Elementos**:
  - Inputs para criar categorias personalizadas
  - Seletor de cores
  - Lista de categorias criadas
  - Botões de ação com ícones

### 5. **Preferências de Gráfico (`/chart-preference`)**
- **Layout**: Seleção de tipos de visualização de dados
- **Elementos**: Cards com preview dos tipos de gráfico disponíveis

### 6. **Dashboard Principal (`/dashboard`)**
#### Header Verde
- **Background**: Verde principal (`#3ECF8E`)
- **Elementos**:
  - Avatar do usuário (círculo cinza por padrão)
  - Saudação personalizada "Olá, [Nome]!"
  - Menu hambúrguer (ícone de 3 linhas)
  - Toggle entre "Pessoa Física" e "Empresa"

#### Resumo Financeiro
- **Cards de métricas**:
  - Receitas (ícone trending_up)
  - Saldo Positivo (ícone account_balance_wallet)
- **Toggle de período**: D (Dia), M (Mês), A (Ano)
- **Estado vazio**: Mensagem "Nenhum dado ainda"

#### Seções Principais
- **Lembretes de Pagamento**: Lista com estado vazio
- **Lançamentos Recentes**: Histórico de transações

#### Navegação Inferior (Bottom Navigation)
- **Background**: Branco com backdrop-blur
- **Botões**:
  - IA (auto_awesome)
  - Calendário (calendar_today)
  - **Botão Central**: Adicionar (ícone + em círculo verde)
  - Relatórios (pie_chart)
  - Últimos (history)

### 7. **Novo Lançamento (`/novo-lancamento`)**
- **Layout**: Modal/Sheet que sobe da parte inferior
- **Elementos**:
  - Seleção de tipo (Entrada/Saída)
  - Campo de data com calendário
  - Seleção de categoria/grupo
  - Campo de descrição
  - Campo de valor monetário
- **Cores**: Verde para entradas, vermelho para saídas

### 8. **Páginas em Desenvolvimento**
- **EmBreve**: Tela de "Coming Soon" para funcionalidades futuras
- **EmBreveEmpresa**: Versão específica para contas empresariais

## 🛠️ Tecnologias e Componentes

### Stack Principal
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones
- **React Router Dom** para navegação
- **Supabase** para backend e autenticação

### Componentes UI
- **Shadcn/ui**: Sistema de componentes baseado em Radix
- **Material Symbols**: Ícones do Google Material Design
- **Sheets**: Painéis deslizantes para mobile
- **Cards**: Containers com sombras suaves
- **Buttons**: Múltiplas variantes (primary, secondary, ghost)

## 📐 Padrões de Design

### Layout Mobile-First
- **Responsividade**: Design otimizado primeiro para mobile
- **Touch Targets**: Botões com tamanho mínimo de 44px
- **Safe Areas**: Respeita áreas seguras de dispositivos mobile

### Microinterações
- **Transições**: Animações suaves (0.2s - 0.3s)
- **Hover States**: Feedback visual para elementos interativos
- **Loading States**: Indicadores visuais durante carregamento
- **Empty States**: Mensagens amigáveis quando não há dados

### Tipografia
- **Font Principal**: Inter (clean, moderna)
- **Font Secondary**: Manrope (para títulos)
- **Tamanhos**: Sistema escalável baseado em rem
- **Peso**: 400 (regular), 500 (medium), 700 (bold)

### Acessibilidade
- **Contraste**: Cores seguem WCAG 2.1 AA
- **Focus**: Estados de foco visíveis
- **Screen Readers**: Componentes Radix são acessíveis por padrão
- **Keyboard Navigation**: Navegação completa por teclado

## 🎯 Conceitos de UX

### Onboarding Progressivo
1. Login/Cadastro
2. Seleção de tipo de conta
3. Configuração de categorias
4. Preferências de visualização
5. Dashboard principal

### Estados da Interface
- **Loading**: Skeleton components e spinners
- **Empty State**: Ilustrações e CTAs claros
- **Error State**: Mensagens amigáveis com ações de recuperação
- **Success State**: Feedback visual positivo

### Navegação Intuitiva
- **Bottom Navigation**: Acesso rápido às principais funcionalidades
- **Gestos**: Swipe para abrir panels
- **Breadcrumbs**: Contexto visual da localização atual

## 🔄 Fluxos Principais

### Adicionar Transação
1. Toque no botão "+" central
2. Seleção do tipo (entrada/saída)
3. Preenchimento dos dados
4. Confirmação e retorno ao dashboard

### Visualizar Dados
1. Dashboard como hub central
2. Filtros por período (D/M/A)
3. Drill-down para detalhes
4. Relatórios e análises

Este design system garante uma experiência consistente, moderna e acessível, focada na simplicidade e eficiência para gestão financeira pessoal.

