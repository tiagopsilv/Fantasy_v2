import { TrendingUp, HelpCircle, User, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ScoringStepProps {
  scoring: {
    passingTD: number;
    passingYards: number;
    interception: number;
    rushingTD: number;
    rushingYards: number;
    reception: number;
    receivingYards: number;
    receivingTD: number;
    fgMade: number;
    fg50Plus: number;
    fgMissed: number;
    extraPoint: number;
    sack: number;
    defInterception: number;
    fumbleRecovery: number;
    defTD: number;
    pointsAllowed: number;
  };
  onChange: (scoring: ScoringStepProps["scoring"]) => void;
}

const SCORING_CATEGORIES = [
  {
    name: "Passe",
    color: "#FF6B6B",
    stats: [
      { key: "passingTD", label: "TD de Passe", tooltip: "Pontos por touchdown de passe", unit: "pts" },
      { key: "passingYards", label: "Jardas de Passe", tooltip: "Pontos por jarda de passe", unit: "pts/jarda" },
      { key: "interception", label: "Interceptação Lançada", tooltip: "Penalidade por interceptação", unit: "pts" },
    ],
  },
  {
    name: "Corrida",
    color: "#4ECDC4",
    stats: [
      { key: "rushingTD", label: "TD de Corrida", tooltip: "Pontos por touchdown de corrida", unit: "pts" },
      { key: "rushingYards", label: "Jardas de Corrida", tooltip: "Pontos por jarda de corrida", unit: "pts/jarda" },
    ],
  },
  {
    name: "Recepção",
    color: "#45B7D1",
    stats: [
      { key: "reception", label: "Recepção (PPR)", tooltip: "Pontos por recepção (Point Per Reception)", unit: "pts" },
      { key: "receivingYards", label: "Jardas Recebidas", tooltip: "Pontos por jarda recebida", unit: "pts/jarda" },
      { key: "receivingTD", label: "TD de Recepção", tooltip: "Pontos por touchdown de recepção", unit: "pts" },
    ],
  },
  {
    name: "Kicker",
    color: "#DFE6E9",
    stats: [
      { key: "fgMade", label: "Field Goal Convertido", tooltip: "Pontos por field goal convertido", unit: "pts" },
      { key: "fg50Plus", label: "FG 50+ Jardas", tooltip: "Bônus por field goal de 50+ jardas", unit: "pts" },
      { key: "fgMissed", label: "FG Perdido", tooltip: "Penalidade por field goal perdido", unit: "pts" },
      { key: "extraPoint", label: "Extra Point", tooltip: "Pontos por conversão de extra point", unit: "pts" },
    ],
  },
  {
    name: "Defesa",
    color: "#A29BFE",
    stats: [
      { key: "sack", label: "Sack", tooltip: "Pontos por sack do quarterback adversário", unit: "pts" },
      { key: "defInterception", label: "Interceptação Defensiva", tooltip: "Pontos por interceptação defensiva", unit: "pts" },
      { key: "fumbleRecovery", label: "Fumble Recuperado", tooltip: "Pontos por fumble recuperado", unit: "pts" },
      { key: "defTD", label: "TD Defensivo", tooltip: "Pontos por touchdown defensivo ou de special teams", unit: "pts" },
      { key: "pointsAllowed", label: "Pontos Sofridos", tooltip: "Penalidade por pontos sofridos (por ponto)", unit: "pts/ponto" },
    ],
  },
] as const;

export function ScoringStep({ scoring, onChange }: ScoringStepProps) {
  const updateStat = (key: keyof typeof scoring, value: number) => {
    onChange({ ...scoring, [key]: value });
  };

  // Exemplos calculados com os valores do usuário
  const examples = [
    {
      position: "QB",
      name: "Patrick Mahomes",
      stats: "300 jardas de passe, 2 TDs",
      details: [
        { label: "300 jardas", value: 300 * scoring.passingYards },
        { label: "2 TDs", value: 2 * scoring.passingTD },
      ],
      total: 300 * scoring.passingYards + 2 * scoring.passingTD,
      color: "#FF6B6B",
    },
    {
      position: "RB",
      name: "Christian McCaffrey",
      stats: "100 jardas de corrida, 1 TD, 5 recepções, 40 jardas recebidas",
      details: [
        { label: "100 jardas correndo", value: 100 * scoring.rushingYards },
        { label: "1 TD", value: scoring.rushingTD },
        { label: "5 recepções", value: 5 * scoring.reception },
        { label: "40 jardas recebidas", value: 40 * scoring.receivingYards },
      ],
      total: 100 * scoring.rushingYards + scoring.rushingTD + 5 * scoring.reception + 40 * scoring.receivingYards,
      color: "#4ECDC4",
    },
    {
      position: "WR",
      name: "Tyreek Hill",
      stats: "120 jardas recebidas, 8 recepções, 1 TD",
      details: [
        { label: "120 jardas", value: 120 * scoring.receivingYards },
        { label: "8 recepções", value: 8 * scoring.reception },
        { label: "1 TD", value: scoring.receivingTD },
      ],
      total: 120 * scoring.receivingYards + 8 * scoring.reception + scoring.receivingTD,
      color: "#45B7D1",
    },
    {
      position: "K",
      name: "Justin Tucker",
      stats: "3 FGs (incluindo 1 de 52 jardas), 2 extra points",
      details: [
        { label: "3 FGs", value: 3 * scoring.fgMade },
        { label: "1 FG 50+", value: scoring.fg50Plus },
        { label: "2 Extra Points", value: 2 * scoring.extraPoint },
      ],
      total: 3 * scoring.fgMade + scoring.fg50Plus + 2 * scoring.extraPoint,
      color: "#DFE6E9",
    },
    {
      position: "DEF",
      name: "San Francisco 49ers",
      stats: "3 sacks, 2 INTs, 1 TD defensivo, 14 pontos sofridos",
      details: [
        { label: "3 sacks", value: 3 * scoring.sack },
        { label: "2 INTs", value: 2 * scoring.defInterception },
        { label: "1 TD", value: scoring.defTD },
        { label: "14 pts sofridos", value: 14 * scoring.pointsAllowed },
      ],
      total: 3 * scoring.sack + 2 * scoring.defInterception + scoring.defTD + 14 * scoring.pointsAllowed,
      color: "#A29BFE",
    },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-white text-2xl mb-2">Pontuação e Estatísticas</h3>
          <p className="text-[#B8BAC1]">
            Configure os pontos para cada estatística
          </p>
          <Badge className="bg-[#00E6B3] text-[#1A2238] mt-2">
            Sistema PPR (Point Per Reception)
          </Badge>
        </div>

        <div className="space-y-6">
          {SCORING_CATEGORIES.map((category) => (
            <Card key={category.name} className="bg-[#2C2F33] border-[#4A4E56] p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: category.color }}
                />
                <h4 className="text-white">{category.name}</h4>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {category.stats.map((stat) => (
                  <div key={stat.key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-white text-sm flex-1">
                        {stat.label}
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-[#B8BAC1] cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1A2238] border-[#4A4E56] text-white">
                          <p>{stat.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={scoring[stat.key as keyof typeof scoring]}
                        onChange={(e) =>
                          updateStat(stat.key as keyof typeof scoring, Number(e.target.value))
                        }
                        className="bg-[#1A2238] border-[#4A4E56] text-white"
                      />
                      <span className="text-[#B8BAC1] text-sm whitespace-nowrap w-20">
                        {stat.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Scoring Summary with Real Examples */}
        <Card className="bg-[#2C2F33] border-[#00E6B3] p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#00E6B3]" />
            <h4 className="text-white">Resumo de Pontuação</h4>
          </div>

          <p className="text-[#B8BAC1] text-sm mb-6">
            Veja como jogadores pontuariam com suas configurações:
          </p>

          <div className="space-y-4">
            {examples.map((example) => (
              <Card key={example.position} className="bg-[#1A2238] border-[#4A4E56] p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: example.color + '20', border: `2px solid ${example.color}` }}
                    >
                      <User className="w-5 h-5" style={{ color: example.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className="text-xs"
                          style={{ backgroundColor: example.color, color: '#1A2238' }}
                        >
                          {example.position}
                        </Badge>
                        <span className="text-white">{example.name}</span>
                      </div>
                      <p className="text-[#B8BAC1] text-sm mt-1">
                        {example.stats}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-white text-xl">
                        {example.total.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-[#B8BAC1] text-xs">pontos</span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#4A4E56]">
                  {example.details.map((detail, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-[#B8BAC1] text-xs">{detail.label}</p>
                      <p className="text-white text-sm">
                        {detail.value >= 0 ? '+' : ''}{detail.value.toFixed(1)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Comparação PPR */}
        <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
          <h4 className="text-white mb-4">💡 Impacto do Sistema PPR</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1A2238] rounded-lg p-4">
              <p className="text-[#B8BAC1] text-sm mb-2">RB com 100 jardas, 1 TD, 5 recepções:</p>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs">Com PPR ({scoring.reception} pt/rec):</span>
                <span className="text-[#00E6B3]">
                  {(100 * scoring.rushingYards + scoring.rushingTD + 5 * scoring.reception).toFixed(1)} pts
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white text-xs">Sem PPR (0 pt/rec):</span>
                <span className="text-[#B8BAC1]">
                  {(100 * scoring.rushingYards + scoring.rushingTD).toFixed(1)} pts
                </span>
              </div>
              <p className="text-[#00E6B3] text-xs mt-2">
                Diferença: +{(5 * scoring.reception).toFixed(1)} pontos
              </p>
            </div>

            <div className="bg-[#1A2238] rounded-lg p-4">
              <p className="text-[#B8BAC1] text-sm mb-2">WR com 80 jardas, 1 TD, 8 recepções:</p>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs">Com PPR ({scoring.reception} pt/rec):</span>
                <span className="text-[#00E6B3]">
                  {(80 * scoring.receivingYards + scoring.receivingTD + 8 * scoring.reception).toFixed(1)} pts
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white text-xs">Sem PPR (0 pt/rec):</span>
                <span className="text-[#B8BAC1]">
                  {(80 * scoring.receivingYards + scoring.receivingTD).toFixed(1)} pts
                </span>
              </div>
              <p className="text-[#00E6B3] text-xs mt-2">
                Diferença: +{(8 * scoring.reception).toFixed(1)} pontos
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1A2238] border-[#4A4E56] p-4">
          <p className="text-[#B8BAC1] text-sm">
            💡 <strong className="text-white">Dica:</strong> O sistema PPR (Point Per Reception) 
            valoriza mais os recebedores, equilibrando o valor entre RBs e WRs. Para um jogo 
            mais tradicional, você pode definir "Recepção (PPR)" como 0.
          </p>
        </Card>
      </div>
    </TooltipProvider>
  );
}
