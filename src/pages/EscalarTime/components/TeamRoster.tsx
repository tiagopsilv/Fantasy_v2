import * as React from "react";
import { RosterSlot } from "./RosterSlot";
import type { Player } from "./AvailablePlayersList";

export interface TeamRosterProps {
  roster: Record<string, Player | null>;
  onRemovePlayer: (player: Player) => void;
  onMoveToBench?: (player: Player) => void;
  isLocked?: boolean;
  adminAdjustments?: Record<string, boolean>;
}

interface RosterPosition {
  key: string;
  label: string;
  required: boolean;
}

const ROSTER_POSITIONS: readonly RosterPosition[] = [
  { key: "QB", label: "QB", required: true },
  { key: "RB1", label: "RB", required: true },
  { key: "RB2", label: "RB", required: true },
  { key: "WR1", label: "WR", required: true },
  { key: "WR2", label: "WR", required: true },
  { key: "TE", label: "TE", required: true },
  { key: "FLEX", label: "FLEX", required: false },
  { key: "K", label: "K", required: true },
  { key: "DEF", label: "DEF", required: true },
] as const;

export const TeamRoster = React.memo<TeamRosterProps>(({ 
  roster, 
  onRemovePlayer, 
  onMoveToBench,
  isLocked = false,
  adminAdjustments = {}
}) => {
  const handleRemove = React.useCallback((player: Player) => {
    if (!isLocked) {
      onRemovePlayer(player);
    }
  }, [isLocked, onRemovePlayer]);

  const handleMoveToBench = React.useCallback((player: Player) => {
    if (!isLocked && onMoveToBench) {
      onMoveToBench(player);
    }
  }, [isLocked, onMoveToBench]);

  return (
    <div className="bg-[#2C2F33] rounded-lg p-4 sm:p-6 border-2 border-[#0B6623] shadow-lg shadow-[#0B6623]/20 h-full flex flex-col">
      <div className="mb-4 sm:mb-6 pb-3 border-b-2 border-[#0B6623]/50">
        <div className="flex items-center gap-3">
          <h3 className="text-white text-xl sm:text-2xl font-bold flex items-center gap-2">
            Lineup Titular
            {isLocked && <span className="text-[#B22222] text-sm">🔒</span>}
          </h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 flex-1">
        {ROSTER_POSITIONS.map((position) => (
          <RosterSlot
            key={position.key}
            position={position.label}
            player={roster[position.key] || null}
            onRemovePlayer={handleRemove}
            onMoveToBench={handleMoveToBench}
            required={position.required}
            isLocked={isLocked}
            isAdminAdjusted={adminAdjustments[position.key] || false}
          />
        ))}
      </div>
    </div>
  );
});

TeamRoster.displayName = "TeamRoster";