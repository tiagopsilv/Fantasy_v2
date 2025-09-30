import { Save, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface SaveLineupButtonProps {
  onSave: () => Promise<void> | void;
  isLocked?: boolean;
  hasChanges?: boolean;
  disabled?: boolean;
}

export function SaveLineupButton({ 
  onSave, 
  isLocked = false, 
  hasChanges = false,
  disabled = false 
}: SaveLineupButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleSave = async () => {
    if (isLocked || disabled || isSaving) return;

    try {
      setIsSaving(true);
      await onSave();
      setLastSaved(new Date());
      toast.success("Lineup salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar lineup. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLocked) {
    return (
      <Button
        disabled
        className="w-full bg-[#4A4E56] text-[#B8BAC1] cursor-not-allowed text-sm sm:text-base py-2 sm:py-3"
      >
        🔒 Lineup Bloqueado
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleSave}
        disabled={disabled || isSaving}
        className={`w-full text-sm sm:text-base py-2 sm:py-3 ${
          hasChanges
            ? 'bg-[#00E6B3] hover:bg-[#00E6B3]/80 text-[#1A2238]'
            : 'bg-[#0B6623] hover:bg-[#0B6623]/80 text-white'
        }`}
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : hasChanges ? (
          <>
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-2" />
            Lineup Salvo
          </>
        )}
      </Button>
      
      {lastSaved && (
        <div className="text-center text-[#B8BAC1] text-xs">
          Último salvamento: {lastSaved.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      )}
    </div>
  );
}