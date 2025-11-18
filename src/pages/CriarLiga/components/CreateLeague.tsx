import { useState } from "react";
import { ChevronRight, Check, Upload, Users, Calendar, ShieldPlus, Trophy, Share2, ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LeagueNameStep } from "./create-league/LeagueNameStep";
import { TeamsStep } from "./create-league/TeamsStep";
import { SeasonStep } from "./create-league/SeasonStep";
import { LineupStep } from "./create-league/LineupStep";
import { ScoringStep } from "./create-league/ScoringStep";
import { InvitesStep } from "./create-league/InvitesStep";
import { WizardSteps, WizardStep } from "./WizardSteps";

export type LeagueFormData = {
  name: string;
  logo: string | null;
  teams: number;
  divisions: number;
  regularSeasonStart: number;
  regularSeasonEnd: number;
  playoffsStart: number;
  playoffsEnd: number;
  playoffTeams: number;
  lineup: {
    QB: number;
    RB: number;
    WR: number;
    TE: number;
    FLEX: number;
    K: number;
    DEF: number;
  };
  scoring: {
    passingTD: number;
    passingYards: number;
    interception: number;
    rushingTD: number;
    rushingYards: number;
    reception: number;
    receivingYards: number;
    receivingTD: number;
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
};

const STEPS = [
  { id: 1, name: "Nome da Liga", icon: ShieldPlus },
  { id: 2, name: "Times", icon: Users },
  { id: 3, name: "Temporada", icon: Calendar },
  { id: 4, name: "Escalação", icon: Trophy },
  { id: 5, name: "Pontuação", icon: ChevronRight },
  { id: 6, name: "Convites", icon: Share2 },
] as WizardStep[];

interface CreateLeagueProps {
  onCancel: () => void;
  onComplete: (data: LeagueFormData) => void;
}

export function CreateLeague({ onCancel, onComplete }: CreateLeagueProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LeagueFormData>({
    name: "",
    logo: null,
    teams: 12,
    divisions: 3,
    regularSeasonStart: 1,
    regularSeasonEnd: 14,
    playoffsStart: 15,
    playoffsEnd: 17,
    playoffTeams: 6,
    lineup: {
      QB: 1,
      RB: 2,
      WR: 2,
      TE: 1,
      FLEX: 1,
      K: 1,
      DEF: 1,
    },
    scoring: {
      passingTD: 4,
      passingYards: 0.04,
      interception: -2,
      rushingTD: 6,
      rushingYards: 0.1,
      reception: 1,
      receivingYards: 0.1,
      receivingTD: 6,
      fgMade: 3,
      fg50Plus: 5,
      fgMissed: -1,
      extraPoint: 1,
      sack: 1,
      defInterception: 2,
      fumbleRecovery: 2,
      defTD: 6,
      pointsAllowed: -1,
    },
  });

  const updateFormData = (data: Partial<LeagueFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const canAdvance = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.teams >= 4 && formData.divisions >= 1;
      case 3:
        return formData.regularSeasonEnd > formData.regularSeasonStart;
      case 4:
        return true; // Lineup tem valores padrão
      case 5:
        return true; // Scoring tem valores padrão
      case 6:
        return true;
      default:
        return false;
    }
  };

  const isStepCompleted = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.teams >= 4 && formData.divisions >= 1;
      case 3:
        return formData.regularSeasonEnd > formData.regularSeasonStart;
      case 4:
        return true; // Lineup tem valores padrão
      case 5:
        return true; // Scoring tem valores padrão
      case 6:
        return true;
      default:
        return false;
    }
  };

  const canNavigateToStep = (step: number) => {
    // Sempre pode voltar para etapas anteriores
    if (step < currentStep) return true;
    
    // Sempre pode ficar na etapa atual
    if (step === currentStep) return true;
    
    // Para ir para frente, precisa que todas as etapas anteriores estejam completas
    if (step > currentStep) {
      for (let i = 1; i < step; i++) {
        if (!isStepCompleted(i)) return false;
      }
      return true;
    }
    
    return false;
  };

  const handleStepClick = (step: number) => {
    if (canNavigateToStep(step)) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (!canAdvance()) {
      toast.error("Preencha todos os campos obrigatórios antes de avançar");
      return;
    }
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      toast.success(`Etapa ${currentStep} concluída!`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!canAdvance()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    toast.success("Liga criada com sucesso! 🏈");
    onComplete(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <LeagueNameStep
            name={formData.name}
            logo={formData.logo}
            onChange={(name, logo) => updateFormData({ name, logo })}
          />
        );
      case 2:
        return (
          <TeamsStep
            teams={formData.teams}
            divisions={formData.divisions}
            onChange={(teams, divisions) => updateFormData({ teams, divisions })}
          />
        );
      case 3:
        return (
          <SeasonStep
            regularSeasonStart={formData.regularSeasonStart}
            regularSeasonEnd={formData.regularSeasonEnd}
            playoffsStart={formData.playoffsStart}
            playoffsEnd={formData.playoffsEnd}
            playoffTeams={formData.playoffTeams}
            totalTeams={formData.teams}
            onChange={(data) => updateFormData(data)}
          />
        );
      case 4:
        return (
          <LineupStep
            lineup={formData.lineup}
            onChange={(lineup) => updateFormData({ lineup })}
          />
        );
      case 5:
        return (
          <ScoringStep
            scoring={formData.scoring}
            onChange={(scoring) => updateFormData({ scoring })}
          />
        );
      case 6:
        return (
          <InvitesStep
            leagueName={formData.name}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-24 sm:pt-20 lg:pt-20">
      {/* Progress Bar */}
      <div className="bg-[#2C2F33] border-b border-[#4A4E56] px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white">Criar Nova Liga</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-[#B8BAC1] hover:text-white hover:bg-[#1A2238]"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
          
          <WizardSteps
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            canNavigateToStep={canNavigateToStep}
            isStepCompleted={isStepCompleted}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {renderStep()}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="bg-[#2C2F33] border-t border-[#4A4E56] px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="border-[#4A4E56] text-white hover:bg-[#1A2238]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-center gap-3">
            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="bg-[#0B6623] hover:bg-[#0B6623]/90 text-white"
              >
                Avançar
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canAdvance()}
                className="bg-[#00E6B3] hover:bg-[#00E6B3]/90 text-[#1A2238]"
              >
                Criar Liga
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}