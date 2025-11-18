# Documentação Técnica: Componente "Criar Liga"

## Visão Geral

O componente `CreateLeague` é um wizard multi-etapas (6 steps) para criação de ligas de Fantasy Football. Implementa navegação bidirecional com validações, UI responsiva (desktop/mobile) e controle de estado granular.

---

## Arquitetura do Componente

### Localização
- **Componente Principal**: `/components/CreateLeague.tsx`
- **Componente de Steps**: `/components/WizardSteps.tsx` ⭐ **NOVO**
- **Sub-componentes (Steps)**: `/components/create-league/*.tsx`

### Estrutura de Dados

```typescript
type LeagueFormData = {
  name: string;                    // Nome da liga (obrigatório)
  logo: string | null;             // Logo opcional (base64 ou URL)
  teams: number;                   // Número de times (min: 4)
  divisions: number;               // Número de divisões (min: 1)
  regularSeasonStart: number;      // Semana de início (1-18)
  regularSeasonEnd: number;        // Semana de término (> start)
  playoffsStart: number;           // Início dos playoffs
  playoffsEnd: number;             // Final dos playoffs
  playoffTeams: number;            // Times classificados
  lineup: {                        // Configuração de escalação
    QB: number;                    // Quarterbacks
    RB: number;                    // Running Backs
    WR: number;                    // Wide Receivers
    TE: number;                    // Tight Ends
    FLEX: number;                  // Posição flexível
    K: number;                     // Kickers
    DEF: number;                   // Defesas
  };
  scoring: {                       // Sistema de pontuação
    passingTD: number;             // TD de passe (padrão: 4 pts)
    passingYards: number;          // Jardas de passe (0.04 pts/jarda)
    interception: number;          // Interceptação (-2 pts)
    rushingTD: number;             // TD de corrida (6 pts)
    rushingYards: number;          // Jardas de corrida (0.1 pts/jarda)
    reception: number;             // Recepção PPR (1 pt)
    receivingYards: number;        // Jardas de recepção (0.1 pts/jarda)
    receivingTD: number;           // TD de recepção (6 pts)
    fgMade: number;                // Field goal (3 pts)
    fg50Plus: number;              // FG 50+ jardas (5 pts)
    fgMissed: number;              // FG perdido (-1 pt)
    extraPoint: number;            // Ponto extra (1 pt)
    sack: number;                  // Sack (1 pt)
    defInterception: number;       // INT defensiva (2 pts)
    fumbleRecovery: number;        // Fumble recovery (2 pts)
    defTD: number;                 // TD defensivo (6 pts)
    pointsAllowed: number;         // Pontos permitidos (-1 pt)
  };
};
```

---

## Sistema de Steps

### Configuração de Etapas

```typescript
const STEPS = [
  { id: 1, name: "Nome da Liga", icon: ShieldPlus },
  { id: 2, name: "Times", icon: Users },
  { id: 3, name: "Temporada", icon: Calendar },
  { id: 4, name: "Escalação", icon: Trophy },
  { id: 5, name: "Pontuação", icon: ChevronRight },
  { id: 6, name: "Convites", icon: Share2 },
];
```

### Estado de Cada Step

Um step pode estar em 4 estados distintos:

