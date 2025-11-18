import { useState, useEffect } from "react";
import { FantasyHeader } from "./components/FantasyHeader";
import { NavigationRoute } from "./components/NavigationMenu";
import { MobileHorizontalNav } from "./components/MobileHorizontalNav";
import { LeagueSelector, type League } from "./components/LeagueSelector";
import { NavigationBreadcrumb } from "./components/NavigationBreadcrumb";
import { AvailablePlayersList, type Player } from "./components/AvailablePlayersList";
import { TeamRoster } from "./components/TeamRoster";
import { RosterSummary } from "./components/RosterSummary";
import { MobileTabs, type TabType } from "./components/MobileTabs";
import { BenchPlayersList } from "./components/BenchPlayersList";
import { LineupTimer } from "./components/LineupTimer";
import { TeamNameInput } from "./components/TeamNameInput";
import { DivisionSelector } from "./components/DivisionSelector";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

// Mock data
const mockLeagues: League[] = [
  {
    id: "1",
    name: "Liga dos Campeões 2024",
    teams: 10,
    maxTeams: 12,
    owner: "Admin Fantasy",
    isOwner: false,
    isJoined: true,
    userTeamName: "Thunder Warriors",
    hasLineup: true,
    hasDivisions: true,
    divisions: [
      {
        name: "Divisão Norte",
        teams: [
          { id: "t1", name: "Thunder Warriors", owner: "Manager" },
          { id: "t2", name: "Storm Chasers", owner: "Pedro Costa" },
          { id: "t3", name: "Lightning Bolts", owner: "Ana Silva" },
        ]
      },
      {
        name: "Divisão Sul",
        teams: [
          { id: "t4", name: "Fire Dragons", owner: "Carlos Mendes" },
          { id: "t5", name: "Ice Wolves", owner: "Maria Santos" },
          { id: "t6", name: "Wind Runners", owner: "Lucas Almeida" },
        ]
      },
      {
        name: "Divisão Leste",
        teams: [
          { id: "t7", name: "Earth Titans", owner: "Juliana Rocha" },
          { id: "t8", name: "Water Warriors", owner: "Rafael Lima" },
          { id: "t9", name: "Metal Knights", owner: "Fernanda Souza" },
          { id: "t10", name: "Forest Guardians", owner: "Thiago Oliveira" },
        ]
      }
    ],
    registeredTeams: [
      { id: "t1", name: "Thunder Warriors", owner: "Manager", division: "Norte" },
      { id: "t2", name: "Storm Chasers", owner: "Pedro Costa", division: "Norte" },
      { id: "t3", name: "Lightning Bolts", owner: "Ana Silva", division: "Norte" },
      { id: "t4", name: "Fire Dragons", owner: "Carlos Mendes", division: "Sul" },
      { id: "t5", name: "Ice Wolves", owner: "Maria Santos", division: "Sul" },
      { id: "t6", name: "Wind Runners", owner: "Lucas Almeida", division: "Sul" },
      { id: "t7", name: "Earth Titans", owner: "Juliana Rocha", division: "Leste" },
      { id: "t8", name: "Water Warriors", owner: "Rafael Lima", division: "Leste" },
      { id: "t9", name: "Metal Knights", owner: "Fernanda Souza", division: "Leste" },
      { id: "t10", name: "Forest Guardians", owner: "Thiago Oliveira", division: "Leste" },
    ]
  },
  {
    id: "2", 
    name: "Liga dos Amigos",
    teams: 8,
    maxTeams: 10,
    owner: "João Silva",
    isOwner: true,
    isJoined: true,
    userTeamName: "Meu Time",
    hasLineup: false,
    hasDivisions: false,
    registeredTeams: [
      { id: "t11", name: "Meu Time", owner: "Manager" },
      { id: "t12", name: "Os Invencíveis", owner: "João Silva" },
      { id: "t13", name: "Guerreiros FC", owner: "Marcos Paulo" },
      { id: "t14", name: "Falcons United", owner: "Beatriz Nunes" },
      { id: "t15", name: "Phoenix Rising", owner: "Gabriel Martins" },
      { id: "t16", name: "Titans Squad", owner: "Amanda Costa" },
      { id: "t17", name: "Eagles Elite", owner: "Roberto Dias" },
      { id: "t18", name: "Champions Team", owner: "Patrícia Ferreira" },
    ]
  },
  {
    id: "3",
    name: "Liga Iniciantes 2024",
    teams: 6,
    maxTeams: 12,
    owner: "Fantasy Central",
    isOwner: false,
    isJoined: false,
    hasDivisions: false,
    registeredTeams: [
      { id: "t19", name: "Rookies FC", owner: "Caio Rodrigues" },
      { id: "t20", name: "Novatos United", owner: "Larissa Souza" },
      { id: "t21", name: "Beginners Team", owner: "Felipe Santos" },
      { id: "t22", name: "First Timers", owner: "Camila Oliveira" },
      { id: "t23", name: "Starter Squad", owner: "Bruno Alves" },
      { id: "t24", name: "Newbies FC", owner: "Renata Lima" },
    ]
  },
  {
    id: "4",
    name: "Liga Corporativa TechCorp",
    teams: 12,
    maxTeams: 12,
    owner: "HR TechCorp",
    isOwner: false,
    isJoined: false,
    hasDivisions: true,
    divisions: [
      {
        name: "Divisão Dev",
        teams: [
          { id: "t25", name: "Code Crushers", owner: "André Developer" },
          { id: "t26", name: "Bug Fixers", owner: "Carla Tech" },
          { id: "t27", name: "Stack Warriors", owner: "Diego Code" },
          { id: "t28", name: "Git Masters", owner: "Elena Dev" },
        ]
      },
      {
        name: "Divisão Marketing",
        teams: [
          { id: "t29", name: "Brand Builders", owner: "Fabio Marketing" },
          { id: "t30", name: "Creative Squad", owner: "Giovana Ads" },
          { id: "t31", name: "Content Kings", owner: "Hugo Social" },
          { id: "t32", name: "Digital Ninjas", owner: "Isabela Brand" },
        ]
      },
      {
        name: "Divisão Vendas",
        teams: [
          { id: "t33", name: "Sales Champions", owner: "Jorge Vendas" },
          { id: "t34", name: "Deal Makers", owner: "Karina Sales" },
          { id: "t35", name: "Revenue Runners", owner: "Leonardo Win" },
          { id: "t36", name: "Closers United", owner: "Mariana Deal" },
        ]
      }
    ],
    registeredTeams: [
      { id: "t25", name: "Code Crushers", owner: "André Developer", division: "Dev" },
      { id: "t26", name: "Bug Fixers", owner: "Carla Tech", division: "Dev" },
      { id: "t27", name: "Stack Warriors", owner: "Diego Code", division: "Dev" },
      { id: "t28", name: "Git Masters", owner: "Elena Dev", division: "Dev" },
      { id: "t29", name: "Brand Builders", owner: "Fabio Marketing", division: "Marketing" },
      { id: "t30", name: "Creative Squad", owner: "Giovana Ads", division: "Marketing" },
      { id: "t31", name: "Content Kings", owner: "Hugo Social", division: "Marketing" },
      { id: "t32", name: "Digital Ninjas", owner: "Isabela Brand", division: "Marketing" },
      { id: "t33", name: "Sales Champions", owner: "Jorge Vendas", division: "Vendas" },
      { id: "t34", name: "Deal Makers", owner: "Karina Sales", division: "Vendas" },
      { id: "t35", name: "Revenue Runners", owner: "Leonardo Win", division: "Vendas" },
      { id: "t36", name: "Closers United", owner: "Mariana Deal", division: "Vendas" },
    ]
  },
  {
    id: "5",
    name: "Liga Elite Brasil",
    teams: 4,
    maxTeams: 8,
    owner: "Admin Elite",
    isOwner: false,
    isJoined: false,
    hasDivisions: true,
    divisions: [
      {
        name: "Divisão Nordeste",
        teams: [
          { id: "t37", name: "Elite Warriors", owner: "Nando Pro" },
          { id: "t38", name: "Pro Masters", owner: "Olivia Elite" },
        ]
      },
      {
        name: "Divisão Sudeste",
        teams: [
          { id: "t39", name: "Champions League", owner: "Paulo Expert" },
          { id: "t40", name: "Victory Squad", owner: "Quésia Winner" },
        ]
      }
    ],
    registeredTeams: [
      { id: "t37", name: "Elite Warriors", owner: "Nando Pro", division: "Nordeste" },
      { id: "t38", name: "Pro Masters", owner: "Olivia Elite", division: "Nordeste" },
      { id: "t39", name: "Champions League", owner: "Paulo Expert", division: "Sudeste" },
      { id: "t40", name: "Victory Squad", owner: "Quésia Winner", division: "Sudeste" },
    ]
  }
];

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

