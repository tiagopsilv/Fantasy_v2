import { CheckCircle, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SaveLineupButton } from "./SaveLineupButton";
import { LineupRulesInfo } from "./LineupRulesInfo";
import type { Player } from "./AvailablePlayersList";

interface RosterSummaryProps {
  roster: Record<string, Player | null>;
  onConfirmRoster: () => void;
  onSaveLineup?: () => Promise<void> | void;
  isLocked?: boolean;
  hasChanges?: boolean;
}

export function RosterSummary({ 
  roster, 
  onConfirmRoster, 
  onSaveLineup,
  isLocked = false,
  hasChanges = false
}: RosterSummaryProps) {
  const requiredPositions = ["QB", "RB1", "RB2", "WR1", "WR2", "TE", "K", "DEF"];
  const filledPositions = Object.entries(roster).filter(([_, player]) => player !== null);
  const missingRequiredPositions = requiredPositions.filter(pos => !roster[pos]);
  
  const totalFilledSlots = filledPositions.length;
  const isRosterValid = missingRequiredPositions.length === 0;

  return (
    <div className="bg-[#2C2F33] rounded-lg p-4 sm:p-6 border border-[#4A4E56] space-y-4 sm:space-y-6 h-full flex flex-col">
      <h3 className="text-white flex items-center gap-2 text-lg sm:text-xl">
        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        Resumo do Elenco
      </h3>

      {/* Regras de Formação */}
      <div className="mb-2">
        <LineupRulesInfo roster={roster} />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-[#1A2238] rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{totalFilledSlots}</div>
          <div className="text-[#B8BAC1] text-xs sm:text-sm">Jogadores Escolhidos</div>
        </div>
        <div className="bg-[#1A2238] rounded-lg p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">{9 - totalFilledSlots}</div>
          <div className="text-[#B8BAC1] text-xs sm:text-sm">Posições Disponíveis</div>
        </div>
      </div>

      {/* Posições por categoria */}
      <div className="space-y-2 sm:space-y-3 flex-1">
        <div className="flex justify-between items-center">
          <span className="text-[#B8BAC1] text-sm sm:text-base">Quarterback</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {roster.QB ? (
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B6623]" />
            ) : (
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
            )}
            <span className="text-white text-sm sm:text-base">{roster.QB ? '1/1' : '0/1'}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[#B8BAC1] text-sm sm:text-base">Running Backs</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {roster.RB1 && roster.RB2 ? (
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B6623]" />
            ) : (
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
            )}
            <span className="text-white text-sm sm:text-base">
              {[roster.RB1, roster.RB2].filter(Boolean).length}/2
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[#B8BAC1] text-sm sm:text-base">Wide Receivers</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {roster.WR1 && roster.WR2 ? (
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B6623]" />
            ) : (
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
            )}
            <span className="text-white text-sm sm:text-base">
              {[roster.WR1, roster.WR2].filter(Boolean).length}/2
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[#B8BAC1] text-sm sm:text-base">Tight End</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {roster.TE ? (
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B6623]" />
            ) : (
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
            )}
            <span className="text-white text-sm sm:text-base">{roster.TE ? '1/1' : '0/1'}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[#B8BAC1] text-sm sm:text-base">Kicker</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {roster.K ? (
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B6623]" />
            ) : (
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
            )}
            <span className="text-white text-sm sm:text-base">{roster.K ? '1/1' : '0/1'}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[#B8BAC1] text-sm sm:text-base">Defense</span>
          <div className="flex items-center gap-1 sm:gap-2">
            {roster.DEF ? (
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0B6623]" />
            ) : (
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
            )}
            <span className="text-white text-sm sm:text-base">{roster.DEF ? '1/1' : '0/1'}</span>
          </div>
        </div>
      </div>

      {/* Alertas */}
      <div className="space-y-3 sm:space-y-4">
        {missingRequiredPositions.length > 0 && (
          <Alert className="border-[#B22222] bg-[#B22222]/10">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#B22222]" />
            <AlertDescription className="text-[#B22222] text-xs sm:text-sm">
              Posições obrigatórias não preenchidas: {missingRequiredPositions.join(", ")}
            </AlertDescription>
          </Alert>
        )}

        {isRosterValid && (
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
              disabled={!isRosterValid}
            />
          )}
          
          {/* Botão de confirmação */}
          <Button
            onClick={onConfirmRoster}
            disabled={!isRosterValid || isLocked}
            className={`w-full text-sm sm:text-base py-2 sm:py-3 ${
              isLocked 
                ? 'bg-[#4A4E56] text-[#B8BAC1] cursor-not-allowed'
                : isRosterValid 
                  ? 'bg-[#0B6623] hover:bg-[#0B6623]/80 text-white' 
                  : 'bg-[#4A4E56] text-[#B8BAC1] cursor-not-allowed'
            }`}
          >
            {isLocked 
              ? '🔒 Lineup Bloqueado' 
              : isRosterValid 
                ? 'Confirmar Elenco Inicial' 
                : 'Complete as posições obrigatórias'
            }
          </Button>
        </div>
      </div>
    </div>
  );
}