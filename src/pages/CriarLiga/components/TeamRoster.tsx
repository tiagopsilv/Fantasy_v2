import { RosterSlot } from "./RosterSlot";
import type { Player } from "./AvailablePlayersList";

interface TeamRosterProps {
  roster: Record<string, Player | null>;
  onRemovePlayer: (player: Player) => void;
  onMoveToBench?: (player: Player) => void;
  isLocked?: boolean;
  adminAdjustments?: Record<string, boolean>;
}

export function TeamRoster({ 
  roster, 
  onRemovePlayer, 
  onMoveToBench,
  isLocked = false,
  adminAdjustments = {}
}: TeamRosterProps) {
  const rosterPositions = [
    { key: "QB", label: "QB", required: true },
    { key: "RB1", label: "RB", required: true },
    { key: "RB2", label: "RB", required: true },
    { key: "WR1", label: "WR", required: true },
    { key: "WR2", label: "WR", required: true },
    { key: "TE", label: "TE", required: true },
    { key: "FLEX", label: "FLEX", required: false },
    { key: "K", label: "K", required: true },
    { key: "DEF", label: "DEF", required: true },
  ];

  return (
    <div className="bg-[#2C2F33] rounded-lg p-4 sm:p-6 border border-[#4A4E56] h-full flex flex-col">
      <h3 className="text-white mb-4 sm:mb-6 text-lg sm:text-xl flex items-center gap-2">
        Lineup Titular
        {isLocked && <span className="text-[#B22222] text-sm">🔒</span>}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1">
        {rosterPositions.map((position) => (
          <RosterSlot
            key={position.key}
            position={position.label}
            player={roster[position.key] || null}
            onRemovePlayer={onRemovePlayer}
            onMoveToBench={onMoveToBench}
            required={position.required}
            isLocked={isLocked}
            isAdminAdjusted={adminAdjustments[position.key] || false}
          />
        ))}
      </div>
    </div>
  );
}