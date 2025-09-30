import { useState } from "react";
import { FantasyHeader } from "./components/FantasyHeader";
import { LeagueSelector, type League } from "./components/LeagueSelector";
import { NavigationBreadcrumb } from "./components/NavigationBreadcrumb";
import { AvailablePlayersList, type Player } from "./components/AvailablePlayersList";
import { TeamRoster } from "./components/TeamRoster";
import { RosterSummary } from "./components/RosterSummary";
import { MobileTabs, type TabType } from "./components/MobileTabs";
import { BenchPlayersList } from "./components/BenchPlayersList";
import { LineupTimer } from "./components/LineupTimer";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

// Mock data
const mockLeagues: League[] = [
  {
    id: "1",
    name: "Liga dos Campeões 2024",
    type: "premium",
    teams: 10,
    maxTeams: 12,
    startDate: "15/09/2024",
    status: "active",
    buyIn: 100,
    prizePool: 1200,
    owner: "Admin Fantasy",
    description: "Liga premium com grandes prêmios e competição de alto nível",
    difficulty: "expert",
    format: "PPR",
    isOwner: false,
    isJoined: true
  },
  {
    id: "2", 
    name: "Liga dos Amigos",
    type: "private",
    teams: 8,
    maxTeams: 10,
    startDate: "01/09/2024",
    status: "active", 
    buyIn: 50,
    prizePool: 500,
    owner: "João Silva",
    description: "Liga privada entre amigos para diversão e competição",
    difficulty: "intermediate",
    format: "Standard",
    isOwner: true,
    isJoined: true
  },
  {
    id: "3",
    name: "Liga Iniciantes 2024",
    type: "public",
    teams: 6,
    maxTeams: 12,
    startDate: "20/09/2024",
    status: "draft",
    buyIn: 0,
    prizePool: 0,
    owner: "Fantasy Central",
    description: "Liga gratuita para iniciantes aprenderem fantasy football",
    difficulty: "beginner",
    format: "Half-PPR",
    isOwner: false,
    isJoined: false
  },
  {
    id: "4",
    name: "Liga Corporativa TechCorp",
    type: "private",
    teams: 12,
    maxTeams: 12,
    startDate: "10/09/2024",
    status: "active",
    buyIn: 75,
    prizePool: 900,
    owner: "HR TechCorp",
    description: "Liga oficial da empresa TechCorp para colaboradores",
    difficulty: "intermediate",
    format: "PPR",
    isOwner: false,
    isJoined: false
  }
];

// Mock team name for the user
const userTeamName = "Meu Time";

const mockPlayers: Player[] = [
  // Quarterbacks
  { id: "1", name: "Josh Allen", position: "QB", team: "BUF", isAvailable: true },
  { id: "2", name: "Patrick Mahomes", position: "QB", team: "KC", isAvailable: true },
  { id: "3", name: "Lamar Jackson", position: "QB", team: "BAL", isAvailable: true },
  { id: "4", name: "Dak Prescott", position: "QB", team: "DAL", isAvailable: true },
  
  // Running Backs
  { id: "5", name: "Christian McCaffrey", position: "RB", team: "SF", isAvailable: true },
  { id: "6", name: "Austin Ekeler", position: "RB", team: "LAC", isAvailable: true },
  { id: "7", name: "Derrick Henry", position: "RB", team: "TEN", isAvailable: true },
  { id: "8", name: "Alvin Kamara", position: "RB", team: "NO", isAvailable: true },
  { id: "9", name: "Nick Chubb", position: "RB", team: "CLE", isAvailable: true },
  { id: "10", name: "Saquon Barkley", position: "RB", team: "NYG", isAvailable: true },
  
  // Wide Receivers
  { id: "11", name: "Cooper Kupp", position: "WR", team: "LAR", isAvailable: true },
  { id: "12", name: "Davante Adams", position: "WR", team: "LV", isAvailable: true },
  { id: "13", name: "Tyreek Hill", position: "WR", team: "MIA", isAvailable: true },
  { id: "14", name: "Stefon Diggs", position: "WR", team: "BUF", isAvailable: true },
  { id: "15", name: "DeAndre Hopkins", position: "WR", team: "ARI", isAvailable: true },
  { id: "16", name: "Mike Evans", position: "WR", team: "TB", isAvailable: true },
  
  // Tight Ends
  { id: "17", name: "Travis Kelce", position: "TE", team: "KC", isAvailable: true },
  { id: "18", name: "Mark Andrews", position: "TE", team: "BAL", isAvailable: true },
  { id: "19", name: "George Kittle", position: "TE", team: "SF", isAvailable: true },
  { id: "20", name: "Darren Waller", position: "TE", team: "NYG", isAvailable: true },
  
  // Kickers
  { id: "21", name: "Justin Tucker", position: "K", team: "BAL", isAvailable: true },
  { id: "22", name: "Harrison Butker", position: "K", team: "KC", isAvailable: true },
  { id: "23", name: "Tyler Bass", position: "K", team: "BUF", isAvailable: true },
  
  // Defenses
  { id: "24", name: "Buffalo Bills", position: "DEF", team: "BUF", isAvailable: true },
  { id: "25", name: "San Francisco 49ers", position: "DEF", team: "SF", isAvailable: true },
  { id: "26", name: "Philadelphia Eagles", position: "DEF", team: "PHI", isAvailable: true },
];

