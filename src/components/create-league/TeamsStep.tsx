import { Users, Grid3x3, Info, Trophy, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamsStepProps {
  teams: number;
  divisions: number;
  onChange: (teams: number, divisions: number) => void;
}

export function TeamsStep({ teams, divisions, onChange }: TeamsStepProps) {
  const teamsPerDivision = Math.floor(teams / divisions);
  const remainingTeams = teams % divisions;
  const playoffTeams = teams >= 12 ? 6 : teams >= 8 ? 4 : 2;
  const divisionChampions = divisions;
  const wildcards = playoffTeams - divisionChampions;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-white text-2xl mb-2">Configuração de Times</h3>
        <p className="text-[#B8BAC1]">
          Defina quantos times participarão e como serão organizados em divisões
        </p>
      </div>

      {/* Explicação O que são Times */}
      <Alert className="bg-[#1A2238] border-[#00E6B3]">
        <Info className="w-4 h-4 text-[#00E6B3]" />
        <AlertDescription className="text-white ml-2">
          <strong className="text-[#00E6B3]">O que são Times?</strong>
          <p className="text-[#B8BAC1] mt-2">
            Cada time representa um jogador (manager) que gerencia seu elenco e compete semanalmente. 
            O número de times define quantas pessoas participarão da sua liga.
          </p>
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Número de Times */}
        <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#00E6B3]" />
              <Label className="text-white">Número de Times *</Label>
            </div>
            
            <Input
              type="number"
              min="4"
              max="20"
              value={teams}
              onChange={(e) => {
                const newTeams = Number(e.target.value);
                if (newTeams >= 4 && newTeams <= 20) {
                  onChange(newTeams, divisions);
                }
              }}
              className="bg-[#1A2238] border-[#4A4E56] text-white"
            />

            <div className="flex gap-2 flex-wrap">
              {[8, 10, 12, 14, 16].map((num) => (
                <Badge
                  key={num}
                  onClick={() => onChange(num, divisions)}
                  className={`cursor-pointer ${
                    teams === num
                      ? "bg-[#00E6B3] text-[#1A2238]"
                      : "bg-[#1A2238] text-[#B8BAC1] hover:bg-[#4A4E56]"
                  }`}
                >
                  {num}
                </Badge>
              ))}
            </div>

            <div className="bg-[#1A2238] rounded p-3 space-y-1">
              <p className="text-[#B8BAC1] text-xs">Impactos automáticos:</p>
              <p className="text-white text-sm">• {divisions} divisões de {teamsPerDivision}{remainingTeams > 0 ? `-${teamsPerDivision + 1}` : ''} times</p>
              <p className="text-white text-sm">• {playoffTeams} times classificados aos playoffs</p>
              <p className="text-white text-sm">• Calendário recalculado automaticamente</p>
            </div>
          </div>
        </Card>

        {/* Número de Divisões */}
        <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 className="w-5 h-5 text-[#00E6B3]" />
              <Label className="text-white">Número de Divisões *</Label>
            </div>
            
            <Input
              type="number"
              min="1"
              max="4"
              value={divisions}
              onChange={(e) => {
                const newDivisions = Number(e.target.value);
                if (newDivisions >= 1 && newDivisions <= 4) {
                  onChange(teams, newDivisions);
                }
              }}
              className="bg-[#1A2238] border-[#4A4E56] text-white"
            />

            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4].map((num) => (
                <Badge
                  key={num}
                  onClick={() => onChange(teams, num)}
                  className={`cursor-pointer ${
                    divisions === num
                      ? "bg-[#00E6B3] text-[#1A2238]"
                      : "bg-[#1A2238] text-[#B8BAC1] hover:bg-[#4A4E56]"
                  }`}
                >
                  {num}
                </Badge>
              ))}
            </div>

            <div className="bg-[#1A2238] rounded p-3 space-y-1">
              <p className="text-[#B8BAC1] text-xs">Por que usar divisões?</p>
              <p className="text-white text-sm">• Equilíbrio competitivo</p>
              <p className="text-white text-sm">• Organização do calendário</p>
              <p className="text-white text-sm">• Rivalidades mais envolventes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Explicação O que são Divisões */}
      <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-[#00E6B3]" />
          <h4 className="text-white">🧩 O que são Divisões no Fantasy Game?</h4>
        </div>
        
        <div className="space-y-3 text-[#B8BAC1] text-sm">
          <p>
            <strong className="text-white">Divisões servem para segmentar os times de uma liga em grupos menores.</strong>
            {' '}Cada divisão funciona como uma mini-liga interna, e os melhores de cada uma avançam aos playoffs.
          </p>
          
          <div className="bg-[#1A2238] rounded-lg p-4 mt-3">
            <p className="text-white mb-2">Exemplo com {teams} times em {divisions} divisões:</p>
            <div className="space-y-2">
              {Array.from({ length: divisions }).map((_, divIndex) => {
                const teamsInDiv = divIndex < remainingTeams ? teamsPerDivision + 1 : teamsPerDivision;
                const divNames = ["Norte", "Sul", "Leste", "Oeste"];
                return (
                  <p key={divIndex} className="text-[#B8BAC1]">
                    <span className="text-[#00E6B3]">Divisão {divNames[divIndex] || `${divIndex + 1}`}:</span> {teamsInDiv} times
                  </p>
                );
              })}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-white">Durante a temporada:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Times jogam contra adversários da própria divisão e de outras divisões</li>
              <li>A classificação dentro de cada divisão define quem avança aos playoffs</li>
              <li>Cria rivalidades mais intensas e jogo mais envolvente</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Preview Visual */}
      <Card className="bg-[#2C2F33] border-[#00E6B3] p-6">
        <h4 className="text-white mb-4">Preview da Estrutura da Liga</h4>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: divisions }).map((_, divIndex) => {
            const teamsInThisDivision = 
              divIndex < remainingTeams ? teamsPerDivision + 1 : teamsPerDivision;
            const divNames = ["Norte", "Sul", "Leste", "Oeste"];
            
            return (
              <div key={divIndex} className="bg-[#1A2238] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Grid3x3 className="w-4 h-4 text-[#00E6B3]" />
                  <h5 className="text-white text-sm">
                    Divisão {divNames[divIndex] || `${divIndex + 1}`}
                  </h5>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: teamsInThisDivision }).map((_, teamIndex) => (
                    <div
                      key={teamIndex}
                      className="bg-[#2C2F33] rounded px-3 py-2 flex items-center gap-2"
                    >
                      <Users className="w-3 h-3 text-[#B8BAC1]" />
                      <span className="text-[#B8BAC1] text-sm">
                        Time {divIndex * teamsPerDivision + teamIndex + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-[#1A2238] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-[#FFD700]" />
              <h5 className="text-white text-sm">Classificação aos Playoffs</h5>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-[#B8BAC1]">
                <span className="text-[#00E6B3]">{divisionChampions} campeões de divisão</span> classificados
              </p>
              {wildcards > 0 && (
                <p className="text-[#B8BAC1]">
                  <span className="text-[#00E6B3]">+ {wildcards} wildcards</span> (melhores campanhas gerais)
                </p>
              )}
              <p className="text-white mt-2">Total: {playoffTeams} times nos playoffs</p>
            </div>
          </div>

          <div className="bg-[#1A2238] rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#00E6B3]" />
              <h5 className="text-white text-sm">Resumo</h5>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#B8BAC1]">Total de Times:</span>
                <span className="text-white">{teams}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#B8BAC1]">Divisões:</span>
                <span className="text-white">{divisions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#B8BAC1]">Times por Divisão:</span>
                <span className="text-white">
                  {teamsPerDivision}{remainingTeams > 0 && `-${teamsPerDivision + 1}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Exemplo Prático */}
      <Alert className="bg-[#0B6623]/20 border-[#0B6623]">
        <Trophy className="w-4 h-4 text-[#00E6B3]" />
        <AlertDescription className="text-white ml-2">
          <strong className="text-[#00E6B3]">Configuração Recomendada (Padrão):</strong>
          <p className="text-[#B8BAC1] mt-2">
            12 times • 3 divisões de 4 times • 6 classificados aos playoffs (3 campeões + 3 wildcards)
            <br />
            Os 2 melhores ganham bye (pulam a primeira rodada dos playoffs)
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
