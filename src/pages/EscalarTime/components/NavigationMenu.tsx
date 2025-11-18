import { useState } from "react";
import { Home, Trophy, Users, BarChart3, Zap, Menu, X, ClipboardList, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavigationRoute = "home" | "criar-liga" | "matchup" | "ranking" | "playoffs" | "elenco";

interface NavigationMenuProps {
  currentRoute: NavigationRoute;
  onNavigate: (route: NavigationRoute) => void;
  leagueName?: string;
}

const menuItems = [
  {
    id: "home" as NavigationRoute,
    label: "Dashboard",
    icon: Home,
    description: "Visão geral e resumo"
  },
  {
    id: "elenco" as NavigationRoute,
    label: "Escalar Time",
    icon: ClipboardList,
    description: "Montar seu elenco"
  },
  {
    id: "criar-liga" as NavigationRoute,
    label: "Criar Liga",
    icon: Trophy,
    description: "Criar nova liga"
  },
  {
    id: "matchup" as NavigationRoute,
    label: "Partida da Semana",
    icon: Zap,
    description: "Confronto atual"
  },
  {
    id: "ranking" as NavigationRoute,
    label: "Classificação",
    icon: BarChart3,
    description: "Tabela e ranking"
  },
  {
    id: "playoffs" as NavigationRoute,
    label: "Playoffs",
    icon: Users,
    description: "Chaveamento eliminatório"
  }
];

export function NavigationMenu({ currentRoute, onNavigate, leagueName }: NavigationMenuProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (route: NavigationRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleNavigation(item.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${isActive 
                  ? 'bg-[#00E6B3]/20 text-[#00E6B3] hover:bg-[#00E6B3]/30' 
                  : 'text-[#B8BAC1] hover:text-white hover:bg-[#2C2F33]'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Mobile Navigation - Hamburger Menu */}
      <div className="lg:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger
            className="text-white hover:bg-[#2C2F33] p-2 rounded-md transition-colors inline-flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="bg-[#1A2238] border-[#4A4E56] w-[280px] p-0"
          >
            <div className="flex flex-col h-full">
              <SheetHeader className="px-6 py-4 border-b border-[#4A4E56]">
                <SheetTitle className="text-white">
                  Menu
                </SheetTitle>
                {leagueName && (
                  <p className="text-[#00E6B3] text-sm">
                    {leagueName}
                  </p>
                )}
              </SheetHeader>
              
              <div className="flex-1 overflow-y-auto py-4 px-3">
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentRoute === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                          ${isActive 
                            ? 'bg-[#00E6B3]/20 border-l-4 border-[#00E6B3] pl-[10px]' 
                            : 'bg-[#2C2F33]/50 hover:bg-[#2C2F33] border-l-4 border-transparent'
                          }
                        `}
                      >
                        <Icon 
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive ? 'text-[#00E6B3]' : 'text-[#B8BAC1]'
                          }`} 
                        />
                        <div className="flex-1 text-left">
                          <div className={`text-sm ${
                            isActive ? 'text-[#00E6B3]' : 'text-white'
                          }`}>
                            {item.label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer do Menu Mobile */}
              <div className="border-t border-[#4A4E56] p-4 bg-[#1A2238]">
                <div className="flex items-center gap-2">
                  <div className="bg-white rounded px-1.5 py-0.5">
                    <span className="text-[#1A2238] text-xs">10 JARDAS</span>
                  </div>
                  <div>
                    <p className="text-[#B8BAC1] text-xs">
                      Fantasy Football
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}