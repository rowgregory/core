// Game.state shape for type === 'WHEEL' + the wheel layout/colors.
// Real-WoF style: 24 wedges, bright color rotation, black Bankrupt, white
// Lose a Turn. Spin first → consonant; vowels bought for $250; two-pot money.

import type { Team } from '@/types/game.types'

export type Winner = Team | 'TIE'
export type Wedge = number | 'BANKRUPT' | 'LOSE_TURN'
export type WheelPhase = 'AWAITING_SPIN' | 'SPINNING' | 'AWAITING_GUESS'

export const VOWELS = ['A', 'E', 'I', 'O', 'U'] as const
export const VOWEL_COST = 250

// 24-wedge layout modeled on the real syndicated wheel: dollar values with two
// Bankrupts and one Lose a Turn spread around, plus one big-money wedge.
export const WHEEL: Wedge[] = [
  900,
  'BANKRUPT',
  600,
  700,
  800,
  500,
  650,
  'LOSE_TURN',
  700,
  600,
  550,
  900,
  500,
  'BANKRUPT',
  800,
  650,
  600,
  700,
  500,
  2500,
  800,
  550,
  600,
  700
]

// Bright WoF-style color per wedge index. Values cycle through the classic
// rotation; Bankrupt is black, Lose a Turn is white. Top value ($2500) gets a
// rich magenta to stand out.
const VALUE_CYCLE = [
  '#1Fa34a', // green
  '#F4C20D', // yellow
  '#E8731C', // orange
  '#D7263D', // red
  '#E83E8C', // pink
  '#7B2FF7', // purple
  '#17A2B8', // teal
  '#2D6CDF' // blue
]

export function wedgeColor(w: Wedge, i: number): string {
  if (w === 'BANKRUPT') return '#0a0a0a' // black
  if (w === 'LOSE_TURN') return '#f5f5f5' // white
  if (typeof w === 'number' && w >= 2000) return '#C20FA8' // big-money magenta
  return VALUE_CYCLE[i % VALUE_CYCLE.length]
}

// Text color that reads on each wedge (dark text on white/yellow, else white).
export function wedgeTextColor(w: Wedge, i: number): string {
  if (w === 'LOSE_TURN') return '#0a0a0a'
  const bg = wedgeColor(w, i)
  if (bg === '#F4C20D' || bg === '#f5f5f5') return '#0a0a0a'
  return '#ffffff'
}

export function wedgeLabel(w: Wedge): string {
  if (w === 'BANKRUPT') return 'BANKRUPT'
  if (w === 'LOSE_TURN') return 'LOSE A TURN'
  return `$${w}`
}

export interface WheelState {
  phrase: string
  hint: string
  revealed: string[]
  guessed: string[]

  turnIndex: number
  phase: WheelPhase

  lastSpin: Wedge | null
  lastSpinIndex: number | null
  spinNonce: number

  roundMoneyA: number
  roundMoneyB: number
  bankedA: number
  bankedB: number

  winner: Winner | null
}

export function initialWheelState(phrase: string, hint: string): WheelState {
  return {
    phrase,
    hint,
    revealed: [],
    guessed: [],
    turnIndex: 0,
    phase: 'AWAITING_SPIN',
    lastSpin: null,
    lastSpinIndex: null,
    spinNonce: 0,
    roundMoneyA: 0,
    roundMoneyB: 0,
    bankedA: 0,
    bankedB: 0,
    winner: null
  }
}

export const isVowel = (l: string): boolean => (VOWELS as readonly string[]).includes(l)
export const isConsonant = (l: string): boolean => /^[A-Z]$/.test(l) && !isVowel(l)

export function teamTotal(state: WheelState, team: Team): number {
  return team === 'A' ? state.roundMoneyA + state.bankedA : state.roundMoneyB + state.bankedB
}
