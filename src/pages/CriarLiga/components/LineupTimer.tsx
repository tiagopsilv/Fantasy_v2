import { Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LineupTimerProps {
  deadline: Date;
  isLocked: boolean;
}

export function LineupTimer({ deadline, isLocked }: LineupTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  }>({ hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const deadlineTime = deadline.getTime();
      const difference = deadlineTime - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds, total: difference });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (isLocked || timeLeft.total <= 0) {
    return (
      <Alert className="border-[#B22222] bg-[#B22222]/10 mb-4 sm:mb-6">
        <AlertTriangle className="w-4 h-4 text-[#B22222]" />
        <AlertDescription className="text-[#B22222] font-medium">
          🔒 Lineups bloqueados para esta semana
        </AlertDescription>
      </Alert>
    );
  }

  const isUrgent = timeLeft.total < 3600000; // Less than 1 hour

  return (
    <div className={`rounded-lg border p-3 sm:p-4 mb-4 sm:mb-6 ${
      isUrgent 
        ? 'border-[#B22222] bg-[#B22222]/10' 
        : 'border-[#FFD700] bg-[#FFD700]/10'
    }`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${
          isUrgent ? 'text-[#B22222]' : 'text-[#FFD700]'
        }`} />
        <div className="flex-1">
          <div className={`font-medium text-sm sm:text-base ${
            isUrgent ? 'text-[#B22222]' : 'text-[#FFD700]'
          }`}>
            Lineup fecha em:
          </div>
          <div className={`text-lg sm:text-xl font-bold ${
            isUrgent ? 'text-[#B22222]' : 'text-[#FFD700]'
          }`}>
            {timeLeft.hours.toString().padStart(2, '0')}:
            {timeLeft.minutes.toString().padStart(2, '0')}:
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  );
}