import { Minus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BenchLimitsInfo } from "./BenchLimitsInfo";
import type { Player } from "./AvailablePlayersList";

interface BenchPlayersListProps {
  benchPlayers: Player[];
  onRemoveFromBench: (player: Player) => void;
  onMoveToLineup?: (player: Player) => void;
  isLocked?: boolean;
}

export function BenchPlayersList({ 
  benchPlayers, 
  onRemoveFromBench, 
  onMoveToLineup,
  isLocked = false 
}: BenchPlayersListProps) {
  const getPositionColor = (position: string) => {
    const colors = {
      QB: "bg-blue-600",
      RB: "bg-green-600", 
      WR: "bg-purple-600",
      TE: "bg-orange-600",
      K: "bg-yellow-600",
      DEF: "bg-red-600"
    };
    return colors[position as keyof typeof colors] || "bg-gray-600";
  };

  if (benchPlayers.length === 0) {
    return (
      <div className="bg-[#2C2F33] rounded-lg border border-[#4A4E56] p-4 sm:p-6">
        <h3 className="text-white mb-4 text-lg sm:text-xl">Banco de Reservas</h3>
        
        {/* Limites do Banco */}
        <div className="mb-4">
          <BenchLimitsInfo benchPlayers={benchPlayers} />
        </div>
        
        <div className="text-center text-[#B8BAC1] text-sm sm:text-base py-6">
          Nenhum jogador no banco
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2C2F33] rounded-lg border border-[#4A4E56] p-4 sm:p-6">
      <h3 className="text-white mb-4 text-lg sm:text-xl">Banco de Reservas</h3>
      
      {/* Limites do Banco */}
      <div className="mb-4">
        <BenchLimitsInfo benchPlayers={benchPlayers} />
      </div>
      
      <Alert className="border-[#4A4E56] bg-[#1A2238] mb-4">
        <Info className="w-4 h-4 text-[#00E6B3]" />
        <AlertDescription className="text-[#B8BAC1] text-xs sm:text-sm">
          Jogadores no banco não pontuam nesta semana
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        {benchPlayers.map((player) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 bg-[#1A2238] rounded-lg border border-[#4A4E56] opacity-75"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Badge className={`${getPositionColor(player.position)} text-white border-0 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 flex-shrink-0`}>
                {player.position}
              </Badge>
              <div className="min-w-0 flex-1">
                <div className="text-[#B8BAC1] font-medium text-sm sm:text-base truncate">{player.name}</div>
                <div className="text-[#888] text-xs sm:text-sm">{player.team} • No banco</div>
              </div>
            </div>
            
            <div className="flex gap-1 sm:gap-2 ml-2">
              {onMoveToLineup && !isLocked && (
                <Button
                  size="sm"
                  onClick={() => onMoveToLineup(player)}
                  className="bg-[#0B6623] hover:bg-[#0B6623]/80 text-white text-xs px-2 py-1 sm:px-3 sm:py-2"
                >
                  Titular
                </Button>
              )}
              {!isLocked && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onRemoveFromBench(player)}
                  className="bg-[#B22222] hover:bg-[#B22222]/80 text-white text-xs px-2 py-1 sm:px-3 sm:py-2"
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}