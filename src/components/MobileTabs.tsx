import { Users, User, CheckSquare, UserMinus } from "lucide-react";

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
      label: "Disponíveis",
      icon: Users,
      badge: null,
      color: "#00E6B3"
    },
    {
      id: "roster" as TabType,
      label: "Titulares",
      icon: User,
      badge: `${rosterCount}/${totalSlots}`,
      color: "#0B6623"
    },
    {
      id: "bench" as TabType,
      label: "Reservas", 
      icon: UserMinus,
      badge: benchCount > 0 ? benchCount.toString() : null,
      color: "#FFD700"
    },
    {
      id: "summary" as TabType,
      label: "Confirmar",
      icon: CheckSquare,
      badge: null,
      color: "#00E6B3"
    }
  ];

  return (
    <>
      {/* Backdrop blur for better separation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1A2238] via-[#1A2238]/95 to-transparent pointer-events-none z-40 sm:hidden" />
      
      {/* Main navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
        <div className="bg-[#2C2F33]/95 backdrop-blur-md border-t border-[#4A4E56] shadow-2xl">
          {/* Active indicator bar */}
          <div className="relative">
            <div 
              className="absolute top-0 h-1 bg-gradient-to-r from-[#00E6B3] to-[#0B6623] transition-all duration-300 ease-out rounded-full"
              style={{
                width: '25%',
                left: `${tabs.findIndex(tab => tab.id === activeTab) * 25}%`,
              }}
            />
          </div>
          
          <div className="flex items-stretch">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    relative flex-1 flex flex-col items-center justify-center py-3 px-2 min-h-[72px]
                    transition-all duration-200 ease-out
                    active:scale-95 active:bg-[#1A2238]/50
                    ${isActive 
                      ? 'text-white bg-gradient-to-t from-[#00E6B3]/10 to-transparent' 
                      : 'text-[#B8BAC1] hover:text-white hover:bg-[#1A2238]/30'
                    }
                  `}
                  style={{
                    minHeight: '72px',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {/* Icon container with background */}
                  <div className={`
                    relative flex items-center justify-center w-8 h-8 rounded-lg mb-1
                    transition-all duration-200 ease-out
                    ${isActive 
                      ? 'bg-gradient-to-br from-[#00E6B3]/20 to-[#0B6623]/20 shadow-md' 
                      : 'bg-transparent'
                    }
                  `}>
                    <Icon 
                      className={`
                        w-5 h-5 transition-all duration-200 ease-out
                        ${isActive ? 'text-[#00E6B3] scale-110' : 'text-current'}
                      `} 
                    />
                    
                    {/* Badge */}
                    {tab.badge && (
                      <div className={`
                        absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full
                        flex items-center justify-center text-[10px] font-bold
                        transition-all duration-200 ease-out
                        ${isActive 
                          ? 'bg-[#00E6B3] text-[#1A2238] scale-110' 
                          : 'bg-[#4A4E56] text-white'
                        }
                      `}>
                        {tab.badge}
                      </div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`
                    text-xs font-medium leading-tight transition-all duration-200 ease-out
                    ${isActive ? 'text-white font-semibold' : 'text-current'}
                  `}>
                    {tab.label}
                  </span>
                  
                  {/* Ripple effect */}
                  <div className="absolute inset-0 rounded-none overflow-hidden">
                    <div className={`
                      absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0
                      transition-opacity duration-150 ease-out
                      ${isActive ? 'opacity-100' : ''}
                    `} />
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Safe area padding */}
          <div className="h-[env(safe-area-inset-bottom)] bg-[#2C2F33]/95" />
        </div>
      </nav>
    </>
  );
}