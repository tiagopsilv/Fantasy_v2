# Documentação Completa - Fantasy Football App

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Arquitetura da Aplicação](#arquitetura-da-aplicação)
3. [Design System](#design-system)
4. [Estrutura de Componentes](#estrutura-de-componentes)
5. [Fluxo da Aplicação](#fluxo-da-aplicação)
6. [Gerenciamento de Estado](#gerenciamento-de-estado)
7. [Regras de Negócio](#regras-de-negócio)
8. [Responsividade e Mobile](#responsividade-e-mobile)
9. [Recursos Especiais](#recursos-especiais)

---

## 🎯 Visão Geral

### Propósito
Aplicação web de Fantasy Football focada no **registro de elenco inicial**, permitindo que usuários montem e gerenciem seus times dentro de ligas competitivas.

### Tecnologias
- **React** (TypeScript)
- **Tailwind CSS v4.0**
- **Shadcn/ui** - Componentes base
- **Lucide React** - Ícones
- **Sonner** - Toast notifications

### Foco Principal
Tela de **Registro de Elenco Inicial** com:
- Seleção de liga
- Montagem de lineup (titulares)
- Gerenciamento de banco de reservas
- Validações de formação
- Timer de deadline
- Sistema de salvamento automático

---

## 🏗️ Arquitetura da Aplicação

### Estrutura de Arquivos

```
/
├── App.tsx                          # Componente raiz
├── styles/
│   └── globals.css                  # Estilos globais e design tokens
├── components/
│   ├── FantasyHeader.tsx            # Header fixo com logo e usuário
│   ├── LeagueSelector.tsx           # Seletor de ligas com busca e filtros
│   ├── NavigationBreadcrumb.tsx     # Breadcrumb Liga → Elenco
│   ├── MobileTabs.tsx               # Menu de navegação mobile redesenhado
│   ├── LineupTimer.tsx              # Timer de deadline com alertas
│   ├── AvailablePlayersList.tsx     # Lista de jogadores disponíveis
│   ├── TeamRoster.tsx               # Grid do lineup titular (9 slots)
│   ├── RosterSlot.tsx               # Slot individual de posição
│   ├── BenchPlayersList.tsx         # Lista de jogadores reservas
│   ├── RosterSummary.tsx            # Resumo e validação do elenco
│   ├── SaveLineupButton.tsx         # Botão inteligente de salvamento
│   ├── LineupRulesInfo.tsx          # Painel expansível com regras
│   ├── BenchLimitsInfo.tsx          # Informações de limites do banco
│   └── ui/                          # Componentes Shadcn/ui
└── guidelines/
    └── Guidelines.md                # Guidelines originais do projeto
```

---

## 🎨 Design System

### Paleta de Cores

```css
/* Cores Principais */
--ff-background: #1A2238     /* Fundo escuro principal */
--ff-card: #2C2F33           /* Cards e containers */
--ff-primary: #0B6623        /* Verde campo - ações primárias */
--ff-secondary: #00E6B3      /* Turquesa neon - ações secundárias */
--ff-danger: #B22222         /* Vermelho - alertas e remoções */
--ff-warning: #FFD700        /* Amarelo - avisos e badges admin */
--ff-text: #ffffff           /* Texto principal */
--ff-text-muted: #B8BAC1     /* Texto secundário */
--border: #4A4E56            /* Bordas */
```

### Tipografia

- **Títulos**: Font weight medium (500)
- **Texto padrão**: Font weight normal (400)
- **Desktop**: 16px base
- **Mobile**: 14px base

### Cores por Posição

```javascript
QB:  bg-blue-600    (Azul)
RB:  bg-green-600   (Verde)
WR:  bg-purple-600  (Roxo)
TE:  bg-orange-600  (Laranja)
K:   bg-yellow-600  (Amarelo)
DEF: bg-red-600     (Vermelho)
FLEX: bg-indigo-600 (Índigo)
```

### Componentes de Feedback

- **Success**: Verde (#0B6623)
- **Error**: Vermelho (#B22222)
- **Warning**: Amarelo (#FFD700)
- **Info**: Turquesa (#00E6B3)

---

## 🧩 Estrutura de Componentes

### 1. **App.tsx** (Raiz)

**Responsabilidade**: Orquestrador principal da aplicação

**Estado Global**:
```typescript
const [selectedLeague, setSelectedLeague] = useState<string>("");
const [activeTab, setActiveTab] = useState<TabType>("players");
const [roster, setRoster] = useState<Record<string, Player | null>>({
  QB: null, RB1: null, RB2: null, WR1: null, WR2: null,
  TE: null, FLEX: null, K: null, DEF: null
});
const [benchPlayers, setBenchPlayers] = useState<Player[]>([]);
const [players, setPlayers] = useState<Player[]>(mockPlayers);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const [adminAdjustments, setAdminAdjustments] = useState<Record<string, boolean>>({});
```

**Handlers Principais**:
- `handleAddPlayer()` - Adiciona jogador ao lineup titular
- `handleAddToBench()` - Adiciona jogador ao banco
- `handleRemovePlayer()` - Remove jogador do lineup
- `handleMoveToBench()` - Move titular para o banco
- `handleRemoveFromBench()` - Remove jogador do banco
- `handleMoveToLineup()` - Move reserva para titular
- `handleSaveLineup()` - Salva alterações (simula API)
- `handleConfirmRoster()` - Confirma elenco inicial

**Layout**:
- Desktop: Grid 3 colunas (2 jogadores + 1 resumo)
- Mobile: Tabs com conteúdo dinâmico

---

### 2. **FantasyHeader.tsx**

**Props**:
```typescript
interface FantasyHeaderProps {
  leagueName: string;
  userName: string;
  isAdmin?: boolean;
}
```

**Features**:
- Logo do app (🏈)
- Badge "PROTÓTIPO"
- Nome da liga atual
- Badge "Admin" condicional (Shield icon + dourado)
- Botões de perfil e configurações
- **Fixo no topo** (z-50)

**Responsivo**:
- Desktop: Mostra nome do usuário e badge admin
- Mobile: Oculta nome, mantém ícones

---

### 3. **LeagueSelector.tsx**

**Props**:
```typescript
interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: string;
  onLeagueSelect: (leagueId: string) => void;
  userName: string;
}

interface League {
  id: string;
  name: string;
  teams: number;        // Times atuais
  maxTeams: number;     // Limite da liga
  owner: string;        // Organizador
  isOwner?: boolean;    // Usuário é o dono
  isJoined?: boolean;   // Usuário já participa
}
```

**Features**:
- Campo de busca por nome ou organizador
- Filtros: "Todas", "Minhas Ligas", "Disponíveis"
- Cards clicáveis com hover effect
- Indicadores visuais:
  - Crown (👑) para ligas próprias
  - Star (⭐) preenchida para ligas participando
- Resumo da liga selecionada
- Botão "Continuar com Liga Selecionada"

**Fluxo Simplificado**:
Liga → Gerenciamento de Elenco (sem etapa de seleção de time)

---

### 4. **NavigationBreadcrumb.tsx**

**Props**:
```typescript
interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}
```

**Estrutura**:
```
[Home] > [Nome da Liga] > [Nome do Time]
```

**Features**:
- Botão Home (recarrega página)
- Itens clicáveis com estado ativo
- Separadores visuais (ChevronRight)

---

### 5. **MobileTabs.tsx** ⭐ NOVO DESIGN

**Props**:
```typescript
interface MobileTabsProps {
  activeTab: TabType;           // "players" | "roster" | "bench" | "summary"
  onTabChange: (tab: TabType) => void;
  rosterCount: number;          // Slots preenchidos
  benchCount: number;           // Jogadores no banco
  totalSlots: number;           // Total de slots (9)
}
```

**Design Premium**:
1. **Backdrop Blur**: Gradiente de separação do conteúdo
2. **Barra de Indicador**: Gradiente turquesa→verde que desliza
3. **Área de Toque**: 72px de altura (otimizado)
4. **Badges Inteligentes**:
   - Titulares: `${rosterCount}/${totalSlots}`
   - Reservas: Só mostra se > 0
   - Animação scale no estado ativo
5. **Visual Effects**:
   - Background blur (backdrop-filter)
   - Gradientes de fundo no tab ativo
   - Ícone com background arredondado
   - Ripple effect sutil
   - Active scale animation

**Estrutura**:
```
┌──────────────────────────────────────┐
│ [Barra indicadora animada]           │
│                                      │
│  [Disponíveis] [Titulares] [Reservas] [Confirmar] │
│     👥            👤         👤          ✓       │
│                  Badge       Badge              │
└──────────────────────────────────────┘
```

**Posicionamento de Toasts**:
- `bottom: 92px` - Acima do menu mobile
- Backdrop blur aplicado

---

### 6. **LineupTimer.tsx**

**Props**:
```typescript
interface LineupTimerProps {
  deadline: Date;
  isLocked: boolean;
}
```

**Estados**:
1. **Ativo** (> 1 hora):
   - Amarelo (#FFD700)
   - Mostra timer HH:MM:SS
2. **Urgente** (< 1 hora):
   - Vermelho (#B22222)
   - Timer piscante
3. **Bloqueado**:
   - Alert vermelho "🔒 Lineups bloqueados"

**Atualização**: Cada 1 segundo via `setInterval`

---

### 7. **AvailablePlayersList.tsx**

**Props**:
```typescript
interface AvailablePlayersListProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onAddToBench?: (player: Player) => void;
  isLocked?: boolean;
}

interface Player {
  id: string;
  name: string;
  position: "QB" | "RB" | "WR" | "TE" | "K" | "DEF";
  team: string;
  isAvailable: boolean;
}
```

**Features**:
- Campo de busca (nome ou time)
- Filtros de posição (ALL, QB, RB, WR, TE, K, DEF)
- Lista scrollável com:
  - Badge colorido por posição
  - Nome do jogador
  - Sigla do time
  - Botões: "Titular" (verde) e "Banco" (cinza)
- Desktop: Texto completo nos botões
- Mobile: "B" para banco, ícone + para titular

**Comportamento**:
- Só mostra jogadores `isAvailable: true`
- Botões desabilitados se `isLocked: true`

---

### 8. **TeamRoster.tsx**

**Props**:
```typescript
interface TeamRosterProps {
  roster: Record<string, Player | null>;
  onRemovePlayer: (player: Player) => void;
  onMoveToBench?: (player: Player) => void;
  isLocked?: boolean;
  adminAdjustments?: Record<string, boolean>;
}
```

**Posições**:
```javascript
[
  { key: "QB", label: "QB", required: true },
  { key: "RB1", label: "RB", required: true },
  { key: "RB2", label: "RB", required: true },
  { key: "WR1", label: "WR", required: true },
  { key: "WR2", label: "WR", required: true },
  { key: "TE", label: "TE", required: true },
  { key: "FLEX", label: "FLEX", required: false },
  { key: "K", label: "K", required: true },
  { key: "DEF", label: "DEF", required: true }
]
```

**Layout**:
- Grid responsivo: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- 9 slots de RosterSlot

---

### 9. **RosterSlot.tsx**

**Props**:
```typescript
interface RosterSlotProps {
  position: string;
  player: Player | null;
  onRemovePlayer: (player: Player) => void;
  onMoveToBench?: (player: Player) => void;
  required?: boolean;
  isLocked?: boolean;
  isAdminAdjusted?: boolean;
}
```

**Estados Visuais**:
1. **Vazio + Obrigatório**:
   - Borda vermelha tracejada
   - Badge "Obrigatório"
   - Ícone + cinza
2. **Vazio + Opcional**:
   - Borda cinza tracejada
   - "Clique para adicionar"
3. **Preenchido**:
   - Borda verde sólida
   - Nome do jogador
   - Sigla do time
   - Botões: "Banco" e "Remover"
4. **Admin Adjusted**:
   - Badge Shield dourado no canto
   - Texto "Ajustado pelo admin"

**Cores por Posição**: Mesmas do AvailablePlayersList

---

### 10. **BenchPlayersList.tsx**

**Props**:
```typescript
interface BenchPlayersListProps {
  benchPlayers: Player[];
  onRemoveFromBench: (player: Player) => void;
  onMoveToLineup?: (player: Player) => void;
  isLocked?: boolean;
}
```

**Features**:
- Componente `BenchLimitsInfo` no topo
- Alert informativo: "Jogadores no banco não pontuam"
- Lista de jogadores com opacity reduzida
- Botões: "Titular" (verde) e "X" (remover)
- Estado vazio: "Nenhum jogador no banco"

---

### 11. **RosterSummary.tsx**

**Props**:
```typescript
interface RosterSummaryProps {
  roster: Record<string, Player | null>;
  onConfirmRoster: () => void;
  onSaveLineup?: () => Promise<void> | void;
  isLocked?: boolean;
  hasChanges?: boolean;
}
```

**Seções**:

1. **LineupRulesInfo** (expansível)
2. **Estatísticas**:
   - Jogadores Escolhidos (X/9)
   - Posições Disponíveis (9-X)
3. **Checklist de Posições**:
   - QB: ✓ ou ⚠
   - RB: ✓ ou ⚠ (0-2/2)
   - WR: ✓ ou ⚠ (0-2/2)
   - TE: ✓ ou ⚠
   - K: ✓ ou ⚠
   - DEF: ✓ ou ⚠
4. **Alertas**:
   - Vermelho: Posições faltando
   - Verde: "Elenco válido!"
5. **Botões**:
   - `SaveLineupButton` (se disponível)
   - "Confirmar Elenco Inicial"

**Validação**:
```typescript
const isRosterValid = ["QB", "RB1", "RB2", "WR1", "WR2", "TE", "K", "DEF"]
  .every(pos => roster[pos] !== null);
```

---

### 12. **SaveLineupButton.tsx**

**Props**:
```typescript
interface SaveLineupButtonProps {
  onSave: () => Promise<void> | void;
  isLocked?: boolean;
  hasChanges?: boolean;
  disabled?: boolean;
}
```

**Estados**:
1. **Bloqueado**: Cinza, "🔒 Lineup Bloqueado"
2. **Salvando**: Loading spinner + "Salvando..."
3. **Alterações Pendentes**: Turquesa, "Salvar Alterações"
4. **Salvo**: Verde, "✓ Lineup Salvo"

**Features**:
- Mostra timestamp do último salvamento
- Toast de sucesso/erro
- Animação de loading

---

### 13. **LineupRulesInfo.tsx**

**Props**:
```typescript
interface LineupRulesInfoProps {
  roster: Record<string, any>;
}
```

**Features**:
- Painel colapsável (Shadcn Collapsible)
- Alert com formação obrigatória
- Grid 2 colunas com status por posição:
  - Badge verde (OK)
  - Badge amarelo (Máximo)
  - Badge vermelho (Incompleto)
- Contador: "X/min-max"
- Alert amarelo sobre FLEX

**Cálculo Inteligente**:
```typescript
// Conta posições no titular + FLEX
positionCounts[position]++
// FLEX conta para a posição do jogador
```

---

### 14. **BenchLimitsInfo.tsx**

**Props**:
```typescript
interface BenchLimitsInfoProps {
  benchPlayers: Player[];
  compact?: boolean;
}
```

**Limites do Banco**:
```javascript
{
  QB: 1,
  RB: 3,  // 2 titular + 1 FLEX
  WR: 3,  // 2 titular + 1 FLEX
  TE: 2,  // 1 titular + 1 FLEX
  K: 1,
  DEF: 1
}
```

**Modos**:
1. **Normal**: Grid 2-3 colunas com todos os limites
2. **Compact**: Badge simples "X/9"

**Status**:
- Amarelo: No máximo
- Turquesa: Dentro do limite
- Cinza: Vazio

---

## 🔄 Fluxo da Aplicação

### 1. Seleção de Liga

```
Carrega App
   ↓
Mostra LeagueSelector
   ↓
Usuário seleciona liga
   ↓
setSelectedLeague(id)
   ↓
Oculta LeagueSelector
   ↓
Mostra Breadcrumb + Timer + Gerenciamento
```

### 2. Adicionar Jogador ao Titular

```
Usuário clica "Titular"
   ↓
handleAddPlayer(player)
   ↓
Valida isLocked
   ↓
Verifica posições disponíveis:
  - Ordem: Slots específicos → FLEX
  - Limites por posição
   ↓
Adiciona ao roster[slot]
   ↓
Atualiza player.isAvailable = false
   ↓
setHasUnsavedChanges(true)
   ↓
Toast "Jogador adicionado!"
```

### 3. Adicionar ao Banco

```
Usuário clica "Banco"
   ↓
handleAddToBench(player)
   ↓
Valida limites do banco
   ↓
benchPlayers.push(player)
   ↓
player.isAvailable = false
   ↓
Toast "Adicionado ao banco!"
```

### 4. Mover Titular → Banco

```
Usuário clica "Banco" no slot
   ↓
handleMoveToBench(player)
   ↓
Valida regras mínimas:
  - 1 QB, 2 RB, 2 WR, 1 TE, 1 K, 1 DEF
   ↓
Se OK: Move para bench
Se não: Toast de erro
```

### 5. Mover Banco → Titular

```
Usuário clica "Titular" no banco
   ↓
handleMoveToLineup(player)
   ↓
Busca slot disponível
   ↓
Remove do bench
   ↓
Adiciona ao roster[slot]
```

### 6. Salvar Lineup

```
Usuário clica "Salvar Alterações"
   ↓
SaveLineupButton → onSave()
   ↓
Simula chamada API (1s)
   ↓
setHasUnsavedChanges(false)
   ↓
Toast "Lineup salvo!"
   ↓
Atualiza timestamp
```

### 7. Confirmar Elenco

```
Usuário clica "Confirmar Elenco Inicial"
   ↓
Valida isRosterValid
   ↓
handleConfirmRoster()
   ↓
Toast "Elenco confirmado!"
   ↓
setHasUnsavedChanges(false)
```

---

## 📊 Gerenciamento de Estado

### Estado no App.tsx

```typescript
// Liga selecionada
const [selectedLeague, setSelectedLeague] = useState<string>("");

// Tab ativa no mobile
const [activeTab, setActiveTab] = useState<TabType>("players");

// Lineup titular (9 slots)
const [roster, setRoster] = useState<Record<string, Player | null>>({
  QB: null,
  RB1: null,
  RB2: null,
  WR1: null,
  WR2: null,
  TE: null,
  FLEX: null,
  K: null,
  DEF: null,
});

// Banco de reservas
const [benchPlayers, setBenchPlayers] = useState<Player[]>([]);

// Pool de jogadores disponíveis
const [players, setPlayers] = useState<Player[]>(mockPlayers);

// Tracking de alterações
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// Ajustes feitos por admin após deadline
const [adminAdjustments, setAdminAdjustments] = useState<Record<string, boolean>>({});
```

### Dados Mockados

**Ligas**:
```typescript
const mockLeagues: League[] = [
  {
    id: "1",
    name: "Liga dos Campeões 2024",
    teams: 10,
    maxTeams: 12,
    owner: "Admin Fantasy",
    isOwner: false,
    isJoined: true
  },
  // ... 4 ligas mais
];
```

**Jogadores**:
```typescript
const mockPlayers: Player[] = [
  // 4 QBs, 6 RBs, 6 WRs, 4 TEs, 3 Ks, 3 DEFs
  { id: "1", name: "Josh Allen", position: "QB", team: "BUF", isAvailable: true },
  // ...
];
```

**Configurações**:
```typescript
const userName = "Manager";
const userTeamName = "Meu Time";
const isAdmin = true;
const lineupDeadline = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h
const isLocked = false;
```

---

## ⚙️ Regras de Negócio

### Formação Obrigatória

```
1 QB (Quarterback)
2 RB (Running Backs)
2 WR (Wide Receivers)
1 TE (Tight End)
1 FLEX (RB, WR ou TE adicional)
1 K (Kicker)
1 DEF (Defense/Special Teams)
─────────────────────────────────
Total: 9 slots
```

### Limites no Titular

```javascript
const maxPositions = {
  QB: 1,      // Apenas no slot QB
  RB: 3,      // RB1, RB2, e possível FLEX
  WR: 3,      // WR1, WR2, e possível FLEX
  TE: 2,      // TE e possível FLEX
  K: 1,       // Apenas no slot K
  DEF: 1      // Apenas no slot DEF
};
```

### Limites no Banco

```javascript
const maxBench = {
  QB: 1,
  RB: 3,      // Pode ter até 3 RBs no banco
  WR: 3,      // Pode ter até 3 WRs no banco
  TE: 2,      // Pode ter até 2 TEs no banco
  K: 1,
  DEF: 1
};
```

### Hierarquia FLEX

Quando adicionar jogador elegível ao FLEX:

```javascript
// Ordem de preenchimento:
1. Slots específicos primeiro (RB1, RB2, WR1, WR2, TE)
2. FLEX como fallback

// Validação:
if (position === "RB") {
  if (!roster.RB1) slotToFill = "RB1";
  else if (!roster.RB2) slotToFill = "RB2";
  else if (!roster.FLEX && positionCounts.RB < 3) slotToFill = "FLEX";
}
```

### Validação ao Mover para Banco

```javascript
// Antes de permitir titular → banco, verifica:
const violations = [];
if (positionCounts.QB < 1) violations.push("1 Quarterback");
if (positionCounts.RB < 2) violations.push("2 Running Backs");
if (positionCounts.WR < 2) violations.push("2 Wide Receivers");
if (positionCounts.TE < 1) violations.push("1 Tight End");
if (positionCounts.K < 1) violations.push("1 Kicker");
if (positionCounts.DEF < 1) violations.push("1 Defesa");

if (violations.length > 0) {
  toast.error(`Não é possível mover. Lineup deve ter: ${violations.join(", ")}`);
  return;
}
```

### Sistema de Lock (Deadline)

```javascript
// Usuário comum
if (isLocked) {
  toast.error("Não é possível alterar o lineup após o deadline!");
  return;
}

// Admin pode ajustar mesmo após lock
if (isLocked && !isAdmin) {
  toast.error("Não é possível alterar o lineup após o deadline!");
  return;
}

// Marca ajustes do admin
adminAdjustments[slotKey] = true;
```

---

## 📱 Responsividade e Mobile

### Breakpoints

```css
/* Mobile first */
Base: < 640px (sm)
Tablet: 640px - 1024px (sm - lg)
Desktop: > 1024px (lg+)
```

### Layout Desktop

```
┌──────────────────────────────────────────────────────┐
│ Header (fixo)                                        │
├──────────────────────────────────────────────────────┤
│ Breadcrumb                                           │
│ Timer                                                │
├────────────────────────┬─────────────────────────────┤
│ Jogadores Disponíveis  │ Resumo do Elenco            │
│ (2 colunas)            │ (1 coluna)                  │
│                        │                             │
├────────────────────────┴─────────────────────────────┤
│ Lineup Titular (grid 3 colunas)                      │
├──────────────────────────────────────────────────────┤
│ Banco de Reservas                                    │
└──────────────────────────────────────────────────────┘
```

### Layout Mobile

```
┌──────────────────────────────────────┐
│ Header (fixo, compacto)              │
├──────────────────────────────────────┤
│ Breadcrumb                           │
│ Timer                                │
├──────────────────────────────────────┤
│                                      │
│ Conteúdo Dinâmico                    │
│ (baseado na tab ativa)               │
│                                      │
│                                      │
│                                      │
│                                      │
│                                      │
├──────────────────────────────────────┤
│ Mobile Tabs (fixo, 72px)             │
│ [Disponíveis][Titulares][Reservas]   │
│                [Confirmar]           │
└──────────────────────────────────────┘
```

### CSS Mobile Específico

```css
@media (max-width: 767px) {
  /* Font base menor */
  html {
    font-size: 14px;
  }
  
  /* Touch targets mínimos */
  button, [role="button"], input {
    min-height: 44px;
  }
  
  /* Smooth scrolling */
  .mobile-scroll {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  
  /* Toast posicionamento */
  [data-sonner-toaster] {
    bottom: 92px !important; /* Acima do menu */
  }
  
  /* Backdrop blur */
  @supports (backdrop-filter: blur(10px)) {
    .mobile-backdrop {
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
  }
  
  /* Button feedback */
  button:active {
    transform: scale(0.96);
    transition-duration: 0.1s;
  }
}
```

### MobileTabs - Detalhes Técnicos

```css
/* Área de toque otimizada */
min-height: 72px
WebkitTapHighlightColor: transparent

/* Backdrop blur gradient */
background: linear-gradient(to top, #1A2238, transparent)
backdrop-filter: blur(12px)

/* Barra indicadora animada */
width: 25%
left: activeTabIndex * 25%
transition: all 300ms ease-out
background: linear-gradient(to right, #00E6B3, #0B6623)

/* Tab ativo */
background: linear-gradient(to top, #00E6B3/10, transparent)
icon: scale(1.1) + color turquesa
badge: scale(1.1) + background turquesa

/* Tab inativo */
color: #B8BAC1
hover: background #1A2238/30
```

### Componentes Responsivos

**FantasyHeader**:
- Desktop: Logo + nome + liga + user + badges + botões
- Mobile: Logo + liga (truncado) + botões de ícone

**LeagueSelector**:
- Desktop: Grid de cards, botões com texto completo
- Mobile: Stack vertical, botões compactos

**AvailablePlayersList**:
- Desktop: Botões "Titular" e "Banco" com texto
- Mobile: Ícone "+" e letra "B"

**TeamRoster**:
- Desktop: Grid 3 colunas
- Tablet: Grid 2 colunas
- Mobile: 1 coluna

**RosterSummary**:
- Desktop: Sidebar fixa
- Mobile: Tab "Confirmar" do menu inferior

---

## 🌟 Recursos Especiais

### 1. Timer em Tempo Real

```typescript
useEffect(() => {
  const calculateTimeLeft = () => {
    const difference = deadline.getTime() - new Date().getTime();
    // Atualiza HH:MM:SS
  };
  
  const timer = setInterval(calculateTimeLeft, 1000);
  return () => clearInterval(timer);
}, [deadline]);
```

### 2. Toasts Contextuais

```typescript
// Sucesso
toast.success("Josh Allen foi adicionado ao lineup titular!");

// Erro com detalhes
toast.error("Não há posições disponíveis para RB (máximo 3)");

// Info
toast.info("Lineup salvo com sucesso!");
```

### 3. Animações

```css
/* Tab transition */
transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1)

/* Button press */
active:scale-95

/* Loading spinner */
animate-spin

/* Badge scale */
scale-110 (no ativo)
```

### 4. Badges Dinâmicos

```typescript
// No MobileTabs
badge: `${rosterCount}/${totalSlots}`  // "5/9"
badge: benchCount > 0 ? benchCount.toString() : null  // "3"

// Status visual
className={isActive ? "bg-[#00E6B3]" : "bg-[#4A4E56]"}
```

### 5. Validação em Tempo Real

```typescript
// Atualiza a cada mudança no roster
const isRosterValid = requiredPositions.every(pos => roster[pos]);
const missingPositions = requiredPositions.filter(pos => !roster[pos]);

// Desabilita botões condicionalmente
<Button disabled={!isRosterValid || isLocked}>
  Confirmar Elenco
</Button>
```

### 6. Sistema de Unsaved Changes

```typescript
// Marca alterações
setHasUnsavedChanges(true);

// Visual no SaveLineupButton
hasChanges 
  ? 'bg-[#00E6B3]' (turquesa, destacado)
  : 'bg-[#0B6623]' (verde padrão)
```

### 7. Admin Adjustments

```typescript
// Marca ajustes pós-deadline
if (isLocked && isAdmin) {
  adminAdjustments[slotKey] = true;
}

// Visual no RosterSlot
{isAdminAdjusted && (
  <Badge className="bg-[#FFD700]">
    <Shield className="w-3 h-3" />
  </Badge>
)}
```

### 8. Collapsible Info Panels

```typescript
// LineupRulesInfo
<Collapsible open={isOpen} onOpenChange={setIsOpen}>
  <CollapsibleTrigger>
    Regras de Formação {isOpen ? "Ocultar" : "Mostrar"}
  </CollapsibleTrigger>
  <CollapsibleContent>
    {/* Detalhes */}
  </CollapsibleContent>
</Collapsible>
```

### 9. Busca e Filtros

```typescript
// LeagueSelector
const filteredLeagues = leagues.filter(league => {
  const matchesSearch = league.name.toLowerCase().includes(searchTerm);
  const matchesFilter = 
    filterType === "all" || 
    (filterType === "joined" && league.isJoined) ||
    (filterType === "available" && !league.isJoined);
  return matchesSearch && matchesFilter;
});
```

### 10. Timestamps

```typescript
// SaveLineupButton
const [lastSaved, setLastSaved] = useState<Date | null>(null);

// Display
{lastSaved && (
  <div>
    Último salvamento: {lastSaved.toLocaleTimeString('pt-BR')}
  </div>
)}
```

---

## 🎯 Próximas Melhorias (Sugestões)

### Backend Integration
- [ ] API REST para ligas, jogadores e lineups
- [ ] Autenticação de usuários
- [ ] WebSocket para atualizações em tempo real
- [ ] Sistema de notificações

### Features
- [ ] Drag & Drop para reorganizar lineup
- [ ] Comparação de jogadores (stats)
- [ ] Histórico de alterações
- [ ] Sugestões automáticas de lineup
- [ ] Análise de matchups
- [ ] Trade system entre usuários
- [ ] Waiver wire (sistema de reivindicações)

### Performance
- [ ] Virtualização da lista de jogadores
- [ ] Memoização de componentes pesados
- [ ] Lazy loading de rotas
- [ ] Service Worker para offline mode

### UX
- [ ] Tutorial interativo
- [ ] Shortcuts de teclado
- [ ] Modo escuro/claro toggle
- [ ] Temas personalizados por liga
- [ ] Exportar lineup como imagem
- [ ] Compartilhamento social

---

## 📚 Referências

### Documentação Utilizada
- [React Docs](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Sonner Toasts](https://sonner.emilkowal.ski)

### Decisões de Design
1. **Fluxo Simplificado**: Liga → Elenco (sem etapa de time)
2. **Mobile First**: Design pensado para mobile, escalado para desktop
3. **Feedback Imediato**: Toasts e validações em tempo real
4. **Cores Semânticas**: Verde = sucesso, Vermelho = alerta, Amarelo = warning
5. **Touch Optimized**: 72px de área de toque, 44px mínimo em elementos

### Estrutura de Dados
```typescript
// Hierarquia principal
App
├── selectedLeague (string)
├── roster (Record<string, Player | null>)
│   ├── QB, RB1, RB2, WR1, WR2, TE, FLEX, K, DEF
├── benchPlayers (Player[])
└── players (Player[])

// Player Schema
Player {
  id: string
  name: string
  position: "QB" | "RB" | "WR" | "TE" | "K" | "DEF"
  team: string (sigla, ex: "BUF", "KC")
  isAvailable: boolean
}

// League Schema
League {
  id: string
  name: string
  teams: number (atual)
  maxTeams: number (limite)
  owner: string (nome do organizador)
  isOwner: boolean (usuário é dono)
  isJoined: boolean (usuário participa)
}
```

---

## 🔍 Como Usar Esta Documentação

### Para Adicionar Features
1. Identifique o componente afetado
2. Revise as Props e Estado atual
3. Verifique as Regras de Negócio aplicáveis
4. Implemente mantendo consistência visual
5. Teste responsividade (mobile + desktop)

### Para Debugging
1. Verifique o fluxo no diagrama
2. Analise o estado no App.tsx
3. Valide handlers e callbacks
4. Inspecione toasts de erro

### Para Refatoração
1. Componentes pequenos e focados
2. Props tipadas com TypeScript
3. Manter design system consistente
4. Testar em todos breakpoints
5. Validar acessibilidade

---

**Última Atualização**: 10 de Novembro de 2025
**Versão**: 2.0 (Com melhorias mobile significativas)
**Autor**: Documentação gerada para facilitar manutenção e onboarding