// Mock de lineups salvos por liga (simulando dados do backend)
const mockSavedLineups: Record<string, {
  roster: Record<string, Player | null>;
  bench: Player[];
}> = {
  "1": { // Liga dos Campeões 2024
    roster: {
      QB: { id: "1", name: "Josh Allen", position: "QB", team: "BUF", isAvailable: false },
      RB1: { id: "5", name: "Christian McCaffrey", position: "RB", team: "SF", isAvailable: false },
      RB2: { id: "7", name: "Derrick Henry", position: "RB", team: "TEN", isAvailable: false },
      WR1: { id: "11", name: "Cooper Kupp", position: "WR", team: "LAR", isAvailable: false },
      WR2: { id: "13", name: "Tyreek Hill", position: "WR", team: "MIA", isAvailable: false },
      TE: { id: "17", name: "Travis Kelce", position: "TE", team: "KC", isAvailable: false },
      FLEX: { id: "12", name: "Davante Adams", position: "WR", team: "LV", isAvailable: false },
      K: { id: "21", name: "Justin Tucker", position: "K", team: "BAL", isAvailable: false },
      DEF: { id: "24", name: "Buffalo Bills", position: "DEF", team: "BUF", isAvailable: false },
    },
    bench: [
      { id: "6", name: "Austin Ekeler", position: "RB", team: "LAC", isAvailable: false },
      { id: "18", name: "Mark Andrews", position: "TE", team: "BAL", isAvailable: false },
    ]
  }
};

