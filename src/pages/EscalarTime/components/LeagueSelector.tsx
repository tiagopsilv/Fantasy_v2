import { useState } from "react";
import { Search, Users, Trophy, ChevronRight, Star, Crown, Plus, ChevronDown, Shield, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LeagueRulesExplainer } from "./LeagueRulesExplainer";
import { LeagueRulesCompact } from "./LeagueRulesCompact";
import type { LeagueTeam, LeagueDivision } from "./DivisionSelector";

export interface League {
  id: string;
  name: string;
  teams: number;
  maxTeams: number;
  owner: string;
  isOwner?: boolean;
  isJoined?: boolean;
  userTeamName?: string;
  hasLineup?: boolean;
  registeredTeams?: LeagueTeam[];
  divisions?: LeagueDivision[];
  hasDivisions?: boolean;
}

export interface LeagueSelectorProps {
  leagues: League[];
  selectedLeague: string;
  onLeagueSelect: (leagueId: string) => void;
  userName: string;
  onCreateLeague?: () => void;
}

export function LeagueSelector({ leagues, selectedLeague, onLeagueSelect, userName, onCreateLeague }: LeagueSelectorProps) {
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

  const selectedLeagueData = leagues.find(l => l.id === selectedLeague);

  const handleCreateLeague = () => {
    if (onCreateLeague) {
      onCreateLeague();
    } else {
      window.location.href = '/criar-liga';
    }
  };

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
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="text-[#B8BAC1]">
                  <span className="text-[#00E6B3]">{selectedLeagueData.teams}</span>/{selectedLeagueData.maxTeams} participantes
                </div>
                <div className="text-[#B8BAC1]">
                  Organizador: <span className="text-white">{selectedLeagueData.owner}</span>
                </div>
              </div>
            </div>
            <Badge className="bg-[#0B6623] text-white">
              Ativa
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
            <Collapsible key={league.id} className="w-full">
              <Card 
                className={`transition-all duration-200 border hover:border-[#00E6B3] ${
                  selectedLeague === league.id 
                    ? "border-[#0B6623] bg-[#0B6623]/10" 
                    : "border-[#4A4E56] bg-[#1A2238] hover:bg-[#1A2238]/80"
                }`}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {/* Header da Liga */}
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => onLeagueSelect(league.id)}
                      >
                        <Users className="w-5 h-5 text-[#00E6B3] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-white font-medium text-sm sm:text-base truncate">
                              {league.name}
                            </h4>
                            {league.isOwner && (
                              <Crown className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
                            )}
                            {league.isJoined && (
                              <Star className="w-4 h-4 text-[#00E6B3] fill-current flex-shrink-0" />
                            )}
                          </div>
                          <div className="space-y-1 text-xs sm:text-sm">
                            <div className="text-[#B8BAC1] flex items-center gap-2 flex-wrap">
                              <span><span className="text-[#00E6B3]">{league.teams}</span>/{league.maxTeams} participantes</span>
                              {league.hasDivisions && (
                                <Badge className="bg-[#4A4E56] text-[#00E6B3] text-xs">
                                  {league.divisions?.length} Divisões
                                </Badge>
                              )}
                              {league.teams < league.maxTeams && (
                                <Badge className="bg-[#00E6B3]/20 text-[#00E6B3] text-xs border border-[#00E6B3]">
                                  {league.maxTeams - league.teams} {league.maxTeams - league.teams === 1 ? 'vaga' : 'vagas'}
                                </Badge>
                              )}
                            </div>
                            <div className="text-[#B8BAC1]">
                              Organizador: <span className="text-white">{league.owner}</span>
                            </div>
                            {league.userTeamName && (
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#4A4E56]">
                                <Badge className={`text-xs ${
                                  league.hasLineup 
                                    ? "bg-[#0B6623] text-white" 
                                    : "bg-[#B22222] text-white"
                                }`}>
                                  {league.hasLineup ? "Lineup Cadastrado" : "Lineup Pendente"}
                                </Badge>
                                <span className="text-[#00E6B3] truncate">
                                  {league.userTeamName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Botões de Ação */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {/* Botão Ver Regras */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#00E6B3] hover:text-white hover:bg-[#4A4E56] h-8 px-3"
                            >
                              <BookOpen className="w-4 h-4 mr-1" />
                              <span className="text-xs">Regras</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#1A2238] border-[#4A4E56] max-w-4xl max-h-[90vh] overflow-y-auto mobile-scroll">
                            <DialogHeader>
                              <DialogTitle className="text-white text-xl sm:text-2xl">
                                Regras da Liga: {league.name}
                              </DialogTitle>
                            </DialogHeader>
                            <LeagueRulesExplainer
                              seasonSettings={{
                                regularSeasonStart: 1,
                                regularSeasonEnd: 14,
                                playoffStart: 15,
                                playoffEnd: 17,
                                playoffTeams: league.hasDivisions ? 6 : 4
                              }}
                              scoringSettings={{
                                passTD: 4,
                                passYards: 1,
                                interception: -2,
                                rushTD: 6,
                                rushYards: 1,
                                receptionPPR: 1,
                                recYards: 1,
                                recTD: 6,
                                fgMade: 3,
                                fg50Plus: 1,
                                fgMissed: -1,
                                extraPoint: 1,
                                sack: 1,
                                defInterception: 2,
                                fumbleRecovery: 2,
                                defTD: 6,
                                pointsAllowed: 10
                              }}
                            />
                          </DialogContent>
                        </Dialog>

                        {/* Botão Expandir Times */}
                        {league.registeredTeams && league.registeredTeams.length > 0 && (
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#00E6B3] hover:text-white hover:bg-[#4A4E56] h-8 px-3"
                            >
                              <span className="text-xs mr-1">Ver Times</span>
                              <ChevronDown className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180" />
                            </Button>
                          </CollapsibleTrigger>
                        )}
                      </div>
                    </div>

                    {/* Lista de Times (Collapsible) */}
                    {league.registeredTeams && league.registeredTeams.length > 0 && (
                      <CollapsibleContent className="space-y-3">
                        <Separator className="bg-[#4A4E56]" />
                        
                        <div className="space-y-2">
                          <h5 className="text-[#00E6B3] text-xs font-medium flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            TIMES CADASTRADOS
                          </h5>
                          
                          {!league.hasDivisions ? (
                            // Ligas sem divisões
                            <div className="space-y-2">
                              {league.registeredTeams.map((team, idx) => (
                                <div 
                                  key={team.id}
                                  className="bg-[#1A2238] rounded p-2 flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="bg-[#0B6623] rounded-full w-6 h-6 flex items-center justify-center text-white text-xs">
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <div className="text-white text-xs">{team.name}</div>
                                      <div className="text-[#B8BAC1] text-xs">@{team.owner}</div>
                                    </div>
                                  </div>
                                  {team.owner === userName && (
                                    <Badge className="bg-[#00E6B3] text-[#1A2238] text-xs">
                                      Você
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Ligas com divisões
                            <div className="space-y-3">
                              {league.divisions?.map((division) => (
                                <div key={division.name} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-[#00E6B3]" />
                                    <span className="text-[#00E6B3] text-xs font-medium">{division.name}</span>
                                    <Badge className="bg-[#4A4E56] text-white text-xs">
                                      {division.teams.length}
                                    </Badge>
                                  </div>
                                  <div className="space-y-1 pl-5">
                                    {division.teams.map((team) => (
                                      <div 
                                        key={team.id}
                                        className="bg-[#1A2238] rounded p-2 flex items-center justify-between"
                                      >
                                        <div>
                                          <div className="text-white text-xs">{team.name}</div>
                                          <div className="text-[#B8BAC1] text-xs">@{team.owner}</div>
                                        </div>
                                        {team.owner === userName && (
                                          <Badge className="bg-[#00E6B3] text-[#1A2238] text-xs">
                                            Você
                                          </Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    )}

                    {/* Regras da Liga - Sempre Visível */}
                    <div className="pt-3 border-t border-[#4A4E56]">
                      <LeagueRulesCompact
                        seasonSettings={{
                          regularSeasonStart: 1,
                          regularSeasonEnd: 14,
                          playoffStart: 15,
                          playoffEnd: 17,
                          playoffTeams: league.hasDivisions ? 6 : 4
                        }}
                        scoringSettings={{
                          passTD: 4,
                          passYards: 1,
                          interception: -2,
                          rushTD: 6,
                          rushYards: 1,
                          receptionPPR: 1,
                          recYards: 1,
                          recTD: 6,
                          fgMade: 3,
                          fg50Plus: 1,
                          fgMissed: -1,
                          extraPoint: 1,
                          sack: 1,
                          defInterception: 2,
                          fumbleRecovery: 2,
                          defTD: 6,
                          pointsAllowed: 10
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>

      {/* Create League Option */}
      <div className="space-y-3">
        <Separator className="bg-[#4A4E56]" />
        
        <div className="text-center">
          <p className="text-[#B8BAC1] text-xs sm:text-sm mb-3">
            Não encontrou a liga ideal?
          </p>
          <Button 
            onClick={handleCreateLeague}
            className="w-full bg-[#00E6B3] hover:bg-[#00E6B3]/80 text-[#1A2238]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Nova Liga
          </Button>
        </div>
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