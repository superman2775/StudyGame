import { todayISO } from './time'
import type { AppState, Deck } from './types'

const KEY = 'studygame_state_v1'

function defaultState(): AppState {
  return {
    version: 1,
    profile: {
      xp: 0,
      level: 1,
      streak: 0,
      lastStudyISO: undefined,
    },
    decks: [],
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as AppState
    if (!parsed || parsed.version !== 1) return defaultState()
    if (!parsed.profile || !Array.isArray(parsed.decks)) return defaultState()
    return parsed
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function computeLevelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 120) + 1)
}

export function bumpStudyStreak(lastStudyISO?: string): {
  streak: number
  lastStudyISO: string
  isNewDay: boolean
} {
  const today = todayISO()
  if (!lastStudyISO) return { streak: 1, lastStudyISO: today, isNewDay: true }
  const lastDay = lastStudyISO.slice(0, 10)
  if (lastDay === today) return { streak: 0, lastStudyISO: today, isNewDay: false }

  const yesterday = new Date(today + 'T00:00:00Z')
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const yISO = yesterday.toISOString().slice(0, 10)
  const isConsecutive = lastDay === yISO
  return {
    streak: isConsecutive ? 1 : -Infinity,
    lastStudyISO: today,
    isNewDay: true,
  }
}

export function sortDecks(decks: Deck[]): Deck[] {
  return [...decks].sort((a, b) => b.updatedISO.localeCompare(a.updatedISO))
}

