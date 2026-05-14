import { addDaysISO, todayISO } from './time'
import type { Card } from './types'

const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30] as const

export function newCard(front: string, back: string, id: string): Card {
  const today = todayISO()
  return {
    id,
    front: front.trim(),
    back: back.trim(),
    box: 1,
    dueISO: today,
    correct: 0,
    incorrect: 0,
  }
}

export function gradeCard(card: Card, correct: boolean): Card {
  const today = todayISO()
  const nextBox = correct ? Math.min(5, card.box + 1) : 1
  const interval = BOX_INTERVAL_DAYS[nextBox] ?? 1
  return {
    ...card,
    box: nextBox,
    dueISO: addDaysISO(today, interval),
    correct: card.correct + (correct ? 1 : 0),
    incorrect: card.incorrect + (correct ? 0 : 1),
    lastReviewedISO: today,
  }
}

export function isDue(card: Card, nowISO = todayISO()): boolean {
  return card.dueISO <= nowISO
}

