import { Calendar, Trophy, Info, AlertCircle, Users, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SeasonStepProps {
  regularSeasonStart: number;
  regularSeasonEnd: number;
  playoffsStart: number;
  playoffsEnd: number;
  playoffTeams: number;
  totalTeams?: number;
  onChange: (data: {
    regularSeasonStart?: number;
    regularSeasonEnd?: number;
    playoffsStart?: number;
    playoffsEnd?: number;
    playoffTeams?: number;
  }) => void;
}

export function SeasonStep({
  regularSeasonStart,
  regularSeasonEnd,
  playoffsStart,
  playoffsEnd,
  playoffTeams,
  totalTeams = 12,
  onChange,
}: SeasonStepProps) {
  const regularSeasonWeeks = regularSeasonEnd - regularSeasonStart + 1;
  const playoffWeeks = playoffsEnd - playoffsStart + 1;
  const totalWeeks = playoffsEnd;
  
  // Validações
  const hasOverlap = regularSeasonEnd >= playoffsStart;
  const isValidTotal = totalWeeks <= 18;
  const playoffTeamsWithBye = playoffTeams > 4 ? 2 : 0;
  const playoffRounds = playoffWeeks;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-white text-2xl mb-2">Configuração da Temporada</h3>
        <p className="text-[#B8BAC1]">
          Defina a duração da Temporada Regular e dos Playoffs da sua liga
        </p>
      </div>

      {/* Explicação Geral */}
      <Alert className="bg-[#1A2238] border-[#00E6B3]">
        <Info className="w-4 h-4 text-[#00E6B3]" />
        <AlertDescription className="text-white ml-2">
          <strong className="text-[#00E6B3]">Como funciona a Temporada?</strong>
          <p className="text-[#B8BAC1] mt-2">
            A temporada da sua liga Fantasy acompanha as semanas da NFL. Cada rodada da NFL corresponde a uma semana da sua liga.
            Você define quantas semanas terá a fase regular e quantas serão dedicadas aos playoffs.
          </p>
        </AlertDescription>
      </Alert>

      {/* Cards de Configuração */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Temporada Regular */}
        <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0B6623]" />
                <h4 className="text-white">Temporada Regular</h4>
              </div>
              <Badge className="bg-[#0B6623] text-white">
                {regularSeasonWeeks} semanas
              </Badge>
            </div>

            <Alert className="bg-[#1A2238] border-[#0B6623]">
              <Info className="w-4 h-4 text-[#0B6623]" />
              <AlertDescription className="text-[#B8BAC1] text-xs ml-2">
                <strong className="text-white">O que acontece aqui:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Times se enfrentam semana após semana</li>
                  <li>Cada vitória soma pontos na classificação</li>
                  <li>Melhores campanhas avançam aos playoffs</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label className="text-white">Semana Inicial da NFL *</Label>
              <Input
                type="number"
                min="1"
                max="18"
                value={regularSeasonStart}
                onChange={(e) => onChange({ regularSeasonStart: Number(e.target.value) })}
                className="bg-[#1A2238] border-[#4A4E56] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Semana Final da NFL *</Label>
              <Input
                type="number"
                min={regularSeasonStart + 1}
                max="18"
                value={regularSeasonEnd}
                onChange={(e) => onChange({ regularSeasonEnd: Number(e.target.value) })}
                className="bg-[#1A2238] border-[#4A4E56] text-white"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {[{start: 1, end: 13}, {start: 1, end: 14}, {start: 1, end: 15}].map((preset) => {
                const weeks = preset.end - preset.start + 1;
                return (
                  <Badge
                    key={`${preset.start}-${preset.end}`}
                    onClick={() => onChange({ 
                      regularSeasonStart: preset.start, 
                      regularSeasonEnd: preset.end 
                    })}
                    className={`cursor-pointer ${
                      regularSeasonStart === preset.start && regularSeasonEnd === preset.end
                        ? "bg-[#0B6623] text-white"
                        : "bg-[#1A2238] text-[#B8BAC1] hover:bg-[#4A4E56]"
                    }`}
                  >
                    {weeks} semanas
                  </Badge>
                );
              })}
            </div>

            <p className="text-[#B8BAC1] text-xs mt-2">
              💡 Padrão recomendado: Semanas 1–14 (14 semanas)
            </p>
          </div>
        </Card>

        {/* Playoffs */}
        <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFD700]" />
                <h4 className="text-white">Playoffs</h4>
              </div>
              <Badge className="bg-[#FFD700] text-[#1A2238]">
                {playoffWeeks} semanas
              </Badge>
            </div>

            <Alert className="bg-[#1A2238] border-[#FFD700]">
              <Trophy className="w-4 h-4 text-[#FFD700]" />
              <AlertDescription className="text-[#B8BAC1] text-xs ml-2">
                <strong className="text-white">Fase eliminatória:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Apenas os melhores times se classificam</li>
                  <li>Confrontos de mata-mata</li>
                  <li>Campeão da liga é definido</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label className="text-white">Semana Inicial dos Playoffs *</Label>
              <Input
                type="number"
                min={regularSeasonEnd + 1}
                max="18"
                value={playoffsStart}
                onChange={(e) => onChange({ playoffsStart: Number(e.target.value) })}
                className="bg-[#1A2238] border-[#4A4E56] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Semana Final dos Playoffs *</Label>
              <Input
                type="number"
                min={playoffsStart}
                max="18"
                value={playoffsEnd}
                onChange={(e) => onChange({ playoffsEnd: Number(e.target.value) })}
                className="bg-[#1A2238] border-[#4A4E56] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                Times Classificados *
                <Info className="w-3 h-3 text-[#B8BAC1]" />
              </Label>
              <Input
                type="number"
                min="2"
                max="12"
                value={playoffTeams}
                onChange={(e) => onChange({ playoffTeams: Number(e.target.value) })}
                className="bg-[#1A2238] border-[#4A4E56] text-white"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {[4, 6, 8].map((num) => (
                <Badge
                  key={num}
                  onClick={() => onChange({ playoffTeams: num })}
                  className={`cursor-pointer ${
                    playoffTeams === num
                      ? "bg-[#FFD700] text-[#1A2238]"
                      : "bg-[#1A2238] text-[#B8BAC1] hover:bg-[#4A4E56]"
                  }`}
                >
                  {num} times
                </Badge>
              ))}
            </div>

            <p className="text-[#B8BAC1] text-xs mt-2">
              💡 Padrão: {totalTeams >= 12 ? '6 times' : '4 times'} ({Math.ceil(totalTeams / 2)} times ≈ 50% da liga)
            </p>
          </div>
        </Card>
      </div>

      {/* Alertas de Validação */}
      {hasOverlap && (
        <Alert className="bg-[#B22222]/20 border-[#B22222]">
          <AlertCircle className="w-4 h-4 text-[#B22222]" />
          <AlertDescription className="text-white ml-2">
            <strong className="text-[#B22222]">Sobreposição detectada!</strong>
            <p className="text-[#B8BAC1] mt-1">
              Os playoffs devem começar após o fim da temporada regular.
              A temporada regular termina na semana {regularSeasonEnd}, então os playoffs devem começar na semana {regularSeasonEnd + 1} ou depois.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {!isValidTotal && (
        <Alert className="bg-[#B22222]/20 border-[#B22222]">
          <AlertCircle className="w-4 h-4 text-[#B22222]" />
          <AlertDescription className="text-white ml-2">
            <strong className="text-[#B22222]">Temporada muito longa!</strong>
            <p className="text-[#B8BAC1] mt-1">
              A NFL tem apenas 18 semanas. Sua configuração atual vai até a semana {totalWeeks}.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Formato dos Playoffs */}
      <Card className="bg-[#2C2F33] border-[#4A4E56] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#00E6B3]" />
          <h4 className="text-white">Formato dos Playoffs</h4>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-[#1A2238] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#B8BAC1] text-sm">Times Classificados:</span>
              <span className="text-white">{playoffTeams}</span>
            </div>
            {playoffTeamsWithBye > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-[#B8BAC1] text-sm">Times com Bye:</span>
                <span className="text-[#00E6B3]">{playoffTeamsWithBye} melhores</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[#B8BAC1] text-sm">Rodadas Playoffs:</span>
              <span className="text-white">{playoffRounds}</span>
            </div>
          </div>

          <div className="bg-[#1A2238] rounded-lg p-4">
            <p className="text-white text-sm mb-2">Chaveamento:</p>
            <div className="space-y-1 text-xs text-[#B8BAC1]">
              {playoffTeamsWithBye > 0 && (
                <p>• {playoffTeamsWithBye} melhores ganham bye (1ª rodada)</p>
              )}
              {playoffWeeks >= 1 && (
                <p>• Semana {playoffsStart}: {playoffTeamsWithBye > 0 ? 'Quartas' : 'Semifinais'}</p>
              )}
              {playoffWeeks >= 2 && (
                <p>• Semana {playoffsStart + 1}: {playoffTeamsWithBye > 0 ? 'Semifinais' : 'Final'}</p>
              )}
              {playoffWeeks >= 3 && (
                <p>• Semana {playoffsStart + 2}: Final / Disputa 3º lugar</p>
              )}
            </div>
          </div>
        </div>

        {playoffTeams === 6 && (
          <Alert className="bg-[#0B6623]/20 border-[#0B6623] mt-4">
            <Trophy className="w-4 h-4 text-[#00E6B3]" />
            <AlertDescription className="text-[#B8BAC1] text-xs ml-2">
              <strong className="text-white">Formato típico com 6 times:</strong>
              <br />
              Os 2 melhores times gerais recebem "bye" (descanso) na primeira rodada.
              Os outros 4 times jogam quartas de final, depois semifinais e final.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Timeline Visual */}
      <Card className="bg-[#2C2F33] border-[#00E6B3] p-6">
        <h4 className="text-white mb-4">📅 Timeline da Temporada</h4>
        
        <div className="relative">
          <div className="flex items-center">
            {/* Regular Season */}
            <div
              className="bg-[#0B6623] h-16 rounded-l-lg flex flex-col items-center justify-center relative"
              style={{ width: `${(regularSeasonWeeks / totalWeeks) * 100}%` }}
            >
              <Calendar className="w-5 h-5 text-white mb-1" />
              <span className="text-white text-sm z-10">
                Semanas {regularSeasonStart}–{regularSeasonEnd}
              </span>
              <span className="text-white/80 text-xs">
                ({regularSeasonWeeks} semanas)
              </span>
            </div>

            {/* Playoffs */}
            <div
              className="bg-[#FFD700] h-16 rounded-r-lg flex flex-col items-center justify-center relative"
              style={{ width: `${(playoffWeeks / totalWeeks) * 100}%` }}
            >
              <Trophy className="w-5 h-5 text-[#1A2238] mb-1" />
              <span className="text-[#1A2238] text-sm z-10">
                Playoffs {playoffsStart}–{playoffsEnd}
              </span>
              <span className="text-[#1A2238]/80 text-xs">
                ({playoffWeeks} semanas)
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-6 justify-center flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#0B6623] rounded" />
              <span className="text-[#B8BAC1] text-sm">Temporada Regular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FFD700] rounded" />
              <span className="text-[#B8BAC1] text-sm">Playoffs</span>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[#1A2238] rounded-lg">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-between md:justify-start md:gap-3">
              <span className="text-[#B8BAC1]">Total de Semanas:</span>
              <span className="text-white">{totalWeeks}</span>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-3">
              <span className="text-[#B8BAC1]">Times nos Playoffs:</span>
              <span className="text-white">{playoffTeams}</span>
            </div>
            <div className="flex items-center justify-between md:justify-start md:gap-3">
              <span className="text-[#B8BAC1]">% da Liga:</span>
              <span className="text-white">{Math.round((playoffTeams / totalTeams) * 100)}%</span>
            </div>
          </div>
          
          <p className="text-[#B8BAC1] text-xs mt-3 text-center">
            💡 A duração total e os times nos playoffs são atualizados automaticamente conforme suas escolhas
          </p>
        </div>
      </Card>

      {/* Dicas Finais */}
      <Alert className="bg-[#0B6623]/20 border-[#0B6623]">
        <Info className="w-4 h-4 text-[#00E6B3]" />
        <AlertDescription className="text-white ml-2">
          <strong className="text-[#00E6B3]">✅ Configuração Recomendada (Padrão):</strong>
          <p className="text-[#B8BAC1] mt-2">
            <strong>Temporada Regular:</strong> Semanas 1–14 (14 semanas)
            <br />
            <strong>Playoffs:</strong> Semanas 15–17 (3 semanas)
            <br />
            <strong>Classificados:</strong> 6 times ({totalTeams >= 12 ? '50%' : Math.round((6 / totalTeams) * 100) + '%'} da liga) • Os 2 melhores ganham bye
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
