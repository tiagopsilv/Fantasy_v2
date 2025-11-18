import { Calendar, Trophy, Target, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LeagueRulesCompactProps {
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

export function LeagueRulesCompact({ seasonSettings, scoringSettings }: LeagueRulesCompactProps) {
  return (
    <div className="space-y-3 bg-[#1A2238] rounded-lg p-3 border border-[#4A4E56]/50">
      {/* Temporada */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-[#0B6623]" />
            <span className="text-[#B8BAC1] text-xs">Temporada Regular</span>
          </div>
          <div className="text-white text-xs font-medium">
            Semanas {seasonSettings.regularSeasonStart}-{seasonSettings.regularSeasonEnd}
            <span className="text-[#B8BAC1] ml-1">
              ({seasonSettings.regularSeasonEnd - seasonSettings.regularSeasonStart + 1} semanas)
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3 h-3 text-[#FFD700]" />
            <span className="text-[#B8BAC1] text-xs">Playoffs</span>
          </div>
          <div className="text-white text-xs font-medium">
            Semanas {seasonSettings.playoffStart}-{seasonSettings.playoffEnd}
            <span className="text-[#B8BAC1] ml-1">
              ({seasonSettings.playoffTeams} times)
            </span>
          </div>
        </div>
      </div>

      {/* Pontuação Completa */}
      <div className="pt-2 border-t border-[#4A4E56]/50">
        <div className="flex items-center gap-1.5 mb-2">
          <Target className="w-3 h-3 text-[#00E6B3]" />
          <span className="text-[#B8BAC1] text-xs font-medium">Pontuação</span>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
          {/* Quarterback */}
          <StatItem label="Passe TD" value={scoringSettings.passTD} positive />
          <StatItem label="25 yd passe" value={scoringSettings.passYards} positive />
          <StatItem label="INT lançada" value={scoringSettings.interception} negative />
          
          {/* Running Back */}
          <StatItem label="Corrida TD" value={scoringSettings.rushTD} positive />
          <StatItem label="10 yd corrida" value={scoringSettings.rushYards} positive />
          
          {/* Receivers */}
          <StatItem label="Recepção PPR" value={scoringSettings.receptionPPR} positive highlight />
          <StatItem label="10 yd recebida" value={scoringSettings.recYards} positive />
          <StatItem label="Recepção TD" value={scoringSettings.recTD} positive />
          
          {/* Kicker */}
          <StatItem label="Field Goal" value={scoringSettings.fgMade} positive />
          <StatItem label="FG 50+ yd" value={scoringSettings.fg50Plus} positive />
          <StatItem label="FG perdido" value={scoringSettings.fgMissed} negative />
          <StatItem label="Extra point" value={scoringSettings.extraPoint} positive />
          
          {/* Defense */}
          <StatItem label="Sack" value={scoringSettings.sack} positive />
          <StatItem label="INT def" value={scoringSettings.defInterception} positive />
          <StatItem label="Fumble rec" value={scoringSettings.fumbleRecovery} positive />
          <StatItem label="TD defensivo" value={scoringSettings.defTD} positive />
          <StatItem label="Pts sofridos 0-6" value={scoringSettings.pointsAllowed} positive />
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: number;
  positive?: boolean;
  negative?: boolean;
  highlight?: boolean;
}

function StatItem({ label, value, positive, negative, highlight }: StatItemProps) {
  const getBgColor = () => {
    if (highlight) return "bg-[#00E6B3]/15 border-[#00E6B3]/40";
    if (negative) return "bg-[#B22222]/10 border-[#B22222]/30";
    return "bg-[#0B6623]/10 border-[#0B6623]/30";
  };

  const getTextColor = () => {
    if (highlight) return "text-[#00E6B3]";
    if (negative) return "text-[#B22222]";
    return "text-[#00E6B3]";
  };

  const getSign = () => {
    if (value > 0) return "+";
    return "";
  };

  return (
    <div className={`rounded p-1.5 border ${getBgColor()}`}>
      <div className="text-[#B8BAC1] text-[10px] leading-tight mb-0.5 truncate" title={label}>
        {label}
      </div>
      <div className={`font-semibold text-xs ${getTextColor()}`}>
        {getSign()}{value}
      </div>
    </div>
  );
}