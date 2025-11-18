export type Position = 'QB'|'RB'|'WR'|'TE'|'K'|'DEF'

export interface Player {
  id: string
  name: string
  position: Position
  team?: string
}

export interface League {
  id: string
  name: string
  teams: number
  divisions?: number
}
