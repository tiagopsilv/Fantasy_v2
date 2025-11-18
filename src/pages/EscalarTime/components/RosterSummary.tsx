import * as React from "react";
import { CheckCircle, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SaveLineupButton } from "./SaveLineupButton";
import { LineupRulesInfo } from "./LineupRulesInfo";
import type { Player } from "./AvailablePlayersList";

export interface RosterSummaryProps {
  roster: Record<string, Player | null>;
  onConfirmRoster: () => void;
  onSaveLineup?: () => Promise<void> | void;
  isLocked?: boolean;
  hasChanges?: boolean;
}

const REQUIRED_POSITIONS = ["QB", "RB1", "RB2", "WR1", "WR2", "TE", "K", "DEF"];
const TOTAL_ROSTER_SLOTS = 9;

interface PositionStatus {
  label: string;
  filled: number;
  total: number;
  isComplete: boolean;
}

export const RosterSummary = React.memo<RosterSummaryProps>(({ 
  roster, 
  onConfirmRoster, 
  onSaveLineup,
  isLocked = false,
  hasChanges = false
}) => {
  const positionStatus = React.useMemo<PositionStatus[]>(() => {
    return [
      {
        label: "Quarterback",
        filled: roster.QB ? 1 : 0,
        total: 1,
        isComplete: Boolean(roster.QB)
      },
      {
        label: "Running Backs",
        filled: [roster.RB1, roster.RB2].filter(Boolean).length,
        total: 2,
        isComplete: Boolean(roster.RB1 && roster.RB2)
      },
      {
        label: "Wide Receivers",
        filled: [roster.WR1, roster.WR2].filter(Boolean).length,
        total: 2,
        isComplete: Boolean(roster.WR1 && roster.WR2)
      },
      {
        label: "Tight End",
        filled: roster.TE ? 1 : 0,
        total: 1,
        isComplete: Boolean(roster.TE)
      },
      {
        label: "Kicker",
        filled: roster.K ? 1 : 0,
        total: 1,
        isComplete: Boolean(roster.K)
      },
      {
        label: "Defense",
        filled: roster.DEF ? 1 : 0,
        total: 1,
        isComplete: Boolean(roster.DEF)
      }
    ];
  }, [roster]);

  const stats = React.useMemo(() => {
    const filledPositions = Object.entries(roster).filter(([_, player]) => player !== null);
    const missingRequired = REQUIRED_POSITIONS.filter(pos => !roster[pos]);
    
    return {
      totalFilled: filledPositions.length,
      totalAvailable: TOTAL_ROSTER_SLOTS - filledPositions.length,
      missingRequired,
      isValid: missingRequired.length === 0
    };
  }, [roster]);

  const handleConfirm = React.useCallback(() => {
    if (stats.isValid && !isLocked) {
      onConfirmRoster();
    }
  }, [stats.isValid, isLocked, onConfirmRoster]);

  return (
    <div className="bg-[#2C2F33] rounded-lg p-4 sm:p-6 border-2 border-[#00E6B3] shadow-lg shadow-[#00E6B3]/20 space-y-4 sm:space-y-6 h-full flex flex-col">
      <div className="pb-3 border-b-2 border-[#00E6B3]/50">
        <div className="flex items-center gap-3">
          <div className="bg-[#00E6B3] p-2 rounded-lg">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#1A2238]" />
          </div>
          <h3 className="text-white text-xl sm:text-2xl font-bold">Resumo do Elenco</h3>
        </div>
      </div>

      {/* Regras de Formação */}
      <div className="mb-2">
        <LineupRulesInfo roster={roster} />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-[#1A2238] rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalFilled}</div>
          <div className="text-[#B8BAC1] text-xs sm:text-sm">Jogadores Escolhidos</div>
        </div>
        <div className="bg-[#1A2238] rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalAvailable}</div>
          <div className="text-[#B8BAC1] text-xs sm:text-sm">Posições Disponíveis</div>
        </div>
      </div>

      {/* Posições por categoria */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        {positionStatus.map((position) => (
          <div key={position.label} className="flex justify-between items-center">
            <span className="text-[#B8BAC1] text-sm sm:text-base">{position.label}</span>
            <div className="flex items-center gap-1 sm:gap-2">
              {position.isComplete ? (
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B6623]" />
              ) : (
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
              )}
              <span className="text-white text-sm sm:text-base">
                {position.filled}/{position.total}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Alertas */}
      <div className="space-y-3 sm:space-y-4">
        {stats.missingRequired.length > 0 && (
          <Alert className="border-[#B22222] bg-[#B22222]/10">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
            <AlertDescription className="text-[#B22222] text-xs sm:text-sm">
              Posições obrigatórias não preenchidas: {stats.missingRequired.join(", ")}
            </AlertDescription>
          </Alert>
        )}

        {stats.isValid && (
          <Alert className="border-[#0B6623] bg-[#0B6623]/10">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B6623]" />
            <AlertDescription className="text-[#0B6623] text-xs sm:text-sm">
              Elenco válido! Todas as posições obrigatórias foram preenchidas.
            </AlertDescription>
          </Alert>
        )}

        {/* Botões de ação */}
        <div className="space-y-2">
          {/* Botão Salvar */}
          {onSaveLineup && (
            <SaveLineupButton
              onSave={onSaveLineup}
              isLocked={isLocked}
              hasChanges={hasChanges}
              disabled={!stats.isValid}
            />
          )}
          
          {/* Botão de confirmação */}
          <Button
            onClick={handleConfirm}
            disabled={!stats.isValid || isLocked}
            className={`w-full text-sm sm:text-base py-2 sm:py-3 ${
              isLocked 
                ? 'bg-[#4A4E56] text-[#B8BAC1] cursor-not-allowed'
                : stats.isValid 
                  ? 'bg-[#0B6623] hover:bg-[#0B6623]/80 text-white' 
                  : 'bg-[#4A4E56] text-[#B8BAC1] cursor-not-allowed'
            }`}
          >
            {isLocked 
              ? '🔒 Lineup Bloqueado' 
              : stats.isValid 
                ? 'Confirmar Elenco Inicial' 
                : 'Complete as posições obrigatórias'
            }
          </Button>
        </div>
      </div>
    </div>
  );
});

RosterSummary.displayName = "RosterSummary";