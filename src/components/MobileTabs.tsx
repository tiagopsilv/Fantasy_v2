import { Users, User, CheckSquare, UserMinus } from "lucide-react";
import { Button } from "./ui/button";

export type TabType = "players" | "roster" | "bench" | "summary";

interface MobileTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  rosterCount: number;
  benchCount: number;
  totalSlots: number;
}

export function MobileTabs({ activeTab, onTabChange, rosterCount, benchCount, totalSlots }: MobileTabsProps) {
  const tabs = [
    {
      id: "players" as TabType,
      label: "Jogadores",
      icon: Users,
      description: "Disponíveis"
    },
    {
      id: "roster" as TabType,
      label: "Lineup",
      icon: User,
      description: `${rosterCount}/${totalSlots}`
    },
    {
      id: "bench" as TabType,
      label: "Banco",
      icon: UserMinus,
      description: `${benchCount}`
    },
    {
      id: "summary" as TabType,
      label: "Resumo",
      icon: CheckSquare,
      description: "Finalizar"
    }
  ];

  return (
    <div className="bg-[#2C2F33] border-t border-[#4A4E56] sticky bottom-0 z-40 sm:hidden safe-area-padding">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-none min-h-[60px]
                ${isActive 
                  ? 'text-[#00E6B3] bg-[#00E6B3]/10 border-t-2 border-[#00E6B3]' 
                  : 'text-[#B8BAC1] hover:text-white hover:bg-[#1A2238]'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <div className="text-center">
                <div className="text-xs font-medium">{tab.label}</div>
                <div className="text-[10px] opacity-80">{tab.description}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}