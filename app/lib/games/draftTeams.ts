// Pure helper shared by all team-based games. Shuffles members, splits into two
// teams, sorts each alphabetically by first name, and interleaves them into one
// global turn order (A0, B0, A1, B1, …). Team A guesses first.

import type { LobbyMember, Team } from '@/types/game.types'

export interface DraftedPlayer {
  userId: string
  name: string
  team: Team
  turnOrder: number
}

function firstNameKey(name: string): string {
  return (name.trim().split(/\s+/)[0] || name).toUpperCase()
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function draftTeams(members: LobbyMember[]): DraftedPlayer[] {
  const shuffled = shuffle(members)
  const mid = Math.ceil(shuffled.length / 2) // odd count → Team A gets the extra

  const sortByName = (a: LobbyMember, b: LobbyMember) => firstNameKey(a.name).localeCompare(firstNameKey(b.name))

  const teamA = shuffled.slice(0, mid).sort(sortByName)
  const teamB = shuffled.slice(mid).sort(sortByName)

  const players: DraftedPlayer[] = []
  const max = Math.max(teamA.length, teamB.length)
  let order = 0
  for (let i = 0; i < max; i++) {
    if (teamA[i]) players.push({ userId: teamA[i].userId, name: teamA[i].name, team: 'A', turnOrder: order++ })
    if (teamB[i]) players.push({ userId: teamB[i].userId, name: teamB[i].name, team: 'B', turnOrder: order++ })
  }
  return players
}
