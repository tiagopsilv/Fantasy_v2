import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";

interface TeamNameInputProps {
  currentTeamName?: string;
  onSave: (teamName: string) => void;
  isLocked?: boolean;
}

export function TeamNameInput({ currentTeamName, onSave, isLocked = false }: TeamNameInputProps) {
  const [isEditing, setIsEditing] = useState(!currentTeamName);
  const [teamName, setTeamName] = useState(currentTeamName || "");

  const handleSave = () => {
    if (!teamName.trim()) {
      toast.error("Por favor, insira um nome para o time");
      return;
    }

    if (teamName.length < 3) {
      toast.error("O nome do time deve ter pelo menos 3 caracteres");
      return;
    }

    if (teamName.length > 30) {
      toast.error("O nome do time deve ter no máximo 30 caracteres");
      return;
    }

    onSave(teamName.trim());
    setIsEditing(false);
    toast.success("Nome do time salvo com sucesso!");
  };

  const handleCancel = () => {
    setTeamName(currentTeamName || "");
    setIsEditing(false);
  };

  return (
    <Card className="bg-[#2C2F33] border-[#4A4E56]">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg">
                Nome do Time
              </h3>
              <p className="text-[#B8BAC1] text-xs sm:text-sm mt-1">
                {isEditing 
                  ? "Digite o nome do seu time (3-30 caracteres)" 
                  : "Identifique seu time na liga"
                }
              </p>
            </div>
            {currentTeamName && !isEditing && !isLocked && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="text-[#00E6B3] hover:text-[#00E6B3] hover:bg-[#00E6B3]/10"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ex: Thunder Warriors, Meu Time, etc."
                maxLength={30}
                disabled={isLocked}
                className="bg-[#1A2238] border-[#4A4E56] text-white placeholder:text-[#B8BAC1] focus:border-[#00E6B3] focus:ring-[#00E6B3]"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isLocked}
                  className="flex-1 bg-[#0B6623] hover:bg-[#0B6623]/90 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                {currentTeamName && (
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 border-[#4A4E56] text-[#B8BAC1] hover:bg-[#1A2238]"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                )}
              </div>
              <p className="text-[#B8BAC1] text-xs text-right">
                {teamName.length}/30 caracteres
              </p>
            </div>
          ) : (
            <div className="bg-[#1A2238] rounded-lg px-4 py-3 border border-[#4A4E56]">
              <p className="text-white text-lg font-semibold">
                {currentTeamName}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