| Estado | Condição | Desktop Visual | Mobile Visual | Interatividade |
|--------|----------|----------------|---------------|----------------|
| **Atual** | `currentStep === step.id` | Círculo turquesa (#00E6B3)<br/>Ícone preto<br/>Texto turquesa | Barra turquesa (#00E6B3) | Não clicável (já está nela) |
| **Completado** | `currentStep > step.id` | Círculo verde (#0B6623)<br/>Check mark branco<br/>Texto branco | Barra verde (#0B6623) | **Clicável** - Volta para editar |
| **Disponível** | `step.id > currentStep`<br/>+ todas anteriores válidas | Círculo cinza (#2C2F33)<br/>Ícone cinza (#B8BAC1)<br/>Borda hover turquesa | Barra cinza (#4A4E56)<br/>Hover: altura aumenta | **Clicável** - Avança se validado |
| **Bloqueado** | `step.id > currentStep`<br/>+ alguma anterior inválida | Círculo cinza 50% opacidade<br/>Ícone cinza<br/>Sem hover | Barra cinza (#4A4E56) | **Não clicável** - `cursor-not-allowed` |

---

## Lógica de Navegação

### 1. Validações por Step

```typescript
const canAdvance = () => {
  switch (currentStep) {
    case 1:
      return formData.name.trim().length > 0;      // Nome obrigatório
    case 2:
      return formData.teams >= 4 && formData.divisions >= 1;  // Mínimos
    case 3:
      return formData.regularSeasonEnd > formData.regularSeasonStart;  // Lógica
    case 4:
      return true;  // Lineup tem valores padrão válidos
    case 5:
      return true;  // Scoring tem valores padrão válidos
    case 6:
      return true;  // Convites é opcional
    default:
      return false;
  }
};
```

### 2. Verificação de Completude

```typescript
const isStepCompleted = (step: number) => {
  // Mesma lógica do canAdvance(), mas avalia qualquer step
  switch (step) {
    case 1: return formData.name.trim().length > 0;
    case 2: return formData.teams >= 4 && formData.divisions >= 1;
    case 3: return formData.regularSeasonEnd > formData.regularSeasonStart;
    case 4: return true;
    case 5: return true;
    case 6: return true;
    default: return false;
  }
};
```

### 3. Permissão de Navegação

```typescript
const canNavigateToStep = (step: number) => {
  // 1. Sempre pode VOLTAR (step < currentStep)
  if (step < currentStep) return true;
  
  // 2. Sempre pode permanecer (step === currentStep)
  if (step === currentStep) return true;
  
  // 3. Para AVANÇAR: todas as etapas anteriores devem estar completas
  if (step > currentStep) {
    for (let i = 1; i < step; i++) {
      if (!isStepCompleted(i)) return false;
    }
    return true;
  }
  
  return false;
};
```

### 4. Handler de Clique no Step

```typescript
const handleStepClick = (step: number) => {
  if (canNavigateToStep(step)) {
    setCurrentStep(step);
  }
};
```

### 5. Navegação com Botões

```typescript
// Botão "Avançar"
const handleNext = () => {
  if (!canAdvance()) {
    toast.error("Preencha todos os campos obrigatórios antes de avançar");
    return;
  }
  
  if (currentStep < STEPS.length) {
    setCurrentStep(currentStep + 1);
    toast.success(`Etapa ${currentStep} concluída!`);
  }
};

// Botão "Voltar"
const handleBack = () => {
  if (currentStep > 1) {
    setCurrentStep(currentStep - 1);
  }
};

// Botão "Criar Liga" (última etapa)
const handleComplete = () => {
  if (!canAdvance()) {
    toast.error("Preencha todos os campos obrigatórios");
    return;
  }
  
  toast.success("Liga criada com sucesso! 🏈");
  onComplete(formData);
};
```

---

## UI Responsiva: Desktop vs Mobile

### Desktop (≥ md breakpoint)

**Layout:**
```
[Círculo + Nome] ━━━━ [Círculo + Nome] ━━━━ [Círculo + Nome] ...
```

**Características:**
- Círculos de **10x10** (w-10 h-10)
- Conectores horizontais animados (linha verde progride)
- Nomes dos steps visíveis em `lg:block` (≥ 1024px)
- Hover effects avançados:
  - `scale-110` nos círculos clicáveis
  - Transição de cores (branco → turquesa)
  - Borda muda de cor (cinza → turquesa)

**Código (simplificado):**
```tsx
<div className="hidden md:flex items-center justify-between">
  {STEPS.map((step, index) => {
    const isActive = currentStep === step.id;
    const isCompleted = currentStep > step.id;
    const canNavigate = canNavigateToStep(step.id);
    const isFuture = step.id > currentStep;
    
    return (
      <div key={step.id} className="flex items-center flex-1">
        <div 
          className={`flex items-center gap-3 ${
            canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
          onClick={() => handleStepClick(step.id)}
        >
          {/* Círculo com ícone ou check mark */}
          <div className={`w-10 h-10 rounded-full ... ${
            isCompleted
              ? "bg-[#0B6623] border-[#0B6623] hover:bg-[#0B6623]/80"
              : isActive
              ? "bg-[#00E6B3] border-[#00E6B3] text-[#1A2238]"
              : isFuture && canNavigate
              ? "bg-[#2C2F33] border-[#4A4E56] hover:border-[#00E6B3]"
              : "bg-[#2C2F33] border-[#4A4E56] opacity-50"
          } ${canNavigate && !isActive ? 'hover:scale-110' : ''}`}>
            {isCompleted ? <Check /> : <Icon />}
          </div>
          
          {/* Nome do step */}
          <div className="hidden lg:block">
            <p className={`text-sm transition-colors ${
              isActive ? "text-[#00E6B3]" 
              : isCompleted ? "text-white hover:text-[#00E6B3]" 
              : canNavigate && isFuture ? "text-[#B8BAC1] hover:text-white"
              : "text-[#B8BAC1]"
            }`}>
              {step.name}
            </p>
          </div>
        </div>
        
        {/* Conector animado entre steps */}
        {index < STEPS.length - 1 && (
          <div className="flex-1 h-0.5 mx-3 bg-[#4A4E56]">
            <div
              className="h-full bg-[#0B6623] transition-all duration-300"
              style={{ width: isCompleted ? "100%" : "0%" }}
            />
          </div>
        )}
      </div>
    );
  })}
</div>
```

### Mobile (< md breakpoint)

**Layout:**
```
[Barra 1] [Barra 2] [Barra 3] [Barra 4] [Barra 5] [Barra 6]
         Etapa 1 de 6: Nome da Liga
```

**Características:**
- **6 barras horizontais** (`flex-1` para distribuição igual)
- Altura base: **h-2** (8px)
- Hover: **h-3** (12px) - feedback tátil para touch
- Texto centralizado indica step atual
- Cores seguem mesma lógica (verde/turquesa/cinza)

**Código (simplificado):**
```tsx
<div className="md:hidden">
  {/* Barras de progresso */}
  <div className="flex items-center justify-center gap-2 mb-3">
    {STEPS.map((step) => {
      const isActive = currentStep === step.id;
      const isCompleted = currentStep > step.id;
      const canNavigate = canNavigateToStep(step.id);
      
      return (
        <div
          key={step.id}
          className={`h-2 flex-1 rounded-full transition-all ${
            isCompleted ? "bg-[#0B6623]"
            : isActive ? "bg-[#00E6B3]"
            : "bg-[#4A4E56]"
          } ${canNavigate ? 'cursor-pointer hover:h-3' : 'cursor-not-allowed'}`}
          onClick={() => handleStepClick(step.id)}
        />
      );
    })}
  </div>
  
  {/* Indicador textual */}
  <p className="text-center text-[#B8BAC1] text-sm">
    Etapa {currentStep} de {STEPS.length}: {STEPS[currentStep - 1].name}
  </p>
</div>
```

---

## Fluxo de Interação

### Cenário 1: Navegação Linear (Happy Path)

```
1. Usuário preenche "Nome da Liga" → Step 1 válido
2. Clica "Avançar" → Step 2 (Times) se torna disponível
3. Preenche número de times/divisões → Step 2 válido
4. Clica "Avançar" → Step 3 (Temporada) se torna disponível
5. Configura datas → Step 3 válido
6. Etapas 4, 5, 6 têm valores padrão → Sempre válidas
7. Última etapa: botão "Criar Liga" substitui "Avançar"
```

### Cenário 2: Navegação para Trás (Edição)

```
1. Usuário está no Step 5 (Pontuação)
2. Clica no círculo/barra do Step 2 (Times)
3. canNavigateToStep(2) retorna true (step < currentStep)
4. setCurrentStep(2) → Volta para editar
5. Steps 3, 4, 5 ficam acessíveis (já foram validados)
```

### Cenário 3: Tentativa de Pulo Inválido

```
1. Usuário está no Step 1 (Nome não preenchido)
2. Clica no círculo/barra do Step 3 (Temporada)
3. canNavigateToStep(3) retorna false:
   - Step 1 não está completo (!isStepCompleted(1))
4. Cursor mostra "not-allowed"
5. onClick não executa setCurrentStep
```

### Cenário 4: Navegação Avançada (Skip Permitido)

```
1. Usuário preenche Steps 1, 2, 3 corretamente
2. Step 4 (Escalação) tem valores padrão → Válido
3. Usuário pode clicar direto no Step 5 (Pontuação):
   - canNavigateToStep(5) valida steps 1-4 → Todos OK
   - Navegação permitida!
```

---

## Sistema de Feedback

### Toasts (Sonner)

```typescript
// Sucesso ao avançar
toast.success(`Etapa ${currentStep} concluída!`);

// Erro em validação
toast.error("Preencha todos os campos obrigatórios antes de avançar");

// Liga criada
toast.success("Liga criada com sucesso! 🏈");
```

### Indicadores Visuais

| Elemento | Estado | Visual |
|----------|--------|--------|
| **Círculo (Desktop)** | Ativo | `bg-[#00E6B3]` (turquesa brilhante) |
| | Completado | `bg-[#0B6623]` (verde campo) + Check |
| | Disponível | `bg-[#2C2F33]` + `hover:border-[#00E6B3]` |
| | Bloqueado | `bg-[#2C2F33] opacity-50` |
| **Barra (Mobile)** | Ativo | `bg-[#00E6B3]` (turquesa) |
| | Completado | `bg-[#0B6623]` (verde) |
| | Outros | `bg-[#4A4E56]` (cinza) |
| **Conector (Desktop)** | Completado | Linha verde animada (width: 100%) |
| | Não completado | Linha cinza (width: 0%) |

---

## Buttons de Navegação (Footer)

### Layout

```
┌─────────────────────────────────────────────┐
│  [← Voltar]              [Avançar →]        │
│   (disabled step=1)      ou [Criar Liga ✓]  │
└─────────────────────────────────────────────┘
```

### Comportamento

```typescript
// Botão Voltar
<Button
  disabled={currentStep === 1}  // Desabilitado no primeiro step
  onClick={handleBack}
  className="border-[#4A4E56] text-white hover:bg-[#1A2238]"
>
  <ArrowLeft /> Voltar
</Button>

// Botão Avançar (steps 1-5)
<Button
  disabled={!canAdvance()}      // Desabilitado se step inválido
  onClick={handleNext}
  className="bg-[#0B6623] hover:bg-[#0B6623]/90 text-white"
>
  Avançar <ArrowRight />
</Button>

// Botão Criar Liga (step 6)
<Button
  disabled={!canAdvance()}
  onClick={handleComplete}
  className="bg-[#00E6B3] hover:bg-[#00E6B3]/90 text-[#1A2238]"
>
  Criar Liga <Check />
</Button>
```

---

## Sub-componentes (Steps)

Cada step é um componente isolado em `/components/create-league/`:

| Arquivo | Responsabilidade | Props | Validações |
|---------|------------------|-------|------------|
| `LeagueNameStep.tsx` | Nome + logo da liga | `name`, `logo`, `onChange` | Nome não vazio |
| `TeamsStep.tsx` | Configuração de times/divisões | `teams`, `divisions`, `onChange` | teams ≥ 4, divisions ≥ 1 |
| `SeasonStep.tsx` | Calendário da temporada | `regularSeasonStart/End`, `playoffsStart/End`, `playoffTeams`, `totalTeams`, `onChange` | End > Start |
| `LineupStep.tsx` | Posições de escalação | `lineup`, `onChange` | Valores padrão sempre válidos |
| `ScoringStep.tsx` | Sistema de pontuação | `scoring`, `onChange` | Valores padrão sempre válidos |
| `InvitesStep.tsx` | Convidar participantes | `leagueName` | Opcional (sempre válido) |

### Padrão de Comunicação

```typescript
// Parent → Child (props)
<LeagueNameStep
  name={formData.name}
  logo={formData.logo}
  onChange={(name, logo) => updateFormData({ name, logo })}
/>

// Child → Parent (callback)
const updateFormData = (data: Partial<LeagueFormData>) => {
  setFormData(prev => ({ ...prev, ...data }));
};
```

---

## Performance e Otimizações

### 1. Renderização Condicional
```typescript
const renderStep = () => {
  switch (currentStep) {
    case 1: return <LeagueNameStep ... />;
    case 2: return <TeamsStep ... />;
    // ...
  }
};
```
- Apenas o step ativo é renderizado
- Steps não ativos são desmontados (garbage collected)

### 2. Transições CSS
```css
.transition-all  /* Smooth animations */
.duration-300    /* 300ms transitions */
.hover:scale-110 /* Transform em GPU */
```

### 3. Estado Único Centralizado
- `useState<LeagueFormData>` único no parent
- Evita prop drilling excessivo
- Facilita validações cross-step

---

## Acessibilidade

### Keyboard Navigation
- ✅ `onClick` nos steps permite navegação via Tab + Enter
- ✅ Botões nativos (`<Button>`) com focus ring
- ✅ `disabled` estados impedem interação indesejada

### ARIA Labels
- ✅ `aria-describedby={undefined}` em modais (sem descrição necessária)
- ✅ `sr-only` para textos de screen reader
- ✅ Ícones decorativos (`aria-hidden="true"`)

### Visual Feedback
- ✅ Cores de contraste adequadas (WCAG AA)
- ✅ Cursor `pointer` vs `not-allowed`
- ✅ Estados hover/focus bem definidos

---

## Casos Extremos (Edge Cases)

### 1. Refresh de Página
- ❌ **Não persiste**: Estado `formData` é perdido
- 💡 **Solução futura**: `localStorage` ou `sessionStorage`

### 2. Navegação via Browser (Back/Forward)
- ❌ **Não sincronizado**: `currentStep` não acompanha histórico
- 💡 **Solução futura**: React Router + query params (`?step=3`)

### 3. Validações Assíncronas
- Atual: Todas validações são síncronas
- 💡 **Extensão futura**: API validation (nome de liga único, etc.)

### 4. Steps Dinâmicos
- Atual: 6 steps fixos
- 💡 **Extensão futura**: `STEPS` array dinâmico baseado em config

---

## Design Patterns Aplicados

### 1. **Wizard Pattern**
- Quebra formulário complexo em etapas gerenciáveis
- Validação progressiva (step-by-step)
- Feedback imediato ao avançar

### 2. **Controlled Components**
- Parent controla todo o estado (`formData`)
- Children são "dumb components" (recebem props + callbacks)

### 3. **Compound Components**
```tsx
<CreateLeague>
  <LeagueNameStep />
  <TeamsStep />
  <SeasonStep />
  ...
</CreateLeague>
```

### 4. **Progressive Enhancement**
- Desktop: UI rica (círculos + nomes + conectores)
- Mobile: UI simplificada (barras + texto)
- Mesma lógica, apresentações adaptadas

---

## Debugging Tips

### 1. Checar Estado Atual
```tsx
console.log('Current Step:', currentStep);
console.log('Form Data:', formData);
console.log('Can Advance?', canAdvance());
```

### 2. Validar Navegação
```tsx
STEPS.forEach(step => {
  console.log(`Step ${step.id}:`, {
    canNavigate: canNavigateToStep(step.id),
    isCompleted: isStepCompleted(step.id),
  });
});
```

### 3. Forçar Step (Dev Only)
```tsx
// Adicionar botão temporário
<button onClick={() => setCurrentStep(5)}>
  Jump to Scoring
</button>
```

---

## Extensibilidade

### Adicionar Novo Step

```typescript
// 1. Adicionar ao array STEPS
const STEPS = [
  // ... existentes
  { id: 7, name: "Draft Settings", icon: Shuffle },
];

// 2. Atualizar validações
const canAdvance = () => {
  // ...
  case 7:
    return formData.draftDate !== null;
};

// 3. Adicionar ao renderStep
const renderStep = () => {
  // ...
  case 7:
    return <DraftSettingsStep ... />;
};

// 4. Estender LeagueFormData
type LeagueFormData = {
  // ... existentes
  draftDate: Date | null;
  draftType: 'snake' | 'auction';
};
```

### Customizar Cores (Design System)

```typescript
// Extrair para constants.ts
export const THEME = {
  primary: '#0B6623',      // Verde campo
  secondary: '#00E6B3',    // Turquesa neon
  background: '#1A2238',   // Fundo escuro
  card: '#2C2F33',         // Cards cinza
  border: '#4A4E56',       // Bordas
  error: '#B22222',        // Vermelho alerta
};

// Usar no componente
className={`bg-[${THEME.primary}]`}
```

---

## Referências de Código

### Arquivos Relacionados

```
/components/
├── CreateLeague.tsx              # 🎯 Componente principal
├── WizardSteps.tsx               # ⭐ Componente reutilizável de Steps
├── create-league/
│   ├── LeagueNameStep.tsx        # Step 1
│   ├── TeamsStep.tsx             # Step 2
│   ├── SeasonStep.tsx            # Step 3
│   ├── LineupStep.tsx            # Step 4
│   ├── ScoringStep.tsx           # Step 5
│   └── InvitesStep.tsx           # Step 6
├── ui/
│   ├── button.tsx                # Botões (Shadcn)
│   ├── input.tsx                 # Inputs
│   ├── card.tsx                  # Cards
│   └── badge.tsx                 # Badges
└── FantasyHeader.tsx             # Header fixo (não afetado)
```

### Componente WizardSteps (Novo)

O componente `WizardSteps.tsx` foi extraído para maior modularidade e reutilização:

**Props Interface:**
```typescript
export type WizardStep = {
  id: number;
  name: string;
  icon: LucideIcon;
};

export type WizardStepsProps = {
  steps: WizardStep[];                           // Array de steps
  currentStep: number;                           // Step atual (1-based)
  onStepClick: (stepId: number) => void;        // Handler de clique
  canNavigateToStep: (stepId: number) => boolean; // Validação de navegação
  isStepCompleted: (stepId: number) => boolean;  // Verifica se step está completo
};
```

**Estrutura Interna:**
```typescript
// Componente principal que renderiza desktop e mobile
export function WizardSteps(props: WizardStepsProps)

// Sub-componentes internos (não exportados)
function DesktopSteps(props)     // Versão desktop (círculos + conectores)
function MobileSteps(props)      // Versão mobile (barras horizontais)
function StepCircle(props)       // Círculo individual (desktop)
function StepConnector(props)    // Linha conectora (desktop)
function StepBar(props)          // Barra individual (mobile)
```

**Benefícios da Extração:**
- ✅ **Separação de Responsabilidades**: Lógica de UI separada da lógica de negócio
- ✅ **Reutilizável**: Pode ser usado em outros wizards da aplicação
- ✅ **Testável**: Componente isolado facilita testes unitários
- ✅ **Manutenível**: Mudanças nos steps não afetam o CreateLeague
- ✅ **Acessibilidade**: ARIA labels centralizados (role="button", aria-current, tabIndex)
- ✅ **Keyboard Support**: Enter/Space para navegação via teclado

**Uso no CreateLeague:**
```tsx
<WizardSteps
  steps={STEPS}
  currentStep={currentStep}
  onStepClick={handleStepClick}
  canNavigateToStep={canNavigateToStep}
  isStepCompleted={isStepCompleted}
/>
```

### Dependências

```json
{
  "lucide-react": "Icons (Check, ArrowLeft, ShieldPlus, Users, etc.)",
  "sonner": "Toast notifications",
  "react": "State management (useState)"
}
```

---

## Melhorias Recentes (Changelog)

### v2.0 - Componentização dos Steps
**Data**: Novembro 2024

**Mudanças:**
1. ✅ Extraído componente `WizardSteps.tsx`
2. ✅ Adicionados sub-componentes:
   - `DesktopSteps` (círculos + conectores)
   - `MobileSteps` (barras de progresso)
   - `StepCircle` (círculo individual desktop)
   - `StepConnector` (linha animada desktop)
   - `StepBar` (barra individual mobile)
3. ✅ Melhorada acessibilidade:
   - `role="button"` nos steps clicáveis
   - `aria-current="step"` no step ativo
   - `aria-label` descritivo com status
   - `tabIndex` correto (0 para navegáveis, -1 para bloqueados)
   - `onKeyDown` para suporte de Enter/Space
4. ✅ Tipagem TypeScript refinada:
   - `WizardStep` type exportado
   - `WizardStepsProps` type exportado
   - Props específicas para cada sub-componente
5. ✅ Redução de ~150 LOC no `CreateLeague.tsx`

**Breaking Changes:**
- ❌ Nenhum - API do CreateLeague permanece inalterada

**Migration Guide:**
```typescript
// Antes (código inline)
<div className="hidden md:flex ...">
  {STEPS.map(...)}  // 80+ linhas de código
</div>

// Depois (componente extraído)
<WizardSteps
  steps={STEPS}
  currentStep={currentStep}
  onStepClick={handleStepClick}
  canNavigateToStep={canNavigateToStep}
  isStepCompleted={isStepCompleted}
/>
```

---

## Conclusão

O componente `CreateLeague` implementa um wizard robusto com:

✅ **Navegação bidirecional** (frente/trás/click direto)  
✅ **Validações granulares** por step  
✅ **UI responsiva** (desktop/mobile)  
✅ **Feedback visual** (cores, hovers, toasts)  
✅ **Código modular** (6 sub-componentes isolados)  
✅ **Type-safe** (TypeScript strict mode)  

**Complexidade estimada**: ~400 LOC no componente principal, arquitetura escalável para novos steps.

---

**Última atualização**: Novembro 2024  
**Autor**: Documentação técnica para Dev Senior