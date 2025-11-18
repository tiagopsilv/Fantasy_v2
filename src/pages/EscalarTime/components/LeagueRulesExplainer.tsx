import { Calendar, Trophy, TrendingUp, Users, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LeagueRulesExplainerProps {
  seasonSettings: {
    regularSeasonStart: number;
    regularSeasonEnd: number;
    playoffStart: number;
    playoffEnd: number;
    playoffTeams: number;
  };
  scoringSettings: {
    passTD: number;
    passYards: number;
    interception: number;
    rushTD: number;
    rushYards: number;
    receptionPPR: number;
    recYards: number;
    recTD: number;
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
}

export function LeagueRulesExplainer({ seasonSettings, scoringSettings }: LeagueRulesExplainerProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Temporada Regular */}
      <Card className="bg-[#2C2F33] border-[#4A4E56]">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="bg-[#0B6623]/20 p-2 rounded-lg">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B6623]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-1">
                Temporada Regular
              </h3>
              <p className="text-[#B8BAC1] text-sm">
                Período de duração da temporada regular e playoffs da liga
              </p>
            </div>
          </div>

          <Separator className="bg-[#4A4E56]" />

          {/* Grid de Informações da Temporada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Temporada Regular */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#00E6B3]" />
                <span className="text-[#00E6B3] font-medium text-sm">TEMPORADA REGULAR</span>
              </div>
              
              <div className="space-y-2 pl-6">
                <div className="flex items-center justify-between bg-[#1A2238] rounded p-2">
                  <span className="text-[#B8BAC1] text-sm">Semana Inicial NFL</span>
                  <Badge className="bg-[#0B6623] text-white font-semibold">
                    Semana {seasonSettings.regularSeasonStart}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between bg-[#1A2238] rounded p-2">
                  <span className="text-[#B8BAC1] text-sm">Semana Final NFL</span>
                  <Badge className="bg-[#0B6623] text-white font-semibold">
                    Semana {seasonSettings.regularSeasonEnd}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between bg-[#1A2238] rounded p-2">
                  <span className="text-[#B8BAC1] text-sm">Total de Semanas</span>
                  <Badge className="bg-[#4A4E56] text-white font-semibold">
                    {seasonSettings.regularSeasonEnd - seasonSettings.regularSeasonStart + 1} semanas
                  </Badge>
                </div>
              </div>
            </div>

            {/* Playoffs */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FFD700]" />
                <span className="text-[#FFD700] font-medium text-sm">PLAYOFFS</span>
              </div>
              
              <div className="space-y-2 pl-6">
                <div className="flex items-center justify-between bg-[#1A2238] rounded p-2">
                  <span className="text-[#B8BAC1] text-sm">Semana Inicial NFL</span>
                  <Badge className="bg-[#FFD700] text-[#1A2238] font-semibold">
                    Semana {seasonSettings.playoffStart}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between bg-[#1A2238] rounded p-2">
                  <span className="text-[#B8BAC1] text-sm">Semana Final NFL</span>
                  <Badge className="bg-[#FFD700] text-[#1A2238] font-semibold">
                    Semana {seasonSettings.playoffEnd}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between bg-[#1A2238] rounded p-2">
                  <span className="text-[#B8BAC1] text-sm">Times Classificados</span>
                  <Badge className="bg-[#4A4E56] text-white font-semibold">
                    {seasonSettings.playoffTeams} times
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Informação Adicional */}
          <div className="bg-[#0B6623]/10 border border-[#0B6623]/30 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#0B6623] flex-shrink-0 mt-0.5" />
            <p className="text-[#B8BAC1] text-xs sm:text-sm">
              <span className="text-white font-medium">Importante:</span> A temporada regular determina quais times se classificam para os playoffs. 
              Os {seasonSettings.playoffTeams} melhores times avançam para disputar o título da liga.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pontuação e Estatísticas */}
      <Card className="bg-[#2C2F33] border-[#4A4E56]">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="bg-[#00E6B3]/20 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#00E6B3]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-1">
                Pontuação e Estatísticas
              </h3>
              <p className="text-[#B8BAC1] text-sm">
                Sistema de pontuação da liga - como os jogadores ganham pontos
              </p>
            </div>
          </div>

          <Separator className="bg-[#4A4E56]" />

          {/* Grid de Categorias */}
          <div className="space-y-4">
            {/* Quarterback (Passe) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#0B6623] text-white text-xs">QB</Badge>
                <span className="text-white font-medium text-sm">QUARTERBACK - PASSE</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-0 sm:pl-8">
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Passe para TD</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.passTD > 0 ? '+' : ''}{scoringSettings.passTD} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">25 jardas de passe</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.passYards > 0 ? '+' : ''}{scoringSettings.passYards} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Interceptação lançada</span>
                  <span className="text-[#B22222] font-semibold text-sm sm:text-base">
                    {scoringSettings.interception} pts
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-[#4A4E56]" />

            {/* Running Back (Corrida) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#0B6623] text-white text-xs">RB</Badge>
                <span className="text-white font-medium text-sm">RUNNING BACK - CORRIDA</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-0 sm:pl-8">
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Corrida para TD</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.rushTD > 0 ? '+' : ''}{scoringSettings.rushTD} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">10 jardas corridas</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.rushYards > 0 ? '+' : ''}{scoringSettings.rushYards} pts
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-[#4A4E56]" />

            {/* Wide Receiver / Tight End (Recepção) */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#0B6623] text-white text-xs">WR/TE</Badge>
                <span className="text-white font-medium text-sm">RECEPÇÕES</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-0 sm:pl-8">
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Recepção (PPR)</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.receptionPPR > 0 ? '+' : ''}{scoringSettings.receptionPPR} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">10 jardas recebidas</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.recYards > 0 ? '+' : ''}{scoringSettings.recYards} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">TD de recepção</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.recTD > 0 ? '+' : ''}{scoringSettings.recTD} pts
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-[#4A4E56]" />

            {/* Kicker */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#0B6623] text-white text-xs">K</Badge>
                <span className="text-white font-medium text-sm">KICKER - CHUTES</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pl-0 sm:pl-8">
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Field Goal convertido</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.fgMade > 0 ? '+' : ''}{scoringSettings.fgMade} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">FG 50+ jardas (bônus)</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.fg50Plus > 0 ? '+' : ''}{scoringSettings.fg50Plus} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Field Goal perdido</span>
                  <span className="text-[#B22222] font-semibold text-sm sm:text-base">
                    {scoringSettings.fgMissed} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Extra point</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.extraPoint > 0 ? '+' : ''}{scoringSettings.extraPoint} pts
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-[#4A4E56]" />

            {/* Defense/Special Teams */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-[#0B6623] text-white text-xs">DEF</Badge>
                <span className="text-white font-medium text-sm">DEFESA E SPECIAL TEAMS</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-0 sm:pl-8">
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Sack</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.sack > 0 ? '+' : ''}{scoringSettings.sack} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Interceptação</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.defInterception > 0 ? '+' : ''}{scoringSettings.defInterception} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Fumble recuperado</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.fumbleRecovery > 0 ? '+' : ''}{scoringSettings.fumbleRecovery} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Touchdown defensivo</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.defTD > 0 ? '+' : ''}{scoringSettings.defTD} pts
                  </span>
                </div>
                
                <div className="bg-[#1A2238] rounded p-2 sm:p-3 flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1">
                  <span className="text-[#B8BAC1] text-xs sm:text-sm">Pontos sofridos (0-6)</span>
                  <span className="text-[#00E6B3] font-semibold text-sm sm:text-base">
                    {scoringSettings.pointsAllowed > 0 ? '+' : ''}{scoringSettings.pointsAllowed} pts
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informação Adicional */}
          <div className="bg-[#00E6B3]/10 border border-[#00E6B3]/30 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-[#00E6B3] flex-shrink-0 mt-0.5" />
            <div className="text-[#B8BAC1] text-xs sm:text-sm space-y-1">
              <p>
                <span className="text-white font-medium">PPR (Points Per Reception):</span> Sistema onde cada recepção vale pontos adicionais.
              </p>
              <p className="pt-1">
                <span className="text-white font-medium">Pontos por jarda:</span> As jardas são calculadas proporcionalmente. 
                Ex: 25 jardas de passe = {scoringSettings.passYards} pt, então 100 jardas = {scoringSettings.passYards * 4} pts.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