export default function App() {
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [activeTab, setActiveTab] = useState<TabType>("players");
  const [roster, setRoster] = useState<Record<string, Player | null>>({
    QB: null,
    RB1: null,
    RB2: null,
    WR1: null,
    WR2: null,
    TE: null,
    FLEX: null,
    K: null,
    DEF: null,
  });
  const [benchPlayers, setBenchPlayers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [adminAdjustments, setAdminAdjustments] = useState<Record<string, boolean>>({});
  
  // Mock data for timer and admin
  const userName = "Manager";
  const isAdmin = true; // This would come from user context
  const lineupDeadline = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
  const isLocked = false; // This would be calculated based on deadline

  const handleAddPlayer = (player: Player) => {
    if (isLocked) {
      toast.error("Não é possível alterar o lineup após o deadline!");
      return;
    }

    // Encontra a primeira posição disponível para o jogador seguindo as regras
    const position = player.position;
    let slotToFill = "";

    // Contar posições atuais para validar limites
    const positionCounts = {
      QB: 0,
      RB: 0,
      WR: 0,
      TE: 0,
      K: 0,
      DEF: 0
    };

    Object.entries(roster).forEach(([slot, p]) => {
      if (p) {
        if (slot === 'FLEX') {
          positionCounts[p.position as keyof typeof positionCounts]++;
        } else if (slot.startsWith('RB')) {
          positionCounts.RB++;
        } else if (slot.startsWith('WR')) {
          positionCounts.WR++;
        } else {
          positionCounts[p.position as keyof typeof positionCounts]++;
        }
      }
    });

    if (position === "QB" && !roster.QB && positionCounts.QB < 1) {
      slotToFill = "QB";
    } else if (position === "RB") {
      if (!roster.RB1) slotToFill = "RB1";
      else if (!roster.RB2) slotToFill = "RB2";
      else if (!roster.FLEX && positionCounts.RB < 3) slotToFill = "FLEX";
    } else if (position === "WR") {
      if (!roster.WR1) slotToFill = "WR1";
      else if (!roster.WR2) slotToFill = "WR2";
      else if (!roster.FLEX && positionCounts.WR < 3) slotToFill = "FLEX";
    } else if (position === "TE") {
      if (!roster.TE) slotToFill = "TE";
      else if (!roster.FLEX && positionCounts.TE < 2) slotToFill = "FLEX";
    } else if (position === "K" && !roster.K && positionCounts.K < 1) {
      slotToFill = "K";
    } else if (position === "DEF" && !roster.DEF && positionCounts.DEF < 1) {
      slotToFill = "DEF";
    }

    if (slotToFill) {
      setRoster(prev => ({ ...prev, [slotToFill]: player }));
      setPlayers(prev => prev.map(p => 
        p.id === player.id ? { ...p, isAvailable: false } : p
      ));
      setHasUnsavedChanges(true);
      toast.success(`${player.name} foi adicionado ao lineup titular!`);
    } else {
      const limits = {
        QB: "máximo 1",
        RB: "máximo 3 (2 titular + 1 FLEX)",
        WR: "máximo 3 (2 titular + 1 FLEX)", 
        TE: "máximo 2 (1 titular + 1 FLEX)",
        K: "máximo 1",
        DEF: "máximo 1"
      };
      toast.error(`Não há posições disponíveis para ${player.position} (${limits[position as keyof typeof limits] || "posição inválida"})`);
    }
  };

  const handleAddToBench = (player: Player) => {
    if (isLocked) {
      toast.error("Não é possível alterar o lineup após o deadline!");
      return;
    }

    // Contar jogadores no banco por posição
    const benchCounts = {
      QB: 0,
      RB: 0,
      WR: 0,
      TE: 0,
      K: 0,
      DEF: 0
    };

    benchPlayers.forEach(p => {
      benchCounts[p.position as keyof typeof benchCounts]++;
    });

    // Definir limites para o banco (mesmas regras do titular)
    const benchLimits = {
      QB: 1,
      RB: 2, // 2 RB + possibilidade de 1 no FLEX
      WR: 2, // 2 WR + possibilidade de 1 no FLEX
      TE: 1, // 1 TE + possibilidade de 1 no FLEX
      K: 1,
      DEF: 1
    };

    const position = player.position as keyof typeof benchCounts;
    
    // Para RB, WR, TE verificar se pode adicionar mais um considerando FLEX
    let maxAllowed = benchLimits[position];
    if (position === "RB" || position === "WR" || position === "TE") {
      maxAllowed += 1; // +1 pela possibilidade do FLEX
    }

    if (benchCounts[position] >= maxAllowed) {
      const positionNames = {
        QB: "Quarterback",
        RB: "Running Back", 
        WR: "Wide Receiver",
        TE: "Tight End",
        K: "Kicker",
        DEF: "Defesa"
      };
      
      toast.error(`Limite do banco atingido para ${positionNames[position]} (máximo ${maxAllowed})`);
      return;
    }

    setBenchPlayers(prev => [...prev, player]);
    setPlayers(prev => prev.map(p => 
      p.id === player.id ? { ...p, isAvailable: false } : p
    ));
    setHasUnsavedChanges(true);
    toast.success(`${player.name} foi adicionado ao banco!`);
  };

  const handleRemovePlayer = (player: Player) => {
    if (isLocked && !isAdmin) {
      toast.error("Não é possível alterar o lineup após o deadline!");
      return;
    }

    const slotKey = Object.keys(roster).find(key => roster[key]?.id === player.id);
    if (slotKey) {
      setRoster(prev => ({ ...prev, [slotKey]: null }));
      setPlayers(prev => prev.map(p => 
        p.id === player.id ? { ...p, isAvailable: true } : p
      ));
      setHasUnsavedChanges(true);
      toast.success(`${player.name} foi removido do lineup!`);
    }
  };

  const handleMoveToBench = (player: Player) => {
    if (isLocked) {
      toast.error("Não é possível alterar o lineup após o deadline!");
      return;
    }

    const slotKey = Object.keys(roster).find(key => roster[key]?.id === player.id);
    if (!slotKey) return;

    // Verificar se remover este jogador violará as regras obrigatórias
    const positionCounts = {
      QB: 0,
      RB: 0,
      WR: 0,
      TE: 0,
      K: 0,
      DEF: 0
    };

    // Contar posições atuais (excluindo o jogador que será removido)
    Object.entries(roster).forEach(([slot, p]) => {
      if (p && p.id !== player.id) {
        if (slot === 'FLEX') {
          // FLEX conta para a posição do jogador
          positionCounts[p.position as keyof typeof positionCounts]++;
        } else if (slot.startsWith('RB')) {
          positionCounts.RB++;
        } else if (slot.startsWith('WR')) {
          positionCounts.WR++;
        } else {
          positionCounts[p.position as keyof typeof positionCounts]++;
        }
      }
    });

    // Verificar regras mínimas
    const violations = [];
    if (positionCounts.QB < 1) violations.push("1 Quarterback");
    if (positionCounts.RB < 2) violations.push("2 Running Backs");
    if (positionCounts.WR < 2) violations.push("2 Wide Receivers");
    if (positionCounts.TE < 1) violations.push("1 Tight End");
    if (positionCounts.K < 1) violations.push("1 Kicker");
    if (positionCounts.DEF < 1) violations.push("1 Defesa");

    if (violations.length > 0) {
      toast.error(`Não é possível mover para o banco. Lineup deve ter: ${violations.join(", ")}`);
      return;
    }

    setRoster(prev => ({ ...prev, [slotKey]: null }));
    setBenchPlayers(prev => [...prev, player]);
    setHasUnsavedChanges(true);
    toast.success(`${player.name} foi movido para o banco!`);
  };

  const handleRemoveFromBench = (player: Player) => {
    if (isLocked) {
      toast.error("Não é possível alterar o lineup após o deadline!");
      return;
    }

    setBenchPlayers(prev => prev.filter(p => p.id !== player.id));
    setPlayers(prev => prev.map(p => 
      p.id === player.id ? { ...p, isAvailable: true } : p
    ));
    setHasUnsavedChanges(true);
    toast.success(`${player.name} foi removido do banco!`);
  };

  const handleMoveToLineup = (player: Player) => {
    if (isLocked) {
      toast.error("Não é possível alterar o lineup após o deadline!");
      return;
    }

    // Verificar se há espaço disponível seguindo as regras
    const position = player.position;
    let slotToFill = "";

    // Contar posições atuais
    const positionCounts = {
      QB: 0,
      RB: 0,
      WR: 0,
      TE: 0,
      K: 0,
      DEF: 0
    };

    Object.entries(roster).forEach(([slot, p]) => {
      if (p) {
        if (slot === 'FLEX') {
          positionCounts[p.position as keyof typeof positionCounts]++;
        } else if (slot.startsWith('RB')) {
          positionCounts.RB++;
        } else if (slot.startsWith('WR')) {
          positionCounts.WR++;
        } else {
          positionCounts[p.position as keyof typeof positionCounts]++;
        }
      }
    });

    // Encontrar slot disponível seguindo a hierarquia
    if (position === "QB" && !roster.QB) {
      slotToFill = "QB";
    } else if (position === "RB") {
      if (!roster.RB1) slotToFill = "RB1";
      else if (!roster.RB2) slotToFill = "RB2";
      else if (!roster.FLEX && (positionCounts.RB < 3 || positionCounts.WR >= 2 && positionCounts.TE >= 1)) {
        slotToFill = "FLEX";
      }
    } else if (position === "WR") {
      if (!roster.WR1) slotToFill = "WR1";
      else if (!roster.WR2) slotToFill = "WR2";
      else if (!roster.FLEX && (positionCounts.WR < 3 || positionCounts.RB >= 2 && positionCounts.TE >= 1)) {
        slotToFill = "FLEX";
      }
    } else if (position === "TE") {
      if (!roster.TE) slotToFill = "TE";
      else if (!roster.FLEX && (positionCounts.TE < 2 || positionCounts.RB >= 2 && positionCounts.WR >= 2)) {
        slotToFill = "FLEX";
      }
    } else if (position === "K" && !roster.K) {
      slotToFill = "K";
    } else if (position === "DEF" && !roster.DEF) {
      slotToFill = "DEF";
    }

    if (slotToFill) {
      // Remove from bench first
      setBenchPlayers(prev => prev.filter(p => p.id !== player.id));
      
      // Add to lineup
      setRoster(prev => ({ ...prev, [slotToFill]: player }));
      setHasUnsavedChanges(true);
      toast.success(`${player.name} foi movido para o lineup titular!`);
    } else {
      toast.error(`Não há posições disponíveis para ${player.position}. Verifique as regras de formação.`);
    }
  };

  const handleSaveLineup = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setHasUnsavedChanges(false);
    // Success toast is handled by SaveLineupButton component
  };

  const handleConfirmRoster = () => {
    if (isLocked && !isAdmin) {
      toast.error("Não é possível confirmar lineup após o deadline!");
      return;
    }

    toast.success(`Elenco do ${userTeamName} confirmado com sucesso!`);
    setHasUnsavedChanges(false);
  };

  const selectedLeagueData = mockLeagues.find(l => l.id === selectedLeague);
  const totalSlots = 9;
  const filledSlots = Object.values(roster).filter(player => player !== null).length;

  const renderMobileContent = () => {
    switch (activeTab) {
      case "players":
        return (
          <AvailablePlayersList
            players={players}
            onAddPlayer={handleAddPlayer}
            onAddToBench={handleAddToBench}
            isLocked={isLocked}
          />
        );
      case "roster":
        return (
          <TeamRoster
            roster={roster}
            onRemovePlayer={handleRemovePlayer}
            onMoveToBench={handleMoveToBench}
            isLocked={isLocked}
            adminAdjustments={adminAdjustments}
          />
        );
      case "bench":
        return (
          <BenchPlayersList
            benchPlayers={benchPlayers}
            onRemoveFromBench={handleRemoveFromBench}
            onMoveToLineup={handleMoveToLineup}
            isLocked={isLocked}
          />
        );
      case "summary":
        return (
          <RosterSummary
            roster={roster}
            onConfirmRoster={handleConfirmRoster}
            onSaveLineup={handleSaveLineup}
            isLocked={isLocked}
            hasChanges={hasUnsavedChanges}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A2238] flex flex-col">
      <FantasyHeader 
        leagueName={selectedLeagueData?.name || "Fantasy Football"} 
        userName={userName}
        isAdmin={isAdmin}
      />
      
      <main className="flex-1 pt-16 sm:pt-20 px-4 sm:px-6 pb-20 sm:pb-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 h-full flex flex-col">
          {/* Breadcrumb Navigation */}
          {selectedLeagueData && (
            <NavigationBreadcrumb 
              items={[
                { 
                  label: selectedLeagueData.name, 
                  onClick: () => setSelectedLeague(""),
                  active: false 
                },
                { 
                  label: userTeamName, 
                  active: true 
                }
              ]} 
            />
          )}

          {/* Título da página */}
          <div className="text-center">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
              {!selectedLeague ? "Selecionar Liga" : "Registro de Elenco Inicial"}
            </h2>
            <p className="text-[#B8BAC1] text-sm sm:text-base">
              {!selectedLeague ? "Escolha uma liga para participar" : "Monte seu time escolhendo jogadores para cada posição"}
            </p>
          </div>

          {/* Seletor de liga */}
          {!selectedLeague && (
            <LeagueSelector
              leagues={mockLeagues}
              selectedLeague={selectedLeague}
              onLeagueSelect={setSelectedLeague}
              userName={userName}
            />
          )}

          {/* Timer de deadline */}
          {selectedLeague && (
            <LineupTimer 
              deadline={lineupDeadline}
              isLocked={isLocked}
            />
          )}

          {selectedLeague && (
            <>
              {/* Layout Desktop */}
              <div className="hidden sm:grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1">
                {/* Lista de jogadores disponíveis */}
                <div className="xl:col-span-2">
                  <AvailablePlayersList
                    players={players}
                    onAddPlayer={handleAddPlayer}
                    onAddToBench={handleAddToBench}
                    isLocked={isLocked}
                  />
                </div>

                {/* Resumo */}
                <div>
                  <RosterSummary
                    roster={roster}
                    onConfirmRoster={handleConfirmRoster}
                    onSaveLineup={handleSaveLineup}
                    isLocked={isLocked}
                    hasChanges={hasUnsavedChanges}
                  />
                </div>
              </div>

              {/* Elenco para Desktop */}
              <div className="hidden sm:block space-y-6">
                <TeamRoster
                  roster={roster}
                  onRemovePlayer={handleRemovePlayer}
                  onMoveToBench={handleMoveToBench}
                  isLocked={isLocked}
                  adminAdjustments={adminAdjustments}
                />
                
                <BenchPlayersList
                  benchPlayers={benchPlayers}
                  onRemoveFromBench={handleRemoveFromBench}
                  onMoveToLineup={handleMoveToLineup}
                  isLocked={isLocked}
                />
              </div>

              {/* Layout Mobile */}
              <div className="sm:hidden flex-1 flex flex-col min-h-0">
                {renderMobileContent()}
              </div>
            </>
          )}

          {!selectedLeague && (
            <div className="text-center py-12 flex-1 flex items-center justify-center">
              <div className="text-[#B8BAC1] text-base sm:text-lg">
                Selecione uma liga para começar
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      {selectedLeague && (
        <MobileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          rosterCount={filledSlots}
          benchCount={benchPlayers.length}
          totalSlots={totalSlots}
        />
      )}
      
      <Toaster />
    </div>
  );
}