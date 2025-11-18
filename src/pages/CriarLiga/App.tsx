import { useState } from "react";
import { FantasyHeader } from "./components/FantasyHeader";
import { NavigationRoute } from "./components/NavigationMenu";
import { MobileHorizontalNav } from "./components/MobileHorizontalNav";
import { CreateLeague, type LeagueFormData } from "./components/CreateLeague";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>("criar-liga");

  const handleNavigate = (route: NavigationRoute) => {
    setCurrentRoute(route);
    
    const routeNames = {
      home: "Dashboard",
      elenco: "Escalar Time",
      "criar-liga": "Criar Liga",
      matchup: "Partida da Semana",
      ranking: "Classificação",
      playoffs: "Playoffs"
    };
    
    if (route !== "criar-liga") {
      toast.info(`Navegando para ${routeNames[route]}...`);
    }
  };

  const handleLeagueComplete = (data: LeagueFormData) => {
    console.log("Liga criada:", data);
    toast.success("🏈 Liga criada com sucesso!", {
      description: `${data.name} está pronta para receber participantes!`,
      duration: 5000,
    });
    
    // Aqui você redirecionaria para o dashboard ou lista de ligas
    setTimeout(() => {
      toast.info("Redirecionando para Dashboard...");
    }, 2000);
  };

  const handleCancel = () => {
    toast.info("Criação de liga cancelada");
    // Aqui você redirecionaria para outra tela
  };

  return (
    <div className="min-h-screen bg-[#1A2238] flex flex-col">
      <FantasyHeader 
        leagueName="Fantasy Football" 
        userName="Manager"
        isAdmin={true}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />
      
      <MobileHorizontalNav 
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />
      
      {currentRoute === "criar-liga" ? (
        <CreateLeague
          onCancel={handleCancel}
          onComplete={handleLeagueComplete}
        />
      ) : (
        <main className="flex-1 pt-24 sm:pt-20 px-4 sm:px-6 pb-28 sm:pb-8 lg:pt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <h2 className="text-white text-3xl mb-4">
                {currentRoute === "home" && "Dashboard"}
                {currentRoute === "elenco" && "Escalar Time"}
                {currentRoute === "matchup" && "Partida da Semana"}
                {currentRoute === "ranking" && "Classificação"}
                {currentRoute === "playoffs" && "Playoffs"}
              </h2>
              <p className="text-[#B8BAC1]">
                Tela em desenvolvimento...
              </p>
            </div>
          </div>
        </main>
      )}
      
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            marginBottom: '100px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          },
          className: 'mobile-backdrop',
        }}
      />
    </div>
  );
}