import { User, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NavigationMenu, type NavigationRoute } from "./NavigationMenu";
import logo10Jardas from "@/assets/b27cd75d5ec443417f6217cb44cb8b999a3d7357.png";

interface FantasyHeaderProps {
  leagueName: string;
  userName: string;
  isAdmin?: boolean;
  currentRoute?: NavigationRoute;
  onNavigate?: (route: NavigationRoute) => void;
}

export function FantasyHeader({ 
  leagueName, 
  userName, 
  isAdmin = false,
  currentRoute = "elenco",
  onNavigate = () => {}
}: FantasyHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A2238] border-b border-[#4A4E56] px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        {/* Logo e Fantasy Football */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="bg-white rounded-md px-2 py-1">
            <img 
              src={logo10Jardas} 
              alt="10 Jardas" 
              className="h-5 sm:h-6 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-white font-bold text-sm sm:text-base whitespace-nowrap">Fantasy Football</h1>
            <Badge className="bg-[#00E6B3] text-[#1A2238] text-xs">
              PROTÓTIPO
            </Badge>
          </div>
        </div>

        {/* Menu de Navegação - Desktop */}
        <NavigationMenu 
          currentRoute={currentRoute}
          onNavigate={onNavigate}
          leagueName={leagueName}
        />

        {/* Perfil do usuário */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-[#2C2F33] h-8 w-8 sm:h-9 sm:w-9 p-0"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-[#2C2F33] h-8 w-8 sm:h-9 sm:w-9 p-0"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}