export default function App() {
  const [selectedLeague, setSelectedLeague] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>("elenco");
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
  const [teamNames, setTeamNames] = useState<Record<string, string>>({
    "1": "Thunder Warriors",
    "2": "Meu Time"
  });
  
  // Mock data for timer and admin
  const userName = "Manager";
  const isAdmin = true; // This would come from user context
  const lineupDeadline = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
  const [currentTime, setCurrentTime] = useState(new Date());
  const isLocked = currentTime >= lineupDeadline;

  // Atualizar o tempo atual a cada segundo para verificar o deadline
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Notificar quando o deadline for atingido
  useEffect(() => {
    if (isLocked && selectedLeague) {
      toast.error("⏰ Deadline atingido! O lineup foi bloqueado para edições.");
    }
  }, [isLocked, selectedLeague]);

  // Carregar lineup salvo quando a liga for selecionada
  useEffect(() => {
    if (selectedLeague) {
      const savedLineup = mockSavedLineups[selectedLeague];
      
      if (savedLineup) {
        // Carregar o roster salvo
        setRoster(savedLineup.roster);
        setBenchPlayers(savedLineup.bench);
        
        // Atualizar disponibilidade dos jogadores
        const usedPlayerIds = [
          ...Object.values(savedLineup.roster).filter(p => p !== null).map(p => p!.id),
          ...savedLineup.bench.map(p => p.id)
        ];
        
        setPlayers(mockPlayers.map(p => ({
          ...p,
          isAvailable: !usedPlayerIds.includes(p.id)
        })));
        
        setHasUnsavedChanges(false);
        toast.success(`Lineup de ${selectedLeagueData?.userTeamName || 'seu time'} carregado!`);
      } else {
        // Resetar para um lineup vazio
        setRoster({
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
        setBenchPlayers([]);
        setPlayers(mockPlayers);
        setHasUnsavedChanges(false);
      }
    }
  }, [selectedLeague]);

  const handleAddPlayer = (player: Player) => {
    if (isLocked) {
      toast.error("Não é possível alterar o lineup após o deadline!");
      return;
    }

    const position = player.position;
    let slotToFill = "";
    let playerToReplace: Player | null = null;

    // Verificar se há slot vazio primeiro
    if (position === "QB" && !roster.QB) {
      slotToFill = "QB";
    } else if (position === "RB") {
      if (!roster.RB1) slotToFill = "RB1";
      else if (!roster.RB2) slotToFill = "RB2";
      else if (!roster.FLEX) {
        slotToFill = "FLEX";
      } else if (roster.FLEX?.position === "RB") {
        // Troca automática: substituir o RB no FLEX
        slotToFill = "FLEX";
        playerToReplace = roster.FLEX;
      }
    } else if (position === "WR") {
      if (!roster.WR1) slotToFill = "WR1";
      else if (!roster.WR2) slotToFill = "WR2";
      else if (!roster.FLEX) {
        slotToFill = "FLEX";
      } else if (roster.FLEX?.position === "WR") {
        // Troca automática: substituir o WR no FLEX
        slotToFill = "FLEX";
        playerToReplace = roster.FLEX;
      }
    } else if (position === "TE") {
      if (!roster.TE) slotToFill = "TE";
      else if (!roster.FLEX) {
        slotToFill = "FLEX";
      } else if (roster.FLEX?.position === "TE") {
        // Troca automática: substituir o TE no FLEX
        slotToFill = "FLEX";
        playerToReplace = roster.FLEX;
      }
    } else if (position === "K") {
      if (!roster.K) {
        slotToFill = "K";
      } else {
        // Troca automática: substituir o K
        slotToFill = "K";
        playerToReplace = roster.K;
      }
    } else if (position === "DEF") {
      if (!roster.DEF) {
        slotToFill = "DEF";
      } else {
        // Troca automática: substituir a DEF
        slotToFill = "DEF";
        playerToReplace = roster.DEF;
      }
    } else if (position === "QB" && roster.QB) {
      // Troca automática: substituir o QB
      slotToFill = "QB";
      playerToReplace = roster.QB;
    }

    if (slotToFill) {
      // Realizar a troca
      setRoster(prev => ({ ...prev, [slotToFill]: player }));
      setPlayers(prev => prev.map(p => {
        if (p.id === player.id) return { ...p, isAvailable: false };
        if (playerToReplace && p.id === playerToReplace.id) return { ...p, isAvailable: true };
        return p;
      }));
      setHasUnsavedChanges(true);
      
      if (playerToReplace) {
        toast.success(`${player.name} substituiu ${playerToReplace.name} no lineup!`, {
          description: `${playerToReplace.name} retornou para jogadores disponíveis`
        });
      } else {
        toast.success(`${player.name} foi adicionado ao lineup titular!`);
      }
    } else {
      toast.error(`Não é possível adicionar ${player.name}. Todas as posições compatíveis estão ocupadas.`);
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

    const teamName = selectedLeagueData?.userTeamName || "seu time";
    toast.success(`Elenco do ${teamName} confirmado com sucesso!`);
    setHasUnsavedChanges(false);
  };

  const handleCreateLeague = () => {
    // Em produção, isso navegaria para a rota de criação de liga
    // Por exemplo: navigate('/criar-liga') ou window.location.href = '/criar-liga'
    console.log("Navegando para página de criação de liga: /criar-liga");
    toast.info("Redirecionando para criação de liga...");
    
    // Simulação de navegação - em produção, use um router real
    setTimeout(() => {
      window.location.href = '/criar-liga';
    }, 1000);
  };

  const handleSaveTeamName = (teamName: string) => {
    if (!selectedLeague) return;
    
    setTeamNames(prev => ({
      ...prev,
      [selectedLeague]: teamName
    }));
    
    // Em produção, isso seria uma chamada à API para salvar o nome do time
    console.log(`Salvando nome do time "${teamName}" para a liga ${selectedLeague}`);
  };

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
    
    toast.info(`Navegando para ${routeNames[route]}...`);
    
    // Em produção, você usaria um router real (React Router, Next.js, etc.)
    // Por enquanto, mostramos apenas a mensagem
    console.log(`Navegando para rota: ${route}`);
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
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />
      
      {/* Mobile Horizontal Navigation */}
      <MobileHorizontalNav 
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />
      
      <main className="flex-1 pt-24 sm:pt-20 px-4 sm:px-6 pb-28 sm:pb-8 lg:pt-20">
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
                  label: selectedLeagueData.userTeamName || "Meu Time", 
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
            <p className="text-[#B8BAC1] text-base sm:text-lg">
              {!selectedLeague 
                ? "Escolha uma liga para participar" 
                : (
                  <>
                    <span className="text-[#00E6B3] text-lg sm:text-xl font-semibold">{selectedLeagueData?.name}</span>
                    {selectedLeagueData?.userTeamName && (
                      <> • {selectedLeagueData.userTeamName}</>
                    )}
                  </>
                )
              }
            </p>
          </div>

          {/* Seletor de liga */}
          {!selectedLeague && (
            <LeagueSelector
              leagues={mockLeagues}
              selectedLeague={selectedLeague}
              onLeagueSelect={setSelectedLeague}
              userName={userName}
              onCreateLeague={handleCreateLeague}
            />
          )}

          {/* Timer de deadline */}
          {selectedLeague && (
            <LineupTimer 
              deadline={lineupDeadline}
              isLocked={isLocked}
            />
          )}

          {/* Nome do Time */}
          {selectedLeague && (
            <TeamNameInput
              currentTeamName={teamNames[selectedLeague]}
              onSave={handleSaveTeamName}
              isLocked={isLocked}
            />
          )}

          {/* Seletor de Divisão (se a liga tiver divisões) */}
          {selectedLeague && selectedLeagueData?.hasDivisions && selectedLeagueData?.divisions && (
            <DivisionSelector
              divisions={selectedLeagueData.divisions}
              selectedDivision={selectedDivision}
              onDivisionSelect={(division) => {
                setSelectedDivision(division);
                toast.success(`Divisão "${division}" selecionada!`);
              }}
              userName={userName}
              maxTeamsPerDivision={4}
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
              <div className="sm:hidden flex-1 flex flex-col min-h-0 pb-2">
                <div className="flex-1 overflow-auto mobile-scroll">
                  {renderMobileContent()}
                </div>
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
      
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            marginBottom: '100px', // Maior espaço para o novo menu
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          },
          className: 'mobile-backdrop',
        }}
      />
    </div>
  );
}