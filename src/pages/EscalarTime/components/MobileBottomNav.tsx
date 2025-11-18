import { Home, Trophy, Users, BarChart3, Zap, ClipboardList } from "lucide-react";
import { type NavigationRoute } from "./NavigationMenu";

interface MobileBottomNavProps {
  currentRoute: NavigationRoute;
  onNavigate: (route: NavigationRoute) => void;
}

const navItems = [
  {
    id: "home" as NavigationRoute,
    label: "Home",
    icon: Home
  },
  {
    id: "elenco" as NavigationRoute,
    label: "Elenco",
    icon: ClipboardList
  },
  {
    id: "matchup" as NavigationRoute,
    label: "Partida",
    icon: Zap
  },
  {
    id: "ranking" as NavigationRoute,
    label: "Ranking",
    icon: BarChart3
  },
  {
    id: "playoffs" as NavigationRoute,
    label: "Playoffs",
    icon: Users
  }
];

export function MobileBottomNav({ currentRoute, onNavigate }: MobileBottomNavProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A2238] border-t border-[#4A4E56] pb-safe">
      <div className="grid grid-cols-5 gap-1 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg transition-all
                ${isActive 
                  ? 'bg-[#00E6B3]/20' 
                  : 'hover:bg-[#2C2F33]/50 active:bg-[#2C2F33]'
                }
              `}
            >
              <Icon 
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#00E6B3]' : 'text-[#B8BAC1]'
                }`} 
              />
              <span 
                className={`text-[10px] transition-colors ${
                  isActive ? 'text-[#00E6B3]' : 'text-[#B8BAC1]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
