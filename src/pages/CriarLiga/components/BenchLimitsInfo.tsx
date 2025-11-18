import { Users, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Player } from "./AvailablePlayersList";

interface BenchLimitsInfoProps {
  benchPlayers: Player[];
}

interface BenchLimitsInfoProps {
  benchPlayers: Player[];
  compact?: boolean;
}

export function BenchLimitsInfo({ benchPlayers, compact = false }: BenchLimitsInfoProps) {
  // Contar jogadores no banco por posição
  const benchCounts = {
    QB: 0,
    RB: 0,
    WR: 0,
    TE: 0,
    K: 0,
    DEF: 0
  };

  benchPlayers.forEach(player => {
    benchCounts[player.position as keyof typeof benchCounts]++;
  });

  // Limites do banco
  const benchLimits = [
    { position: "QB", current: benchCounts.QB, max: 1, name: "Quarterback" },
    { position: "RB", current: benchCounts.RB, max: 3, name: "Running Back" },
    { position: "WR", current: benchCounts.WR, max: 3, name: "Wide Receiver" },
    { position: "TE", current: benchCounts.TE, max: 2, name: "Tight End" },
    { position: "K", current: benchCounts.K, max: 1, name: "Kicker" },
    { position: "DEF", current: benchCounts.DEF, max: 1, name: "Defesa" }
  ];

  const getStatusColor = (current: number, max: number) => {
    if (current === max) return "bg-[#FFD700]"; // At limit
    if (current === 0) return "bg-[#4A4E56]"; // Empty
    return "bg-[#00E6B3]"; // Good
  };

  const getStatusText = (current: number, max: number) => {
    if (current === max) return "Máximo";
    if (current === 0) return "Vazio";
    return "OK";
  };

  const totalBench = benchCounts.QB + benchCounts.RB + benchCounts.WR + benchCounts.TE + benchCounts.K + benchCounts.DEF;
  const maxTotal = 9; // Mesmo número de slots do titular

  if (compact) {
    return (
      <div className="flex items-center justify-between text-xs text-[#B8BAC1] mb-2">
        <span>Capacidade do Banco:</span>
        <Badge className={totalBench >= maxTotal ? "bg-[#FFD700]" : "bg-[#00E6B3]"} variant="secondary">
          {totalBench}/{maxTotal}
        </Badge>
      </div>
    );
  }

  return (
    <div className="bg-[#1A2238] rounded-lg p-3 border border-[#4A4E56]">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-[#00E6B3]" />
        <h4 className="text-white text-sm font-medium">Limites do Banco</h4>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {benchLimits.map(({ position, current, max, name }) => (
          <div key={position} className="flex items-center justify-between p-2 bg-[#2C2F33] rounded border border-[#4A4E56]">
            <div className="flex items-center gap-1.5">
              <span className="text-white text-xs font-medium">{position}</span>
              <Badge 
                className={`${getStatusColor(current, max)} text-white text-[10px] px-1.5 py-0.5`}
              >
                {getStatusText(current, max)}
              </Badge>
            </div>
            <span className="text-[#B8BAC1] text-xs">
              {current}/{max}
            </span>
          </div>
        ))}
      </div>

      {totalBench === 0 && (
        <div className="mt-3 p-2 bg-[#4A4E56]/20 rounded border border-[#4A4E56] text-center">
          <AlertCircle className="w-4 h-4 text-[#B8BAC1] mx-auto mb-1" />
          <p className="text-[#B8BAC1] text-xs">Banco vazio</p>
        </div>
      )}
    </div>
  );
}