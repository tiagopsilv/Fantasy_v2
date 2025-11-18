import { Check, LucideIcon } from "lucide-react";

export type WizardStep = {
  id: number;
  name: string;
  icon: LucideIcon;
};

export type WizardStepsProps = {
  steps: WizardStep[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
  canNavigateToStep: (stepId: number) => boolean;
  isStepCompleted: (stepId: number) => boolean;
};

export function WizardSteps({
  steps,
  currentStep,
  onStepClick,
  canNavigateToStep,
  isStepCompleted,
}: WizardStepsProps) {
  return (
    <div className="w-full">
      {/* Steps com ícone sempre visíveis em qualquer tamanho de tela */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <StepItem
            key={step.id}
            step={step}
            index={index}
            totalSteps={steps.length}
            currentStep={currentStep}
            onStepClick={onStepClick}
            canNavigateToStep={canNavigateToStep}
            isStepCompleted={isStepCompleted}
          />
        ))}
      </div>

      {/* Texto da etapa atual */}
      <p className="mt-3 text-center text-[#B8BAC1] text-sm">
        Etapa {currentStep} de {steps.length}:{" "}
        {steps.find((s) => s.id === currentStep)?.name ?? ""}
      </p>
    </div>
  );
}

type StepItemProps = {
  step: WizardStep;
  index: number;
  totalSteps: number;
  currentStep: number;
  onStepClick: (stepId: number) => void;
  canNavigateToStep: (stepId: number) => boolean;
  isStepCompleted: (stepId: number) => boolean;
};

function StepItem({
  step,
  index,
  totalSteps,
  currentStep,
  onStepClick,
  canNavigateToStep,
  isStepCompleted,
}: StepItemProps) {
  const Icon = step.icon;

  const isActive = currentStep === step.id;

  // Nunca consideramos o step ativo como "concluído" para o ícone
  const completedByCaller = isStepCompleted(step.id);
  const isCompleted = !isActive && completedByCaller;

  const canNavigate = canNavigateToStep(step.id);
  const isFuture = step.id > currentStep;
  const isLast = index === totalSteps - 1;

  const handleClick = () => {
    if (canNavigate) onStepClick(step.id);
  };

  return (
    <div className="flex items-center flex-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={!canNavigate}
        className={`flex items-center gap-3 ${
          canNavigate ? "cursor-pointer" : "cursor-not-allowed"
        }`}
        aria-label={`${step.name} ${
          isActive ? "atual" : isCompleted ? "concluída" : ""
        }`}
        aria-current={isActive ? "step" : undefined}
      >
        {/* Círculo com ícone ou check */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
            isCompleted
              ? "bg-[#0B6623] border-[#0B6623] hover:bg-[#0B6623]/80"
              : isActive
              ? "bg-[#00E6B3] border-[#00E6B3] text-[#1A2238]"
              : isFuture && canNavigate
              ? "bg-[#2C2F33] border-[#4A4E56] hover:border-[#00E6B3] hover:bg-[#2C2F33]"
              : "bg-[#2C2F33] border-[#4A4E56] opacity-50"
          } ${canNavigate && !isActive ? "hover:scale-110" : ""}`}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-white" />
          ) : (
            <Icon
              className={`w-5 h-5 ${
                isActive ? "text-[#1A2238]" : "text-[#B8BAC1]"
              }`}
            />
          )}
        </div>

        {/* Texto do step sempre visível */}
        <div>
          <p
            className={`text-sm transition-colors ${
              isActive
                ? "text-[#00E6B3]"
                : isCompleted
                ? "text-white hover:text-[#00E6B3]"
                : canNavigate && isFuture
                ? "text-[#B8BAC1] hover:text-white"
                : "text-[#B8BAC1]"
            }`}
          >
            {step.name}
          </p>
        </div>
      </button>

      {/* Conector entre os steps */}
      {!isLast && (
        <div className="flex-1 h-0.5 mx-3 bg-[#4A4E56]" aria-hidden="true">
          <div
            className={`h-full bg-[#0B6623] transition-all duration-300 ${
              isCompleted ? "w-full" : "w-0"
            }`}
          />
        </div>
      )}
    </div>
  );
}
