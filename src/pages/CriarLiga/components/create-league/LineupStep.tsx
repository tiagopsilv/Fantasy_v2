import { Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LineupStepProps {
  lineup: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    K: number;
    DEF: number;
  };
  onChange: (lineup: LineupStepProps["lineup"]) => void;
}

const POSITIONS = [
  { key: "QB", label: "Quarterback", min: 1, max: 2, color: "#FF6B6B" },
  { key: "RB", label: "Running Back", min: 1, max: 4, color: "#4ECDC4" },
  { key: "WR", label: "Wide Receiver", min: 1, max: 4, color: "#45B7D1" },
  { key: "TE", label: "Tight End", min: 1, max: 3, color: "#96CEB4" },
  { key: "FLEX", label: "FLEX (RB/WR/TE)", min: 0, max: 3, color: "#FFEAA7" },
  { key: "K", label: "Kicker", min: 0, max: 2, color: "#DFE6E9" },
  { key: "DEF", label: "Defesa", min: 1, max: 2, color: "#A29BFE" },
] as const;

export function LineupStep({ lineup, onChange }: LineupStepProps) {
  const updatePosition = (key: keyof typeof lineup, delta: number) => {
    const position = POSITIONS.find(p => p.key === key);
    if (!position) return;

    const newValue = lineup[key] + delta;
    if (newValue >= position.min && newValue <= position.max) {
      onChange({ ...lineup, [key]: newValue });
    }
  };

  const totalSlots = Object.values(lineup).reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-white text-2xl mb-2">Escalação</h3>
        <p className="text-[#B8BAC1]">
          Configure quantos jogadores de cada posição farão parte do lineup titular
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {POSITIONS.map((position) => (
          <Card key={position.key} className="bg-[#2C2F33] border-[#4A4E56] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-white">{position.label}</h4>
                <p className="text-[#B8BAC1] text-sm">
                  Mín: {position.min} • Máx: {position.max}
                </p>
              </div>
              <Badge
                className="text-[#1A2238]"
                style={{ backgroundColor: position.color }}
              >
                {position.key}
              </Badge>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updatePosition(position.key, -1)}
                disabled={lineup[position.key] <= position.min}
                className="border-[#4A4E56] text-white hover:bg-[#1A2238] disabled:opacity-30"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <div className="w-16 h-16 rounded-lg bg-[#1A2238] flex items-center justify-center">
                <span className="text-white text-2xl">{lineup[position.key]}</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => updatePosition(position.key, 1)}
                disabled={lineup[position.key] >= position.max}
                className="border-[#4A4E56] text-white hover:bg-[#1A2238] disabled:opacity-30"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Lineup Preview */}
      <Card className="bg-[#2C2F33] border-[#00E6B3] p-6">
        <h4 className="text-white mb-4">Preview do Lineup</h4>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
          {Object.entries(lineup).map(([key, count]) => {
            const position = POSITIONS.find(p => p.key === key);
            if (!position || count === 0) return null;

            return Array.from({ length: count }).map((_, index) => (
              <div
                key={`${key}-${index}`}
                className="aspect-square rounded-lg flex flex-col items-center justify-center p-2"
                style={{ backgroundColor: position.color }}
              >
                <span className="text-[#1A2238] text-xs mb-1">
                  {position.key}
                </span>
                {count > 1 && (
                  <span className="text-[#1A2238] text-xs opacity-70">
                    {index + 1}
                  </span>
                )}
              </div>
            ));
          })}
        </div>

        <div className="mt-4 p-4 bg-[#1A2238] rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-[#B8BAC1]">Total de Posições Titulares:</span>
            <span className="text-white text-xl">{totalSlots}</span>
          </div>
        </div>
      </Card>

      <Card className="bg-[#1A2238] border-[#4A4E56] p-4">
        <p className="text-[#B8BAC1] text-sm">
          💡 <strong className="text-white">Dica:</strong> O FLEX permite maior flexibilidade estratégica, 
          permitindo que você escolha entre RB, WR ou TE com base no desempenho semanal.
        </p>
      </Card>
    </div>
  );
}
