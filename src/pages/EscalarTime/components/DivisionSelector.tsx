import * as React from "react";
import { Shield, Users, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface LeagueTeam {
  id: string;
  name: string;
  owner: string;
  division?: string;
}

export interface LeagueDivision {
  name: string;
  teams: LeagueTeam[];
}

export interface DivisionSelectorProps {
  divisions: LeagueDivision[];
  selectedDivision: string | null;
  onDivisionSelect: (divisionName: string) => void;
  userName: string;
  maxTeamsPerDivision: number;
}

// Componente interno para Card de Divisão
interface DivisionCardProps {
  division: LeagueDivision;
  isSelected: boolean;
  maxTeams: number;
  userName: string;
  onSelect: (name: string) => void;
}

const DivisionCard: React.FC<DivisionCardProps> = React.memo(({
  division,
  isSelected,
  maxTeams,
  userName,
  onSelect
}) => {
  const currentTeams = division.teams.length;
  const isFull = currentTeams >= maxTeams;
  const availableSlots = maxTeams - currentTeams;
  const hasTeams = currentTeams > 0;

  const cardStyles = React.useMemo(() => {
    if (isSelected) return "border-[#0B6623] bg-[#0B6623]/10";
    if (isFull) return "border-[#4A4E56] bg-[#1A2238]/50 opacity-60 cursor-not-allowed";
    return "border-[#4A4E56] bg-[#1A2238] hover:border-[#00E6B3] hover:bg-[#1A2238]/80";
  }, [isSelected, isFull]);

  const handleClick = React.useCallback(() => {
    if (!isFull) onSelect(division.name);
  }, [isFull, onSelect, division.name]);

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 border-2 ${cardStyles}`}
      onClick={handleClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Shield className="w-4 h-4 text-[#00E6B3] flex-shrink-0" />
            <h4 className="text-white font-medium text-sm sm:text-base truncate">
              {division.name}
            </h4>
          </div>
          {isSelected ? (
            <CheckCircle2 className="w-5 h-5 text-[#0B6623] flex-shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-[#4A4E56] flex-shrink-0" />
          )}
        </div>

        {/* Info de Times */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-[#B8BAC1]" />
            <span className="text-xs text-[#B8BAC1]">
              <span className={isFull ? "text-[#B22222]" : "text-[#00E6B3]"}>
                {currentTeams}
              </span>
              /{maxTeams} times
            </span>
          </div>
          {isFull ? (
            <Badge className="bg-[#B22222] text-white text-xs">
              Completa
            </Badge>
          ) : (
            <Badge className="bg-[#00E6B3]/20 text-[#00E6B3] text-xs border border-[#00E6B3]">
              {availableSlots} {availableSlots === 1 ? 'vaga' : 'vagas'}
            </Badge>
          )}
        </div>

        {/* Lista de Times */}
        {hasTeams ? (
          <div className="space-y-2 pt-2 border-t border-[#4A4E56]">
            <div className="text-[#B8BAC1] text-xs font-medium">
              Times cadastrados:
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto mobile-scroll">
              {division.teams.map((team) => (
                <TeamItem 
                  key={team.id} 
                  team={team} 
                  userName={userName} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-2 text-[#B8BAC1] text-xs border-t border-[#4A4E56] pt-3">
            Nenhum time cadastrado
          </div>
        )}
      </CardContent>
    </Card>
  );
});

DivisionCard.displayName = "DivisionCard";

// Componente interno para Item de Time
interface TeamItemProps {
  team: LeagueTeam;
  userName: string;
}

const TeamItem: React.FC<TeamItemProps> = React.memo(({ team, userName }) => {
  const isUserTeam = team.owner === userName;

  return (
    <div className="bg-[#1A2238] rounded p-2 flex items-center justify-between gap-2">
      <div className="flex-1 min-w-0">
        <div className="text-white text-xs truncate">{team.name}</div>
        <div className="text-[#B8BAC1] text-xs truncate">@{team.owner}</div>
      </div>
      {isUserTeam && (
        <Badge className="bg-[#00E6B3] text-[#1A2238] text-xs flex-shrink-0">
          Você
        </Badge>
      )}
    </div>
  );
});

TeamItem.displayName = "TeamItem";

// Componente principal
export const DivisionSelector: React.FC<DivisionSelectorProps> = React.memo(({ 
  divisions, 
  selectedDivision, 
  onDivisionSelect, 
  userName,
  maxTeamsPerDivision 
}) => {
  const handleSelection = React.useCallback((divisionName: string) => {
    onDivisionSelect(divisionName);
  }, [onDivisionSelect]);

  const confirmationMessage = React.useMemo(() => 
    selectedDivision ? `Confirmar Divisão: ${selectedDivision}` : "",
    [selectedDivision]
  );

  return (
    <div className="bg-[#2C2F33] rounded-lg p-4 sm:p-6 border-2 border-[#00E6B3] shadow-lg shadow-[#00E6B3]/20 space-y-4">
      {/* Cabeçalho Principal */}
      <div className="space-y-2 pb-3 border-b-2 border-[#00E6B3]/50">
        <div className="flex items-center gap-3">
          <div className="bg-[#00E6B3] p-2 rounded-lg">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A2238]" />
          </div>
          <h3 className="text-white text-xl sm:text-2xl font-bold">Escolher Divisão</h3>
        </div>
        <p className="text-[#B8BAC1] text-sm sm:text-base">
          Esta liga possui divisões. Selecione a divisão que você deseja participar.
        </p>
      </div>

      {/* Grid de Divisões */}
      <div className="mt-4 w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {divisions.map((division) => (
          <DivisionCard
            key={division.name}
            division={division}
            isSelected={selectedDivision === division.name}
            maxTeams={maxTeamsPerDivision}
            userName={userName}
            onSelect={handleSelection}
          />
        ))}
      </div>

      {/* Confirmação */}
      {selectedDivision && (
        <div className="pt-2">
          <Button
            className="w-full bg-[#0B6623] hover:bg-[#0B6623]/80 text-white"
            onClick={() => {
              // Confirmação visual - seleção já registrada
            }}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {confirmationMessage}
          </Button>
        </div>
      )}
    </div>
  );
});

DivisionSelector.displayName = "DivisionSelector";
