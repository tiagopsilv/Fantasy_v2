import { Info, Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Button } from "./ui/button";
import { useState } from "react";

interface LineupRulesInfoProps {
  roster: Record<string, any>;
}

export function LineupRulesInfo({ roster }: LineupRulesInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Contar posições atuais
  const positionCounts = {
    QB: 0,
    RB: 0,
    WR: 0,
    TE: 0,
    K: 0,
    DEF: 0
  };

  Object.entries(roster).forEach(([slot, player]) => {
    if (player) {
      if (slot === 'FLEX') {
        positionCounts[player.position as keyof typeof positionCounts]++;
      } else if (slot.startsWith('RB')) {
        positionCounts.RB++;
      } else if (slot.startsWith('WR')) {
        positionCounts.WR++;
      } else {
        positionCounts[player.position as keyof typeof positionCounts]++;
      }
    }
  });

  const requirements = [
    { position: "QB", required: 1, current: positionCounts.QB, max: 1 },
    { position: "RB", required: 2, current: positionCounts.RB, max: 3 },
    { position: "WR", required: 2, current: positionCounts.WR, max: 3 },
    { position: "TE", required: 1, current: positionCounts.TE, max: 2 },
    { position: "K", required: 1, current: positionCounts.K, max: 1 },
    { position: "DEF", required: 1, current: positionCounts.DEF, max: 1 }
  ];

  const getStatusColor = (current: number, required: number, max: number) => {
    if (current < required) return "bg-[#B22222]"; // Insufficient
    if (current === max) return "bg-[#FFD700]"; // At limit
    return "bg-[#0B6623]"; // Good
  };

  const getStatusText = (current: number, required: number, max: number) => {
    if (current < required) return "Incompleto";
    if (current === max) return "Máximo";
    return "OK";
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between text-[#B8BAC1] hover:text-white hover:bg-[#2C2F33] p-3"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span className="text-sm">Regras de Formação</span>
          </div>
          <span className="text-xs">{isOpen ? "Ocultar" : "Mostrar"}</span>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-3 pt-3">
        <Alert className="border-[#4A4E56] bg-[#1A2238]">
          <Users className="w-4 h-4 text-[#00E6B3]" />
          <AlertDescription className="text-[#B8BAC1] text-xs">
            <strong className="text-white">Formação Obrigatória:</strong><br />
            1 QB • 2 RB • 2 WR • 1 TE • 1 FLEX (RB/WR/TE) • 1 K • 1 DEF
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="text-white text-sm font-medium">Status Atual:</h4>
          <div className="grid grid-cols-2 gap-2">
            {requirements.map(({ position, required, current, max }) => (
              <div key={position} className="flex items-center justify-between p-2 bg-[#1A2238] rounded border border-[#4A4E56]">
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-medium">{position}</span>
                  <Badge 
                    className={`${getStatusColor(current, required, max)} text-white text-[10px] px-1.5 py-0.5`}
                  >
                    {getStatusText(current, required, max)}
                  </Badge>
                </div>
                <span className="text-[#B8BAC1] text-xs">
                  {current}/{required}{max > required ? `-${max}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Alert className="border-[#FFD700] bg-[#FFD700]/10">
          <AlertCircle className="w-4 h-4 text-[#FFD700]" />
          <AlertDescription className="text-[#FFD700] text-xs">
            <strong>FLEX:</strong> Posição flexível que aceita RB, WR ou TE adicional
          </AlertDescription>
        </Alert>
      </CollapsibleContent>
    </Collapsible>
  );
}