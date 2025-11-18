# API de Parametrização de Ligas - Fantasy Football

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Modelos de Dados](#modelos-de-dados)
3. [Endpoints da API](#endpoints-da-api)
4. [Regras de Validação](#regras-de-validação)
5. [Exemplos de Requests/Responses](#exemplos-de-requestsresponses)
6. [Fluxo de Criação de Liga](#fluxo-de-criação-de-liga)
7. [Casos de Uso](#casos-de-uso)
8. [Considerações de Implementação](#considerações-de-implementação)

---

## 🎯 Visão Geral

### Objetivo
API RESTful para criação e gerenciamento de ligas de Fantasy Football com **parametrização obrigatória** de todas as configurações.

### Princípios
- ❌ **Não existe configuração padrão**
- ✅ **Todos os parâmetros são obrigatórios**
- ✅ **Validações rigorosas no backend**
- ✅ **Estrutura flexível e escalável**

### Stack Sugerida
- Node.js + Express / Nest.js
- PostgreSQL / MongoDB
- TypeScript
- Validação: Zod / Joi / class-validator

---

## 📊 Modelos de Dados

### 1. League (Liga Principal)

```typescript
interface League {
  // Identificação
  id: string;                           // UUID
  name: string;                         // Nome da liga
  createdAt: Date;                      // Data de criação
  updatedAt: Date;                      // Última atualização
  
  // Administração
  ownerId: string;                      // ID do criador/admin
  status: LeagueStatus;                 // 'draft' | 'active' | 'completed' | 'archived'
  
  // Estrutura da Liga (obrigatória)
  structure: LeagueStructure;
  
  // Escalação (obrigatória)
  lineupConfig: LineupConfiguration;
  
  // Pontuação (obrigatória)
  scoringRules: ScoringRules;
  
  // Participantes
  teams: LeagueTeam[];                  // Times da liga
  maxTeams: number;                     // Limite de times (10, 14 ou 16)
  
  // Configurações adicionais
  settings: LeagueSettings;
}

type LeagueStatus = 'draft' | 'active' | 'completed' | 'archived';
```

---

### 2. LeagueStructure (Estrutura da Liga)

```typescript
interface LeagueStructure {
  // Número de times
  totalTeams: 10 | 14 | 16;             // Opções fixas: 10, 14 ou 16
  
  // Divisões
  divisions: Division[];                // Array de divisões
  
  // Temporada
  regularSeasonWeeks: number;           // Ex: 14 semanas
  regularSeasonEndWeek: number;         // Semana que termina a temp. regular
  
  // Playoffs
  playoffWeeks: number[];               // Ex: [15, 16, 17]
  playoffTeams: number;                 // Times classificados (ex: 6)
  playoffByes: number;                  // Times com bye (ex: 2)
  
  // Validações calculadas
  totalWeeks: number;                   // regularSeasonWeeks + playoffWeeks.length
}

interface Division {
  id: string;                           // UUID
  name: string;                         // Ex: "Divisão Norte"
  teamsCount: number;                   // Número de times nesta divisão
  order: number;                        // Ordem de exibição
}

// Exemplo de validação
// totalTeams deve ser igual à soma de teamsCount de todas as divisions
// playoffTeams + playoffByes deve fazer sentido (ex: top 6, top 2 tem bye)
```

---

### 3. LineupConfiguration (Escalação)

```typescript
interface LineupConfiguration {
  // Posições obrigatórias
  positions: PositionSlot[];
  
  // Total de slots
  totalSlots: number;                   // Soma de todas as quantities
  
  // Bench (banco)
  benchSlots: number;                   // Slots de reserva
  
  // Validações
  minTotalSlots: number;                // Mínimo 7 slots
  maxTotalSlots: number;                // Máximo 12 slots
}

interface PositionSlot {
  position: PositionType;               // QB, RB, WR, TE, FLEX, K, DEF
  quantity: number;                     // Número de slots para esta posição
  required: boolean;                    // Se é obrigatório preencher
  flexEligible?: PositionType[];        // Para FLEX: ['RB', 'WR', 'TE']
}

type PositionType = 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'K' | 'DEF';

// Exemplo de configuração
const exampleLineup: LineupConfiguration = {
  positions: [
    { position: 'QB', quantity: 1, required: true },
    { position: 'RB', quantity: 2, required: true },
    { position: 'WR', quantity: 2, required: true },
    { position: 'TE', quantity: 1, required: true },
    { position: 'FLEX', quantity: 1, required: false, flexEligible: ['RB', 'WR', 'TE'] },
    { position: 'K', quantity: 1, required: true },
    { position: 'DEF', quantity: 1, required: true }
  ],
  totalSlots: 9,
  benchSlots: 6,
  minTotalSlots: 7,
  maxTotalSlots: 12
};
```

---

### 4. ScoringRules (Pontuação)

```typescript
interface ScoringRules {
  // Ataque - Passe
  passing: PassingScoring;
  
  // Ataque - Corrida
  rushing: RushingScoring;
  
  // Ataque - Recepção
  receiving: ReceivingScoring;
  
  // Kickers
  kicking: KickingScoring;
  
  // Defesa
  defense: DefenseScoring;
  
  // Extras
  bonuses?: BonusScoring[];             // Bônus adicionais opcionais
}

// ===== PASSING (Passe) =====
interface PassingScoring {
  touchdownPoints: number;              // Ex: 4 ou 6 pontos
  yardsPerPoint: number;                // Ex: 25 (1 ponto a cada 25 jardas)
  interceptionPoints: number;           // Ex: -2 (negativo)
  twoPointConversion?: number;          // Ex: 2 pontos
}

// ===== RUSHING (Corrida) =====
interface RushingScoring {
  touchdownPoints: number;              // Ex: 6 pontos
  yardsPerPoint: number;                // Ex: 10 (1 ponto a cada 10 jardas)
  twoPointConversion?: number;          // Ex: 2 pontos
}

// ===== RECEIVING (Recepção) =====
interface ReceivingScoring {
  receptionPoints: number;              // PPR: Ex: 0.5 ou 1 ponto
  touchdownPoints: number;              // Ex: 6 pontos
  yardsPerPoint: number;                // Ex: 10 (1 ponto a cada 10 jardas)
  twoPointConversion?: number;          // Ex: 2 pontos
}

// ===== KICKING (Chutes) =====
interface KickingScoring {
  extraPointMade: number;               // Ex: 1 ponto
  extraPointMissed?: number;            // Ex: -1 ponto
  fieldGoalMade: number;                // Ex: 3 pontos (base)
  fieldGoalMissed: number;              // Ex: -1 ponto
  
  // Bônus por distância
  fieldGoalDistance?: FieldGoalDistanceBonus[];
}

interface FieldGoalDistanceBonus {
  minYards: number;                     // Ex: 50
  maxYards?: number;                    // Ex: 59 (ou null para 50+)
  bonusPoints: number;                  // Ex: 2 pontos extras
}

// Exemplo:
// 0-39 jardas: 3 pontos
// 40-49 jardas: 4 pontos
// 50+ jardas: 5 pontos

// ===== DEFENSE (Defesa) =====
interface DefenseScoring {
  touchdown: number;                    // Ex: 6 pontos
  interception: number;                 // Ex: 2 pontos
  fumbleRecovery: number;               // Ex: 2 pontos
  sack: number;                         // Ex: 1 ponto
  safety: number;                       // Ex: 2 pontos
  
  // Pontos sofridos (faixas)
  pointsAllowedRanges: PointsAllowedRange[];
}

interface PointsAllowedRange {
  minPoints: number;                    // Ex: 0
  maxPoints: number | null;             // Ex: 6 (ou null para "14+")
  fantasyPoints: number;                // Ex: 10 pontos de fantasy
}

// Exemplo de faixas de pontos sofridos:
// 0 pontos: +10 fantasy
// 1-6 pontos: +7 fantasy
// 7-13 pontos: +4 fantasy
// 14-20 pontos: +1 fantasy
// 21-27 pontos: 0 fantasy
// 28+ pontos: -4 fantasy

// ===== BONUSES (Bônus) =====
interface BonusScoring {
  id: string;
  name: string;                         // Ex: "100+ Rushing Yards"
  description: string;
  condition: BonusCondition;
  points: number;
}

interface BonusCondition {
  statType: 'rushing' | 'receiving' | 'passing';
  threshold: number;                    // Ex: 100 (jardas)
  operator: '>=' | '>' | '=' | '<' | '<=';
}
```

---

### 5. LeagueSettings (Configurações Adicionais)

```typescript
interface LeagueSettings {
  // Regras gerais
  exclusivePlayerOwnership: boolean;    // Cada jogador em apenas 1 time (default: true)
  
  // Deadline de lineup
  lineupDeadlines: LineupDeadline[];
  
  // Trades
  tradeDeadlineWeek: number;            // Ex: semana 10
  tradeReviewPeriod: number;            // Horas de revisão (ex: 24h)
  
  // Waiver wire
  waiverType: 'FAAB' | 'Rolling' | 'Reverse';
  waiverProcessDay: number;             // Dia da semana (0-6)
  waiverProcessTime: string;            // Ex: "03:00" (UTC)
  
  // Outros
  allowCommissionerVeto: boolean;       // Admin pode vetar trades
  tiebreaker: 'BenchPoints' | 'HighestScorer' | 'Random';
}

interface LineupDeadline {
  dayOfWeek: number;                    // 0 (dom) a 6 (sáb)
  time: string;                         // Ex: "20:00" (UTC)
  description: string;                  // Ex: "Quinta-feira à noite"
}

// Exemplo de deadlines:
// Quinta: 20:00 (jogo de quinta)
// Domingo: 17:00 (bloco principal)
// Segunda: 20:00 (Monday Night Football)
```

---

### 6. LeagueTeam (Time da Liga)

```typescript
interface LeagueTeam {
  id: string;                           // UUID
  leagueId: string;                     // FK para League
  
  // Proprietário
  ownerId: string;                      // ID do usuário
  
  // Informações do time
  name: string;                         // Nome do time
  logo?: string;                        // URL do logo
  
  // Divisão
  divisionId: string;                   // FK para Division
  
  // Estatísticas
  wins: number;
  losses: number;
  ties: number;
  pointsFor: number;
  pointsAgainst: number;
  
  // Lineup atual
  currentLineup: TeamLineup;
  
  // Status
  isActive: boolean;
  joinedAt: Date;
}

interface TeamLineup {
  weekNumber: number;
  lastUpdated: Date;
  isLocked: boolean;
  
  // Jogadores titulares
  starters: LineupSlot[];
  
  // Banco
  bench: BenchSlot[];
}

interface LineupSlot {
  position: PositionType;
  slotIndex: number;                    // Ex: RB1 = 0, RB2 = 1
  playerId: string | null;
  playerName?: string;
  playerTeam?: string;
}

interface BenchSlot {
  playerId: string;
  playerName: string;
  playerPosition: PositionType;
  playerTeam: string;
}
```

---

## 🔌 Endpoints da API

### 1. Criar Liga

```http
POST /api/v1/leagues
Content-Type: application/json
Authorization: Bearer {token}

Request Body: CreateLeagueRequest (ver seção de exemplos)
Response: 201 Created + League object
```

**Validações**:
- ✅ Todos os campos obrigatórios preenchidos
- ✅ `totalTeams` em [10, 14, 16]
- ✅ Soma de `divisions.teamsCount` === `totalTeams`
- ✅ `playoffTeams` + `playoffByes` <= `totalTeams`
- ✅ `lineupConfig.totalSlots` === soma das `positions.quantity`
- ✅ Regras de pontuação válidas (sem valores null/undefined)

---

### 2. Obter Liga por ID

```http
GET /api/v1/leagues/{leagueId}
Authorization: Bearer {token}

Response: 200 OK + League object
```

---

### 3. Listar Ligas Disponíveis

```http
GET /api/v1/leagues
Authorization: Bearer {token}

Query Parameters:
  - status: 'draft' | 'active' | 'completed'
  - available: boolean (ligas com vagas disponíveis)
  - owned: boolean (ligas criadas pelo usuário)
  - joined: boolean (ligas que o usuário participa)

Response: 200 OK + League[]
```

---

### 4. Atualizar Configurações da Liga

```http
PATCH /api/v1/leagues/{leagueId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body: Partial<League> (apenas campos editáveis)
Response: 200 OK + League object

Restrições:
- Apenas o owner pode editar
- Não pode editar se status === 'active'
- Algumas configs são imutáveis após início (ex: totalTeams)
```

---

### 5. Deletar Liga

```http
DELETE /api/v1/leagues/{leagueId}
Authorization: Bearer {token}

Response: 204 No Content

Restrições:
- Apenas o owner pode deletar
- Apenas se status === 'draft'
```

---

### 6. Validar Configuração

```http
POST /api/v1/leagues/validate
Authorization: Bearer {token}
Content-Type: application/json

Request Body: CreateLeagueRequest (mesma estrutura de criação)
Response: 200 OK + ValidationResult

{
  "valid": boolean,
  "errors": ValidationError[]
}

ValidationError {
  "field": string,       // Ex: "structure.totalTeams"
  "message": string,     // Ex: "Deve ser 10, 14 ou 16"
  "code": string         // Ex: "INVALID_TEAM_COUNT"
}
```

**Uso**: Frontend pode chamar antes de submeter o formulário completo

---

### 7. Obter Templates de Configuração

```http
GET /api/v1/leagues/templates
Authorization: Bearer {token}

Response: 200 OK + LeagueTemplate[]

LeagueTemplate {
  id: string,
  name: string,             // Ex: "Liga Padrão 10 Times"
  description: string,
  config: Partial<League>   // Configuração pré-definida
}
```

**Nota**: Templates são apenas sugestões, **não aplicam valores automaticamente**. O usuário ainda precisa confirmar/editar todos os campos.

---

## ✅ Regras de Validação

### 1. Estrutura da Liga

```typescript
// Validação: totalTeams
const validTeamCounts = [10, 14, 16];
if (!validTeamCounts.includes(structure.totalTeams)) {
  throw new ValidationError('totalTeams deve ser 10, 14 ou 16');
}

// Validação: divisões
const sumOfDivisionTeams = structure.divisions.reduce(
  (sum, div) => sum + div.teamsCount, 
  0
);
if (sumOfDivisionTeams !== structure.totalTeams) {
  throw new ValidationError(
    'A soma dos times das divisões deve ser igual ao total de times'
  );
}

// Validação: playoffs
if (structure.playoffTeams + structure.playoffByes > structure.totalTeams) {
  throw new ValidationError(
    'playoffTeams + playoffByes não pode exceder totalTeams'
  );
}

// Validação: semanas
if (structure.regularSeasonWeeks < 1 || structure.regularSeasonWeeks > 17) {
  throw new ValidationError('regularSeasonWeeks deve estar entre 1 e 17');
}

if (structure.playoffWeeks.length < 1 || structure.playoffWeeks.length > 4) {
  throw new ValidationError('Deve ter entre 1 e 4 semanas de playoffs');
}
```

---

### 2. Escalação

```typescript
// Validação: posições obrigatórias
const requiredPositions = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];
for (const pos of requiredPositions) {
  const found = lineupConfig.positions.find(p => p.position === pos);
  if (!found || found.quantity < 1) {
    throw new ValidationError(`${pos} é obrigatório e deve ter pelo menos 1 slot`);
  }
}

// Validação: total de slots
const totalSlots = lineupConfig.positions.reduce(
  (sum, pos) => sum + pos.quantity, 
  0
);
if (totalSlots !== lineupConfig.totalSlots) {
  throw new ValidationError('totalSlots não corresponde à soma das positions');
}

if (totalSlots < lineupConfig.minTotalSlots || totalSlots > lineupConfig.maxTotalSlots) {
  throw new ValidationError(`totalSlots deve estar entre ${min} e ${max}`);
}

// Validação: FLEX
const flexPosition = lineupConfig.positions.find(p => p.position === 'FLEX');
if (flexPosition && !flexPosition.flexEligible) {
  throw new ValidationError('FLEX deve ter flexEligible definido');
}
```

---

### 3. Pontuação

```typescript
// Validação: valores obrigatórios
const requiredScoringFields = [
  'passing.touchdownPoints',
  'passing.yardsPerPoint',
  'passing.interceptionPoints',
  'rushing.touchdownPoints',
  'rushing.yardsPerPoint',
  'receiving.receptionPoints',
  'receiving.touchdownPoints',
  'receiving.yardsPerPoint',
  'kicking.extraPointMade',
  'kicking.fieldGoalMade',
  'kicking.fieldGoalMissed',
  'defense.touchdown',
  'defense.interception',
  'defense.fumbleRecovery',
  'defense.sack',
  'defense.safety'
];

for (const field of requiredScoringFields) {
  const value = _.get(scoringRules, field);
  if (value === undefined || value === null) {
    throw new ValidationError(`${field} é obrigatório`);
  }
}

// Validação: pontos sofridos pela defesa
if (!scoringRules.defense.pointsAllowedRanges || 
    scoringRules.defense.pointsAllowedRanges.length === 0) {
  throw new ValidationError('defense.pointsAllowedRanges é obrigatório');
}

// Validação: ranges não podem sobrepor
const ranges = scoringRules.defense.pointsAllowedRanges.sort(
  (a, b) => a.minPoints - b.minPoints
);
for (let i = 0; i < ranges.length - 1; i++) {
  const current = ranges[i];
  const next = ranges[i + 1];
  if (current.maxPoints !== null && current.maxPoints >= next.minPoints) {
    throw new ValidationError('Ranges de pontos sofridos não podem sobrepor');
  }
}
```

---

## 📝 Exemplos de Requests/Responses

### Exemplo 1: Criar Liga Padrão (10 times)

```json
POST /api/v1/leagues

{
  "name": "Liga dos Amigos 2025",
  "structure": {
    "totalTeams": 10,
    "divisions": [
      {
        "name": "Divisão Leste",
        "teamsCount": 5,
        "order": 1
      },
      {
        "name": "Divisão Oeste",
        "teamsCount": 5,
        "order": 2
      }
    ],
    "regularSeasonWeeks": 14,
    "regularSeasonEndWeek": 14,
    "playoffWeeks": [15, 16, 17],
    "playoffTeams": 6,
    "playoffByes": 2
  },
  "lineupConfig": {
    "positions": [
      { "position": "QB", "quantity": 1, "required": true },
      { "position": "RB", "quantity": 2, "required": true },
      { "position": "WR", "quantity": 2, "required": true },
      { "position": "TE", "quantity": 1, "required": true },
      { 
        "position": "FLEX", 
        "quantity": 1, 
        "required": false,
        "flexEligible": ["RB", "WR", "TE"]
      },
      { "position": "K", "quantity": 1, "required": true },
      { "position": "DEF", "quantity": 1, "required": true }
    ],
    "totalSlots": 9,
    "benchSlots": 6,
    "minTotalSlots": 7,
    "maxTotalSlots": 12
  },
  "scoringRules": {
    "passing": {
      "touchdownPoints": 4,
      "yardsPerPoint": 25,
      "interceptionPoints": -2,
      "twoPointConversion": 2
    },
    "rushing": {
      "touchdownPoints": 6,
      "yardsPerPoint": 10,
      "twoPointConversion": 2
    },
    "receiving": {
      "receptionPoints": 0.5,
      "touchdownPoints": 6,
      "yardsPerPoint": 10,
      "twoPointConversion": 2
    },
    "kicking": {
      "extraPointMade": 1,
      "extraPointMissed": -1,
      "fieldGoalMade": 3,
      "fieldGoalMissed": -1,
      "fieldGoalDistance": [
        { "minYards": 40, "maxYards": 49, "bonusPoints": 1 },
        { "minYards": 50, "maxYards": null, "bonusPoints": 2 }
      ]
    },
    "defense": {
      "touchdown": 6,
      "interception": 2,
      "fumbleRecovery": 2,
      "sack": 1,
      "safety": 2,
      "pointsAllowedRanges": [
        { "minPoints": 0, "maxPoints": 0, "fantasyPoints": 10 },
        { "minPoints": 1, "maxPoints": 6, "fantasyPoints": 7 },
        { "minPoints": 7, "maxPoints": 13, "fantasyPoints": 4 },
        { "minPoints": 14, "maxPoints": 20, "fantasyPoints": 1 },
        { "minPoints": 21, "maxPoints": 27, "fantasyPoints": 0 },
        { "minPoints": 28, "maxPoints": null, "fantasyPoints": -4 }
      ]
    },
    "bonuses": [
      {
        "name": "100+ Rushing Yards",
        "description": "Bônus por corrida de 100+ jardas",
        "condition": {
          "statType": "rushing",
          "threshold": 100,
          "operator": ">="
        },
        "points": 3
      }
    ]
  },
  "settings": {
    "exclusivePlayerOwnership": true,
    "lineupDeadlines": [
      { "dayOfWeek": 4, "time": "20:15", "description": "Quinta-feira à noite" },
      { "dayOfWeek": 0, "time": "17:00", "description": "Domingo tarde" },
      { "dayOfWeek": 1, "time": "20:15", "description": "Segunda-feira à noite" }
    ],
    "tradeDeadlineWeek": 10,
    "tradeReviewPeriod": 24,
    "waiverType": "FAAB",
    "waiverProcessDay": 3,
    "waiverProcessTime": "03:00",
    "allowCommissionerVeto": true,
    "tiebreaker": "BenchPoints"
  }
}
```

**Response**:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Liga dos Amigos 2025",
  "ownerId": "user-123",
  "status": "draft",
  "createdAt": "2025-11-10T14:30:00Z",
  "updatedAt": "2025-11-10T14:30:00Z",
  "structure": { /* ... mesma estrutura enviada ... */ },
  "lineupConfig": { /* ... mesma estrutura enviada ... */ },
  "scoringRules": { /* ... mesma estrutura enviada ... */ },
  "settings": { /* ... mesma estrutura enviada ... */ },
  "teams": [],
  "maxTeams": 10
}
```

---

### Exemplo 2: Validação com Erro

```json
POST /api/v1/leagues/validate

{
  "name": "Teste",
  "structure": {
    "totalTeams": 10,
    "divisions": [
      { "name": "Div A", "teamsCount": 6, "order": 1 },
      { "name": "Div B", "teamsCount": 3, "order": 2 }
    ]
    // ... resto da config
  }
}
```

**Response** (400 Bad Request):

```json
{
  "valid": false,
  "errors": [
    {
      "field": "structure.divisions",
      "message": "A soma dos times das divisões (9) não corresponde ao total de times (10)",
      "code": "DIVISION_TEAMS_MISMATCH"
    }
  ]
}
```

---

### Exemplo 3: Liga com Configuração Diferente (14 times, PPR 1.0)

```json
{
  "name": "Liga Elite PPR",
  "structure": {
    "totalTeams": 14,
    "divisions": [
      { "name": "Norte", "teamsCount": 7, "order": 1 },
      { "name": "Sul", "teamsCount": 7, "order": 2 }
    ],
    "regularSeasonWeeks": 13,
    "regularSeasonEndWeek": 13,
    "playoffWeeks": [14, 15, 16],
    "playoffTeams": 8,
    "playoffByes": 2
  },
  "lineupConfig": {
    "positions": [
      { "position": "QB", "quantity": 1, "required": true },
      { "position": "RB", "quantity": 2, "required": true },
      { "position": "WR", "quantity": 3, "required": true },
      { "position": "TE", "quantity": 1, "required": true },
      { 
        "position": "FLEX", 
        "quantity": 2, 
        "required": false,
        "flexEligible": ["RB", "WR", "TE"]
      },
      { "position": "K", "quantity": 1, "required": true },
      { "position": "DEF", "quantity": 1, "required": true }
    ],
    "totalSlots": 11,
    "benchSlots": 7,
    "minTotalSlots": 7,
    "maxTotalSlots": 12
  },
  "scoringRules": {
    "passing": {
      "touchdownPoints": 6,
      "yardsPerPoint": 25,
      "interceptionPoints": -2
    },
    "rushing": {
      "touchdownPoints": 6,
      "yardsPerPoint": 10
    },
    "receiving": {
      "receptionPoints": 1.0,
      "touchdownPoints": 6,
      "yardsPerPoint": 10
    },
    "kicking": {
      "extraPointMade": 1,
      "fieldGoalMade": 3,
      "fieldGoalMissed": -1
    },
    "defense": {
      "touchdown": 6,
      "interception": 2,
      "fumbleRecovery": 2,
      "sack": 1,
      "safety": 2,
      "pointsAllowedRanges": [
        { "minPoints": 0, "maxPoints": 6, "fantasyPoints": 10 },
        { "minPoints": 7, "maxPoints": 13, "fantasyPoints": 5 },
        { "minPoints": 14, "maxPoints": 20, "fantasyPoints": 0 },
        { "minPoints": 21, "maxPoints": null, "fantasyPoints": -5 }
      ]
    }
  },
  "settings": {
    "exclusivePlayerOwnership": true,
    "lineupDeadlines": [
      { "dayOfWeek": 0, "time": "17:00", "description": "Domingo" }
    ],
    "tradeDeadlineWeek": 12,
    "tradeReviewPeriod": 48,
    "waiverType": "Rolling",
    "waiverProcessDay": 3,
    "waiverProcessTime": "03:00",
    "allowCommissionerVeto": false,
    "tiebreaker": "HighestScorer"
  }
}
```

---

## 🔄 Fluxo de Criação de Liga

### Frontend (Passo a Passo)

```
1. Usuário clica "Criar Nova Liga"
   ↓
2. Formulário multi-step:
   
   Step 1: Nome e Estrutura
   - Nome da liga
   - Total de times (10, 14, 16)
   - Configurar divisões
   - Semanas de temporada regular
   - Configurar playoffs
   
   Step 2: Escalação
   - Quantidade por posição (QB, RB, WR, TE, FLEX, K, DEF)
   - Tamanho do banco
   
   Step 3: Pontuação - Ataque
   - Configurar pontos de passe
   - Configurar pontos de corrida
   - Configurar pontos de recepção (PPR)
   
   Step 4: Pontuação - Kickers
   - Extra points
   - Field goals
   - Bônus por distância
   
   Step 5: Pontuação - Defesa
   - TDs, INTs, Sacks, etc.
   - Faixas de pontos sofridos
   
   Step 6: Configurações Adicionais
   - Deadlines de lineup
   - Waiver wire
   - Trades
   
   Step 7: Revisão
   - Mostra resumo completo
   - Botão "Validar Configuração" (opcional)
   - Botão "Criar Liga"
   
   ↓
3. Frontend envia POST /api/v1/leagues
   ↓
4. Backend valida e cria
   ↓
5. Retorna liga criada com ID
   ↓
6. Frontend redireciona para página da liga
```

---

### Backend (Processamento)

```typescript
async function createLeague(req: Request, res: Response) {
  const userId = req.user.id; // Do token JWT
  const leagueData: CreateLeagueRequest = req.body;
  
  // 1. Validar dados
  const validation = await validateLeagueConfig(leagueData);
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors });
  }
  
  // 2. Criar liga no banco
  const league: League = {
    id: uuid(),
    name: leagueData.name,
    ownerId: userId,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
    structure: leagueData.structure,
    lineupConfig: leagueData.lineupConfig,
    scoringRules: leagueData.scoringRules,
    settings: leagueData.settings,
    teams: [],
    maxTeams: leagueData.structure.totalTeams
  };
  
  // 3. Salvar no banco de dados
  await db.leagues.create(league);
  
  // 4. Criar divisões
  for (const division of leagueData.structure.divisions) {
    await db.divisions.create({
      id: uuid(),
      leagueId: league.id,
      name: division.name,
      teamsCount: division.teamsCount,
      order: division.order
    });
  }
  
  // 5. Log de auditoria
  await db.auditLog.create({
    userId,
    action: 'CREATE_LEAGUE',
    entityType: 'League',
    entityId: league.id,
    timestamp: new Date()
  });
  
  // 6. Retornar liga criada
  return res.status(201).json(league);
}
```

---

## 🧪 Casos de Uso

### Caso 1: Liga Padrão 10 Times

```
Estrutura:
- 10 times
- 2 divisões de 5 times
- 14 semanas de temporada regular
- 3 semanas de playoffs (15-17)
- 6 times nos playoffs, 2 com bye

Escalação:
- 1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX, 1 K, 1 DEF
- Total: 9 slots titulares
- Banco: 6 slots

Pontuação:
- Passe TD: 4 pts
- Corrida TD: 6 pts
- Recepção: 0.5 pts (Half PPR)
- Field goal: 3 pts (+ bônus por distância)
```

---

### Caso 2: Liga Grande 14 Times, Full PPR

```
Estrutura:
- 14 times
- 2 divisões de 7 times
- 13 semanas de temporada regular
- 3 semanas de playoffs (14-16)
- 8 times nos playoffs, 2 com bye

Escalação:
- 1 QB, 2 RB, 3 WR, 1 TE, 2 FLEX, 1 K, 1 DEF
- Total: 11 slots titulares
- Banco: 7 slots

Pontuação:
- Passe TD: 6 pts
- Corrida TD: 6 pts
- Recepção: 1.0 pt (Full PPR)
- Field goal: 3 pts
```

---

### Caso 3: Liga SuperFlex 12 Times

```
Estrutura:
- 12 times
- 3 divisões de 4 times
- 13 semanas de temporada regular
- 4 semanas de playoffs (14-17)
- 6 times nos playoffs, 2 com bye

Escalação:
- 1 QB, 2 RB, 2 WR, 1 TE, 1 FLEX, 1 SUPERFLEX (QB/RB/WR/TE), 1 K, 1 DEF
- Total: 10 slots titulares
- Banco: 8 slots

Pontuação:
- Passe TD: 6 pts (SuperFlex valoriza QBs)
- Corrida TD: 6 pts
- Recepção: 0.5 pt
- Field goal: 3 pts
```

---

## 🛠️ Considerações de Implementação

### 1. Database Schema (PostgreSQL)

```sql
-- Tabela principal de ligas
CREATE TABLE leagues (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    
    -- JSONB para configurações complexas
    structure JSONB NOT NULL,
    lineup_config JSONB NOT NULL,
    scoring_rules JSONB NOT NULL,
    settings JSONB NOT NULL,
    
    max_teams INTEGER NOT NULL,
    
    -- Índices
    CONSTRAINT valid_max_teams CHECK (max_teams IN (10, 14, 16))
);

-- Índices
CREATE INDEX idx_leagues_owner ON leagues(owner_id);
CREATE INDEX idx_leagues_status ON leagues(status);
CREATE INDEX idx_leagues_created ON leagues(created_at DESC);

-- Tabela de divisões
CREATE TABLE divisions (
    id UUID PRIMARY KEY,
    league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    teams_count INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    
    CONSTRAINT teams_count_positive CHECK (teams_count > 0)
);

-- Tabela de times
CREATE TABLE league_teams (
    id UUID PRIMARY KEY,
    league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    division_id UUID REFERENCES divisions(id),
    owner_id UUID NOT NULL REFERENCES users(id),
    
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    
    -- Estatísticas
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    ties INTEGER DEFAULT 0,
    points_for DECIMAL(10, 2) DEFAULT 0,
    points_against DECIMAL(10, 2) DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP NOT NULL,
    
    -- Constraint: 1 time por usuário por liga
    CONSTRAINT unique_owner_per_league UNIQUE (league_id, owner_id)
);

-- Tabela de lineups
CREATE TABLE team_lineups (
    id UUID PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES league_teams(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    
    is_locked BOOLEAN DEFAULT false,
    last_updated TIMESTAMP NOT NULL,
    
    -- JSONB para slots
    starters JSONB NOT NULL,
    bench JSONB NOT NULL,
    
    CONSTRAINT unique_team_week UNIQUE (team_id, week_number)
);
```

---

### 2. Validações com Zod (TypeScript)

```typescript
import { z } from 'zod';

const PositionSlotSchema = z.object({
  position: z.enum(['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DEF']),
  quantity: z.number().int().min(0).max(5),
  required: z.boolean(),
  flexEligible: z.array(z.enum(['RB', 'WR', 'TE'])).optional()
});

const LineupConfigSchema = z.object({
  positions: z.array(PositionSlotSchema),
  totalSlots: z.number().int().min(7).max(12),
  benchSlots: z.number().int().min(0).max(10),
  minTotalSlots: z.number().int().default(7),
  maxTotalSlots: z.number().int().default(12)
}).refine(data => {
  const sum = data.positions.reduce((acc, pos) => acc + pos.quantity, 0);
  return sum === data.totalSlots;
}, {
  message: 'totalSlots deve ser igual à soma das quantities'
});

const LeagueStructureSchema = z.object({
  totalTeams: z.enum([10, 14, 16]),
  divisions: z.array(z.object({
    name: z.string().min(1).max(100),
    teamsCount: z.number().int().min(1),
    order: z.number().int().min(1)
  })),
  regularSeasonWeeks: z.number().int().min(1).max(17),
  regularSeasonEndWeek: z.number().int().min(1).max(17),
  playoffWeeks: z.array(z.number().int().min(1).max(18)),
  playoffTeams: z.number().int().min(2),
  playoffByes: z.number().int().min(0)
}).refine(data => {
  const sumTeams = data.divisions.reduce((acc, div) => acc + div.teamsCount, 0);
  return sumTeams === data.totalTeams;
}, {
  message: 'Soma de teamsCount deve ser igual a totalTeams'
});

// Schema completo
export const CreateLeagueSchema = z.object({
  name: z.string().min(3).max(100),
  structure: LeagueStructureSchema,
  lineupConfig: LineupConfigSchema,
  scoringRules: ScoringRulesSchema, // ... definir
  settings: LeagueSettingsSchema     // ... definir
});
```

---

### 3. Middleware de Autorização

```typescript
// Verificar se usuário é owner da liga
async function requireLeagueOwner(req: Request, res: Response, next: NextFunction) {
  const leagueId = req.params.leagueId;
  const userId = req.user.id;
  
  const league = await db.leagues.findById(leagueId);
  
  if (!league) {
    return res.status(404).json({ error: 'Liga não encontrada' });
  }
  
  if (league.ownerId !== userId) {
    return res.status(403).json({ error: 'Apenas o owner pode realizar esta ação' });
  }
  
  req.league = league;
  next();
}

// Uso:
router.patch('/leagues/:leagueId', authenticate, requireLeagueOwner, updateLeague);
router.delete('/leagues/:leagueId', authenticate, requireLeagueOwner, deleteLeague);
```

---

### 4. Testes Unitários (Jest)

```typescript
describe('League Validation', () => {
  it('should reject totalTeams not in [10, 14, 16]', () => {
    const config = { ...validConfig, structure: { ...validConfig.structure, totalTeams: 12 } };
    expect(() => validateLeagueConfig(config)).toThrow('totalTeams deve ser 10, 14 ou 16');
  });
  
  it('should reject divisions sum mismatch', () => {
    const config = {
      ...validConfig,
      structure: {
        totalTeams: 10,
        divisions: [
          { name: 'A', teamsCount: 5 },
          { name: 'B', teamsCount: 4 } // soma = 9, deveria ser 10
        ]
      }
    };
    expect(() => validateLeagueConfig(config)).toThrow('soma dos times das divisões');
  });
  
  it('should accept valid configuration', () => {
    const result = validateLeagueConfig(validConfig);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

---

### 5. Documentação OpenAPI (Swagger)

```yaml
openapi: 3.0.0
info:
  title: Fantasy Football League API
  version: 1.0.0
  description: API para criação e gerenciamento de ligas de Fantasy Football

paths:
  /api/v1/leagues:
    post:
      summary: Criar nova liga
      tags:
        - Leagues
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateLeagueRequest'
      responses:
        '201':
          description: Liga criada com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/League'
        '400':
          description: Dados inválidos
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'

components:
  schemas:
    League:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        ownerId:
          type: string
          format: uuid
        status:
          type: string
          enum: [draft, active, completed, archived]
        # ... outros campos
        
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

---

## 🚀 Próximos Passos

### Fase 1: Core API
- [ ] Implementar modelos de dados
- [ ] Criar endpoints de CRUD de ligas
- [ ] Implementar validações completas
- [ ] Testes unitários e de integração

### Fase 2: Integração Frontend
- [ ] Atualizar interfaces TypeScript no frontend
- [ ] Criar formulário multi-step de criação
- [ ] Integrar com endpoints da API
- [ ] Tratamento de erros de validação

### Fase 3: Features Avançadas
- [ ] Sistema de templates (sugestões)
- [ ] Clonagem de ligas existentes
- [ ] Histórico de alterações (audit log)
- [ ] Exportar/importar configurações

### Fase 4: Admin Tools
- [ ] Dashboard de ligas para admin
- [ ] Ferramentas de moderação
- [ ] Estatísticas de uso
- [ ] Backup/restore de configurações

---

**Última Atualização**: 10 de Novembro de 2025
**Versão**: 1.0
**Autor**: Documentação técnica para desenvolvimento da API de ligas parametrizáveis
