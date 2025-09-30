import { X, Plus, ArrowDown, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Player } from "./AvailablePlayersList";

interface RosterSlotProps {
  position: string;
  player: Player | null;
  onRemovePlayer: (player: Player) => void;
  onMoveToBench?: (player: Player) => void;
  required?: boolean;
  isLocked?: boolean;
  isAdminAdjusted?: boolean;
}

export function RosterSlot({ 
  position, 
  player, 
  onRemovePlayer, 
  onMoveToBench,
  required = false,
  isLocked = false,
  isAdminAdjusted = false
}: RosterSlotProps) {
  const getPositionColor = (pos: string) => {
    const colors = {
      QB: "bg-blue-600",
      RB: "bg-green-600", 
      WR: "bg-purple-600",
      TE: "bg-orange-600",
      FLEX: "bg-indigo-600",
      K: "bg-yellow-600",
      DEF: "bg-red-600"
    };
    return colors[pos as keyof typeof colors] || "bg-gray-600";
  };

  return (
    <div className={`
      bg-[#1A2238] rounded-lg border-2 p-3 sm:p-4 transition-all relative
      ${player ? 'border-[#0B6623]' : required ? 'border-[#B22222] border-dashed' : 'border-[#4A4E56] border-dashed'}
      ${!player && !isLocked ? 'hover:border-[#00E6B3]' : ''}
    `}>
      {/* Admin adjustment indicator */}
      {isAdminAdjusted && (
        <div className="absolute -top-2 -right-2 bg-[#FFD700] rounded-full p-1">
          <Shield className="w-3 h-3 text-[#1A2238]" />
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <Badge className={`${getPositionColor(position)} text-white border-0 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1`}>
          {position}
        </Badge>
        {required && !player && (
          <Badge variant="destructive" className="bg-[#B22222] text-white text-[10px] sm:text-xs px-1 py-0.5 sm:px-1.5 sm:py-0.5">
            Obrigatório
          </Badge>
        )}
      </div>

      {player ? (
        <div className="space-y-2 sm:space-y-3">
          <div>
            <div className="text-white font-medium text-sm sm:text-base truncate">{player.name}</div>
            <div className="text-[#B8BAC1] text-xs sm:text-sm flex items-center gap-1">
              {player.team}
              {isAdminAdjusted && (
                <span className="text-[#FFD700] text-[10px]">• Ajustado pelo admin</span>
              )}
            </div>
          </div>
          
          {!isLocked && (
            <div className="flex gap-1 sm:gap-2">
              {onMoveToBench && (
                <Button
                  size="sm"
                  onClick={() => onMoveToBench(player)}
                  className="flex-1 bg-[#4A4E56] hover:bg-[#4A4E56]/80 text-white text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Banco
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemovePlayer(player)}
                className="flex-1 bg-[#B22222] hover:bg-[#B22222]/80 text-white text-xs sm:text-sm py-1.5 sm:py-2"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Remover
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
          <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-[#B8BAC1] mb-1 sm:mb-2" />
          <div className="text-[#B8BAC1] text-xs sm:text-sm">
            {isLocked ? 'Posição vazia' : required ? 'Posição obrigatória' : 'Clique para adicionar'}
          </div>
        </div>
      )}
    </div>
  );
}