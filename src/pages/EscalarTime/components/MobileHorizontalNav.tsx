import { Home, Trophy, Users, BarChart3, Zap, ClipboardList } from "lucide-react";
import { type NavigationRoute } from "./NavigationMenu";

interface MobileHorizontalNavProps {
  currentRoute: NavigationRoute;
  onNavigate: (route: NavigationRoute) => void;
}

const navItems = [
  {
    id: "home" as NavigationRoute,
    label: "Dashboard",
    icon: Home
  },
  {
    id: "elenco" as NavigationRoute,
    label: "Escalar Time",
    icon: ClipboardList
  },
  {
    id: "criar-liga" as NavigationRoute,
    label: "Criar Liga",
    icon: Trophy
  },
  {
    id: "matchup" as NavigationRoute,
    label: "Partida",
    icon: Zap
  },
  {
    id: "ranking" as NavigationRoute,
    label: "Classificação",
    icon: BarChart3
  },
  {
    id: "playoffs" as NavigationRoute,
    label: "Playoffs",
    icon: Users
  }
];

export function MobileHorizontalNav({ currentRoute, onNavigate }: MobileHorizontalNavProps) {
  return (
    <div className="lg:hidden w-full border-t border-[#4A4E56] bg-[#1A2238] sticky top-[64px] z-40">
      <div className="overflow-x-auto scrollbar-hide relative">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full transition-all whitespace-nowrap flex-shrink-0
                  ${isActive 
                    ? 'bg-[#00E6B3] text-[#1A2238] shadow-lg shadow-[#00E6B3]/30' 
                    : 'bg-[#2C2F33] text-[#B8BAC1] hover:bg-[#3C3F43] active:scale-95'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1A2238]' : 'text-[#B8BAC1]'}`} />
                <span className="text-sm">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        
        {/* Gradient fade para indicar scroll */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#1A2238] via-[#1A2238]/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}