import { User, Settings, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FantasyHeaderProps {
  leagueName: string;
  userName: string;
  isAdmin?: boolean;
}

export function FantasyHeader({ leagueName, userName, isAdmin = false }: FantasyHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A2238] border-b border-[#4A4E56] px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo e Liga */}
        <div className="flex items-center gap-3 sm:gap-6 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#0B6623] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">🏈</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-white font-bold text-sm sm:text-base truncate">Fantasy Football</h1>
                <Badge className="bg-[#00E6B3] text-[#1A2238] text-xs">
                  PROTÓTIPO
                </Badge>
              </div>
              <p className="text-[#B8BAC1] text-xs sm:text-sm truncate">{leagueName}</p>
            </div>
          </div>
        </div>

        {/* Perfil do usuário */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-white text-sm">{userName}</span>
            {isAdmin && (
              <Badge className="bg-[#FFD700] text-[#1A2238] text-xs flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            )}
          </div>
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