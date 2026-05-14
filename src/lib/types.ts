export type Id = string

export type Card = {
  id: Id
  front: string
  back: string
  box: number
  dueISO: string
  correct: number
  incorrect: number
  lastReviewedISO?: string
}

export type Deck = {
  id: Id
  name: string
  createdISO: string
  updatedISO: string
  cards: Card[]
}

export type Profile = {
  xp: number
  level: number
  streak: number
  lastStudyISO?: string
}

export type AppState = {
  version: number
  profile: Profile
  decks: Deck[]
}

