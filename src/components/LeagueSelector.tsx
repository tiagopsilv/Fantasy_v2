import { useState } from "react";
import { Search, Users, Trophy, Calendar, ChevronRight, Star, Crown } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export interface League {
  id: string;
  name: string;
  type: "public" | "private" | "premium";
  teams: number;
  maxTeams: number;
  startDate: string;
  status: "draft" | "active" | "finished";
  buyIn: number;
  prizePool: number;
  owner: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "expert";
  format: "PPR" | "Standard" | "Half-PPR";
  isOwner?: boolean;
  isJoined?: boolean;
  avatar?: string;
}

interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: string;
  onLeagueSelect: (leagueId: string) => void;
  userName: string;
}

export function LeagueSelector({ leagues, selectedLeague, onLeagueSelect, userName }: LeagueSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "joined" | "available">("all");

  const filteredLeagues = leagues.filter(league => {
    const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         league.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
                         (filterType === "joined" && league.isJoined) ||
                         (filterType === "available" && !league.isJoined && league.teams < league.maxTeams);
    
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "premium": return <Crown className="w-4 h-4 text-[#FFD700]" />;
      case "private": return <Users className="w-4 h-4 text-[#00E6B3]" />;
      default: return <Users className="w-4 h-4 text-[#B8BAC1]" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "premium": return "bg-[#FFD700] text-[#1A2238]";
      case "private": return "bg-[#00E6B3] text-[#1A2238]";
      default: return "bg-[#4A4E56] text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-[#FFD700] text-[#1A2238]";
      case "active": return "bg-[#0B6623] text-white";
      case "finished": return "bg-[#4A4E56] text-white";
      default: return "bg-[#4A4E56] text-white";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-[#0B6623]";
      case "intermediate": return "text-[#FFD700]";
      case "expert": return "text-[#B22222]";
      default: return "text-[#B8BAC1]";
    }
  };

  const selectedLeagueData = leagues.find(l => l.id === selectedLeague);

  return (
    <div className="bg-[#2C2F33] rounded-lg p-4 sm:p-6 border border-[#4A4E56] space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-[#00E6B3]" />
        <h3 className="text-white text-lg sm:text-xl font-medium">Selecionar Liga</h3>
        {selectedLeagueData && (
          <Badge className="bg-[#0B6623] text-white text-xs sm:text-sm">
            Liga Selecionada
          </Badge>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B8BAC1]" />
          <Input
            placeholder="Buscar por nome da liga ou organizador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1A2238] border-[#4A4E56] text-white placeholder:text-[#B8BAC1] text-sm sm:text-base h-10 sm:h-auto"
          />
        </div>

        <div className="flex gap-2 sm:gap-3 flex-wrap">
          <Button
            size="sm"
            variant={filterType === "all" ? "default" : "ghost"}
            onClick={() => setFilterType("all")}
            className={`text-xs sm:text-sm ${filterType === "all" 
              ? "bg-[#0B6623] text-white" 
              : "text-[#B8BAC1] hover:text-white hover:bg-[#4A4E56]"
            }`}
          >
            Todas ({leagues.length})
          </Button>
          <Button
            size="sm"
            variant={filterType === "joined" ? "default" : "ghost"}
            onClick={() => setFilterType("joined")}
            className={`text-xs sm:text-sm ${filterType === "joined" 
              ? "bg-[#0B6623] text-white" 
              : "text-[#B8BAC1] hover:text-white hover:bg-[#4A4E56]"
            }`}
          >
            Minhas Ligas ({leagues.filter(l => l.isJoined).length})
          </Button>
          <Button
            size="sm"
            variant={filterType === "available" ? "default" : "ghost"}
            onClick={() => setFilterType("available")}
            className={`text-xs sm:text-sm ${filterType === "available" 
              ? "bg-[#0B6623] text-white" 
              : "text-[#B8BAC1] hover:text-white hover:bg-[#4A4E56]"
            }`}
          >
            Disponíveis ({leagues.filter(l => !l.isJoined && l.teams < l.maxTeams).length})
          </Button>
        </div>
      </div>

      {/* Selected League Summary */}
      {selectedLeagueData && (
        <div className="bg-[#1A2238] rounded-lg p-3 sm:p-4 border border-[#0B6623]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-white font-medium text-sm sm:text-base truncate">
                  {selectedLeagueData.name}
                </h4>
                {selectedLeagueData.isOwner && (
                  <Crown className="w-4 h-4 text-[#FFD700]" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="text-[#B8BAC1]">
                  <span className="text-[#00E6B3]">{selectedLeagueData.teams}</span>/{selectedLeagueData.maxTeams} times
                </div>
                <div className="text-[#B8BAC1]">
                  {selectedLeagueData.format} • <span className={getDifficultyColor(selectedLeagueData.difficulty)}>
                    {selectedLeagueData.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(selectedLeagueData.status)}>
              {selectedLeagueData.status === "draft" ? "Draft" : 
               selectedLeagueData.status === "active" ? "Ativa" : "Finalizada"}
            </Badge>
          </div>
        </div>
      )}

      {/* Leagues List */}
      <div className="space-y-3 max-h-96 overflow-y-auto mobile-scroll">
        {filteredLeagues.length === 0 ? (
          <div className="text-center py-6 text-[#B8BAC1] text-sm sm:text-base">
            {searchTerm ? "Nenhuma liga encontrada" : "Nenhuma liga disponível"}
          </div>
        ) : (
          filteredLeagues.map((league) => (
            <Card 
              key={league.id}
              className={`cursor-pointer transition-all duration-200 border hover:border-[#00E6B3] ${
                selectedLeague === league.id 
                  ? "border-[#0B6623] bg-[#0B6623]/10" 
                  : "border-[#4A4E56] bg-[#1A2238] hover:bg-[#1A2238]/80"
              }`}
              onClick={() => onLeagueSelect(league.id)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(league.type)}
                      <h4 className="text-white font-medium text-sm sm:text-base truncate">
                        {league.name}
                      </h4>
                      {league.isOwner && (
                        <Crown className="w-4 h-4 text-[#FFD700]" />
                      )}
                      {league.isJoined && (
                        <Star className="w-4 h-4 text-[#00E6B3] fill-current" />
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-[#B8BAC1] text-xs sm:text-sm mb-3 line-clamp-2">
                      {league.description}
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#B8BAC1]" />
                        <span className="text-[#B8BAC1]">
                          <span className="text-white">{league.teams}</span>/{league.maxTeams}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#B8BAC1]" />
                        <span className="text-[#B8BAC1]">{league.startDate}</span>
                      </div>
                      <div className="text-[#B8BAC1]">
                        Prize: <span className="text-[#FFD700]">R$ {league.prizePool.toLocaleString()}</span>
                      </div>
                      <div className="text-[#B8BAC1]">
                        <span className={getDifficultyColor(league.difficulty)}>
                          {league.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-[#B8BAC1]">
                        Organizador: <span className="text-white">{league.owner}</span>
                      </div>
                      <div className="flex gap-1">
                        <Badge className={getTypeColor(league.type)} variant="secondary">
                          {league.type === "premium" ? "Premium" : 
                           league.type === "private" ? "Privada" : "Pública"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Badge className={getStatusColor(league.status)} variant="secondary">
                      {league.status === "draft" ? "Draft" : 
                       league.status === "active" ? "Ativa" : "Finalizada"}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-[#B8BAC1]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* League Action */}
      {selectedLeague && (
        <div className="pt-4 border-t border-[#4A4E56]">
          <Button 
            className="w-full bg-[#0B6623] hover:bg-[#0B6623]/80 text-white text-sm sm:text-base"
            onClick={() => {/* Continue to team selection */}}
          >
            Continuar com Liga Selecionada
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}