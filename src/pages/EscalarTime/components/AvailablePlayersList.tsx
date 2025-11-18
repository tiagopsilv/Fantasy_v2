import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export interface Player {
  id: string;
  name: string;
  position: "QB" | "RB" | "WR" | "TE" | "K" | "DEF";
  team: string;
  isAvailable: boolean;
}

interface AvailablePlayersListProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onAddToBench?: (player: Player) => void;
  isLocked?: boolean;
}

export function AvailablePlayersList({ 
  players, 
  onAddPlayer, 
  onAddToBench,
  isLocked = false 
}: AvailablePlayersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState<string>("ALL");

  const positions = ["ALL", "QB", "RB", "WR", "TE", "K", "DEF"];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = selectedPosition === "ALL" || player.position === selectedPosition;
    return matchesSearch && matchesPosition && player.isAvailable;
  });

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

  return (
    <div className="bg-[#2C2F33] rounded-lg border border-[#4A4E56] sm:h-auto h-full flex flex-col">
      <div className="p-4 sm:p-6 border-b border-[#4A4E56] flex-shrink-0">
        <h3 className="text-white mb-4 text-lg sm:text-xl">Jogadores Disponíveis</h3>
        
        {/* Busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B8BAC1] w-4 h-4" />
          <Input
            placeholder="Buscar jogador ou time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1A2238] border-[#4A4E56] text-white placeholder:text-[#B8BAC1] text-sm sm:text-base"
          />
        </div>

        {/* Filtro de posições */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {positions.map((position) => (
            <Button
              key={position}
              variant={selectedPosition === position ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPosition(position)}
              className={`text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 ${selectedPosition === position 
                ? "bg-[#0B6623] hover:bg-[#0B6623]/80 text-white" 
                : "border-[#4A4E56] text-[#B8BAC1] hover:bg-[#1A2238] hover:text-white"
              }`}
            >
              {position}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de jogadores */}
      <div className="overflow-y-auto flex-1 min-h-0">
        {filteredPlayers.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-[#B8BAC1] text-sm sm:text-base">
            Nenhum jogador encontrado
          </div>
        ) : (
          filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 sm:p-4 border-b border-[#4A4E56] hover:bg-[#1A2238] transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <Badge className={`${getPositionColor(player.position)} text-white border-0 text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 flex-shrink-0`}>
                  {player.position}
                </Badge>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium text-sm sm:text-base truncate">{player.name}</div>
                  <div className="text-[#B8BAC1] text-xs sm:text-sm">{player.team}</div>
                </div>
              </div>
              {!isLocked && (
                <div className="flex gap-1 ml-2 flex-shrink-0">
                  <Button
                    size="sm"
                    onClick={() => onAddPlayer(player)}
                    className="bg-[#0B6623] hover:bg-[#0B6623]/80 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Titular</span>
                  </Button>
                  {onAddToBench && (
                    <Button
                      size="sm"
                      onClick={() => onAddToBench(player)}
                      className="bg-[#4A4E56] hover:bg-[#4A4E56]/80 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                    >
                      <span className="hidden sm:inline">Banco</span>
                      <span className="sm:hidden">B</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}